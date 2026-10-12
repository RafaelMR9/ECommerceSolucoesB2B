import uuid
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from carriers.models import Carrier, SalesShipment
from core.models import PasswordResetToken, User
from core.serializers import UserSerializer
from marketing.models import Promotion
from products.models import Category, Product
from suppliers.models import Supplier

from .models import ItemSalesInvoice, SalesInvoice, SalesOrder, SupplierOrder


class CheckoutTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
            authorizeFature=True,
        )
        self.buyer = User.objects.create_user(
            email="buyer@example.test",
            username="buyer",
            password="test-password",
            authorizeFature=True,
        )
        self.supplier = Supplier.objects.create(
            name="Supplier", cnpj="00.000.000/0001-00", email="supplier@example.test"
        )
        category = Category.objects.create(name="Office")
        self.product = Product.objects.create(
            name="Keyboard",
            category=category,
            supplier=self.supplier,
            currentStockQuantity=10,
            costPrice=20,
            salePrice=50,
            packaging=1,
            description="Keyboard",
            image="keyboard.jpg",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.buyer)

    def add(self, quantity=2):
        return self.client.post(
            "/api/orders/cart/add/",
            {"product": self.product.pk, "quantity": quantity},
            format="json",
        )

    def test_price_and_stock_are_computed_on_server(self):
        response = self.client.post(
            "/api/orders/cart/add/",
            {
                "product": self.product.pk,
                "quantity": 2,
                "salePrice": 0,
                "user": self.admin.pk,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        order = SalesOrder.objects.get()
        self.assertEqual(order.user, self.buyer)
        self.assertEqual(order.itemsalesorder_set.get().salePrice, 100)
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 8)

    def test_active_promotion_is_used(self):
        Promotion.objects.create(
            product=self.product,
            salePrice=30,
            startDate=timezone.now() - timedelta(days=1),
            endDate=timezone.now() + timedelta(days=1),
        )
        self.add()
        self.assertEqual(
            SalesOrder.objects.get().itemsalesorder_set.get().salePrice, 60
        )

    def test_invalid_quantity_and_insufficient_stock_do_not_create_order(self):
        for quantity in (0, -1, 1.5, 11):
            self.assertEqual(self.add(quantity).status_code, 400)
        self.assertFalse(SalesOrder.objects.exists())
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 10)

    def test_removal_restores_stock_and_checks_ownership(self):
        item = self.add().data["id"]
        other = User.objects.create_user(
            email="other@example.test", username="other", password="test-password"
        )
        self.client.force_authenticate(other)
        self.assertEqual(
            self.client.delete(f"/api/orders/cart/items/{item}/delete/").status_code,
            404,
        )
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.delete(f"/api/orders/cart/items/{item}/delete/").status_code,
            204,
        )
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 10)

    def test_checkout_preserves_invoice_items_and_recurring_fields(self):
        self.add()
        self.add(1)
        delivery = (timezone.localdate() + timedelta(days=15)).isoformat()
        response = self.client.post(
            "/api/orders/checkout/",
            {"deliveryDate": delivery, "deliveryFrequency": 15, "faturedPayment": True},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        order = SalesOrder.objects.get()
        self.assertTrue(order.finished)
        self.assertTrue(order.faturedPayment)
        self.assertEqual(order.deliveryFrequency, 15)
        self.assertEqual(order.totalSaleValue, 150)
        self.assertEqual(SalesInvoice.objects.get().salePrice, 150)
        self.assertEqual(ItemSalesInvoice.objects.count(), 2)
        self.assertEqual(response.data["next"], "/support")

    def test_failed_checkout_rolls_back_invoice_and_order(self):
        self.add()
        with patch(
            "orders.checkout.Ticket.objects.create",
            side_effect=RuntimeError("simulated failure"),
        ):
            with self.assertRaises(RuntimeError):
                self.client.post("/api/orders/checkout/", {}, format="json")
        self.assertFalse(SalesInvoice.objects.exists())
        self.assertFalse(SalesOrder.objects.get().finished)

    def test_empty_cart_and_unauthorized_credit_are_rejected(self):
        self.assertEqual(
            self.client.post("/api/orders/checkout/", {}, format="json").status_code,
            400,
        )
        self.add()
        self.buyer.authorizeFature = False
        self.buyer.save()
        self.assertEqual(
            self.client.post(
                "/api/orders/checkout/", {"faturedPayment": True}, format="json"
            ).status_code,
            400,
        )
        self.assertFalse(SalesInvoice.objects.exists())

    def test_recurring_delivery_requires_date_and_minimum_frequency(self):
        self.add()
        self.assertEqual(
            self.client.post(
                "/api/orders/checkout/", {"deliveryFrequency": 15}, format="json"
            ).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(
                "/api/orders/checkout/", {"deliveryFrequency": 2}, format="json"
            ).status_code,
            400,
        )

    def test_restock_keeps_supplier_and_does_not_reserve_sales_stock(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.add().status_code, 201)
        other_supplier = Supplier.objects.create(
            name="Other Supplier", cnpj="00.000.000/0002-00", email="other@example.test"
        )
        self.product.supplier = other_supplier
        self.product.save()
        self.assertEqual(self.add().status_code, 400)
        self.assertEqual(SupplierOrder.objects.count(), 1)
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 10)
        self.assertEqual(
            self.client.post("/api/orders/checkout/", {}, format="json").data["next"],
            "/orders",
        )

    def test_cart_requires_authenticated_session(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.add().status_code, 401)

    def finish(self, supplier=False):
        if supplier:
            self.client.force_authenticate(self.admin)
        self.add()
        return self.client.post("/api/orders/checkout/", {}, format="json").data[
            "order"
        ]

    def action(self, order, action, supplier=False, **data):
        kind = "supplier" if supplier else "sales"
        return self.client.post(
            f"/api/orders/{kind}Order/{order}/action/",
            {"action": action, **data},
            format="json",
        )

    def test_cancellation_restores_stock_only_once(self):
        order = self.finish()
        self.assertEqual(self.action(order, "cancel").status_code, 200)
        self.assertEqual(self.action(order, "cancel").status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 10)

    def test_order_actions_require_role_and_ownership(self):
        order = self.finish()
        self.assertEqual(self.action(order, "prepare").status_code, 403)
        other = User.objects.create_user(
            email="other@example.test", username="other", password="test-password"
        )
        self.client.force_authenticate(other)
        self.assertEqual(self.action(order, "cancel").status_code, 404)

    def test_shipment_requires_preparation_and_valid_carrier(self):
        order = self.finish()
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.action(order, "send").status_code, 400)
        self.assertEqual(self.action(order, "prepare").status_code, 200)
        self.assertEqual(self.action(order, "send", carrier=9999).status_code, 404)
        self.assertFalse(SalesShipment.objects.exists())
        carrier = Carrier.objects.create(
            name="Carrier", email="carrier@example.test", cnpj="00.000.000/0003-00"
        )
        self.assertEqual(
            self.action(order, "send", carrier=carrier.pk).status_code, 200
        )
        self.assertEqual(
            self.action(order, "send", carrier=carrier.pk).status_code, 400
        )
        self.assertEqual(SalesShipment.objects.count(), 1)
        self.assertEqual(self.action(order, "receive").status_code, 200)

    def test_restock_receipt_increments_stock_only_once(self):
        order = self.finish(supplier=True)
        self.assertEqual(self.action(order, "receive", supplier=True).status_code, 200)
        self.assertEqual(self.action(order, "receive", supplier=True).status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.currentStockQuantity, 12)

    def test_payment_regularization_restores_purchase_permission(self):
        order = self.finish()
        self.client.force_authenticate(self.admin)
        self.action(order, "prepare")
        self.assertEqual(self.action(order, "unpaid").status_code, 200)
        self.buyer.refresh_from_db()
        self.assertFalse(self.buyer.canPurchase)
        self.assertEqual(self.action(order, "paid").status_code, 200)
        self.buyer.refresh_from_db()
        self.assertTrue(self.buyer.canPurchase)

    def test_administrator_lookup_accepts_multiple_administrators(self):
        User.objects.create_user(
            email="second@example.test",
            username="second",
            password="test-password",
            is_superuser=True,
        )
        self.assertEqual(self.client.get("/api/users/admin_id").status_code, 200)

    def test_order_reads_cannot_select_another_account(self):
        order = self.finish()
        other = User.objects.create_user(
            email="other@example.test", username="other", password="test-password"
        )
        self.client.force_authenticate(other)
        self.assertEqual(
            self.client.get(f"/api/orders/salesOrder/user/?user={self.buyer.pk}").data,
            [],
        )
        self.assertEqual(
            self.client.get(
                f"/api/orders/itemSalesOrder/{order}/?user={self.buyer.pk}"
            ).data,
            [],
        )

    def test_legacy_writes_cannot_bypass_transactional_checkout(self):
        paths = (
            "salesOrder/register/",
            "itemSalesOrder/register/",
            "salesInvoice/register/",
            "supplierOrder/register/",
            "itemSupplierOrder/register/",
            "supplierInvoice/register/",
        )
        for path in paths:
            self.assertEqual(
                self.client.post("/api/orders/" + path, {}, format="json").status_code,
                403,
            )
        self.client.force_authenticate(self.admin)
        for path in paths:
            self.assertEqual(
                self.client.post("/api/orders/" + path, {}, format="json").status_code,
                405,
            )
        self.assertFalse(SalesOrder.objects.exists())
        self.assertFalse(SupplierOrder.objects.exists())

    def test_all_unpaid_orders_must_be_regularized_before_purchasing(self):
        first = self.finish()
        second = self.finish()
        self.client.force_authenticate(self.admin)
        for order in (first, second):
            self.assertEqual(self.action(order, "prepare").status_code, 200)
            self.assertEqual(self.action(order, "unpaid").status_code, 200)
        self.assertEqual(self.action(first, "paid").status_code, 200)
        self.buyer.refresh_from_db()
        self.assertFalse(self.buyer.canPurchase)
        self.assertEqual(self.action(second, "paid").status_code, 200)
        self.buyer.refresh_from_db()
        self.assertTrue(self.buyer.canPurchase)

    def test_payment_notification_failure_rolls_back_purchase_permission(self):
        order = self.finish()
        self.client.force_authenticate(self.admin)
        self.action(order, "prepare")
        with patch(
            "orders.actions.Ticket.objects.create",
            side_effect=RuntimeError("simulated failure"),
        ):
            with self.assertRaises(RuntimeError):
                self.action(order, "unpaid")
        self.assertIsNone(SalesOrder.objects.get(pk=order).paid)
        self.buyer.refresh_from_db()
        self.assertTrue(self.buyer.canPurchase)


class PasswordResetSafetyTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="recover@example.test", username="recover", password="old-password"
        )
        self.token = PasswordResetToken.objects.create(
            user=self.user, token=uuid.uuid4()
        )
        self.client = APIClient()

    def reset(self, token):
        return self.client.put(
            f"/api/users/passwordReset/{self.user.pk}/update/",
            {
                "token": token,
                "password": "new-password",
                "confirmPassword": "new-password",
            },
            format="json",
        )

    def test_check_does_not_consume_token_and_reset_consumes_it(self):
        self.assertTrue(
            self.client.get(
                f"/api/users/passwordReset/checkExistence/?token={self.token.token}"
            ).data["status"]
        )
        self.assertTrue(PasswordResetToken.objects.exists())
        self.assertEqual(self.reset(str(self.token.token)).status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("new-password"))
        self.assertFalse(PasswordResetToken.objects.exists())
        self.assertEqual(self.reset(str(self.token.token)).status_code, 400)

    def test_missing_invalid_and_expired_tokens_cannot_reset_password(self):
        self.assertEqual(self.reset(None).status_code, 400)
        self.assertEqual(self.reset(str(uuid.uuid4())).status_code, 400)
        PasswordResetToken.objects.filter(pk=self.token.pk).update(
            created_at=timezone.now() - timedelta(hours=2)
        )
        self.assertEqual(self.reset(str(self.token.token)).status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("old-password"))

    def test_password_hash_is_never_serialized(self):
        self.assertNotIn("password", UserSerializer(self.user).data)
