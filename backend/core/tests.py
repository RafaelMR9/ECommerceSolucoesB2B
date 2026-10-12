from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from orders.models import SalesOrder

from .models import PasswordResetToken, User


class AccountTests(TestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(
            email="buyer@example.test", username="buyer", password="test-password"
        )
        self.other = User.objects.create_user(
            email="other@example.test", username="other", password="test-password"
        )
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        self.client = APIClient()

    def test_registration_requires_password_and_confirmation(self):
        for fields in ({}, {"email": "new@example.test", "username": "new"}):
            response = self.client.post("/api/users/register/", fields, format="json")
            self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 3)

    def test_registration_hashes_password_and_cannot_grant_roles(self):
        response = self.client.post(
            "/api/users/register/",
            {
                "email": "new@example.test",
                "username": "new",
                "password": "test-password",
                "confirmPassword": "test-password",
                "is_staff": True,
                "is_superuser": True,
                "canPurchase": False,
                "authorizeFature": False,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username="new")
        self.assertTrue(user.check_password("test-password"))
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.canPurchase)
        self.assertNotIn("password", response.data)

    def test_registration_rejects_invalid_and_mismatched_password(self):
        for password, confirmation in (
            ("123456789", "123456789"),
            ("short", "short"),
            ("test-password", "another-password"),
        ):
            response = self.client.post(
                "/api/users/register/",
                {
                    "email": "new@example.test",
                    "username": "new",
                    "password": password,
                    "confirmPassword": confirmation,
                },
                format="json",
            )
            self.assertEqual(response.status_code, 400)

    def test_multiple_accounts_can_leave_optional_unique_fields_empty(self):
        for username in ("first", "second"):
            response = self.client.post(
                "/api/users/register/",
                {
                    "email": f"{username}@example.test",
                    "username": username,
                    "password": "test-password",
                    "confirmPassword": "test-password",
                    "name": "",
                    "address": "",
                    "cpf": "",
                    "cnpj": "",
                },
                format="json",
            )
            self.assertEqual(response.status_code, 201)
            for field in ("name", "address", "cpf", "cnpj"):
                self.assertIsNone(response.data[field])

    def test_profile_is_private_and_updates_are_partial(self):
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.get(f"/api/users/{self.other.pk}/detail/").status_code, 404
        )
        self.assertEqual(
            self.client.put(
                f"/api/users/{self.other.pk}/update/",
                {"name": "Changed"},
                format="json",
            ).status_code,
            404,
        )
        response = self.client.put(
            f"/api/users/{self.buyer.pk}/update/", {"name": "Buyer"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.buyer.refresh_from_db()
        self.assertEqual(self.buyer.name, "Buyer")
        self.assertEqual(self.buyer.email, "buyer@example.test")

    def test_invalid_profile_does_not_partially_save(self):
        self.client.force_authenticate(self.buyer)
        response = self.client.patch(
            f"/api/users/{self.buyer.pk}/update/",
            {
                "name": "Changed",
                "cpf": "invalid",
                "email": self.other.email,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.buyer.refresh_from_db()
        self.assertIsNone(self.buyer.name)
        self.assertEqual(self.buyer.email, "buyer@example.test")

    def test_credit_approval_is_administrative(self):
        path = f"/api/users/{self.buyer.pk}/update/"
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.patch(
                path, {"authorizeFature": True}, format="json"
            ).status_code,
            400,
        )
        self.client.force_authenticate(self.admin)
        self.assertEqual(
            self.client.patch(
                path, {"authorizeFature": True}, format="json"
            ).status_code,
            200,
        )
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.patch(
                path, {"authorizeFature": None}, format="json"
            ).status_code,
            200,
        )
        self.buyer.refresh_from_db()
        self.assertTrue(self.buyer.authorizeFature)

    def test_buyer_cannot_enable_purchases_or_change_roles(self):
        User.objects.filter(pk=self.buyer.pk).update(canPurchase=False)
        self.client.force_authenticate(self.buyer)
        response = self.client.patch(
            f"/api/users/{self.buyer.pk}/update/",
            {
                "canPurchase": True,
                "is_superuser": True,
                "is_staff": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.buyer.refresh_from_db()
        self.assertFalse(self.buyer.canPurchase)
        self.assertFalse(self.buyer.is_superuser)
        self.assertFalse(self.buyer.is_staff)

    def test_private_routes_require_authentication_and_administration(self):
        for path in (
            "/api/users/",
            "/api/products/",
            "/api/support/",
            "/api/orders/salesOrder/user/",
        ):
            self.assertEqual(self.client.get(path).status_code, 401)
        self.client.force_authenticate(self.buyer)
        for path in (
            "/api/users/",
            "/api/suppliers/",
            "/api/carriers/",
            "/api/users/user_id?email=other@example.test",
        ):
            self.assertEqual(self.client.get(path).status_code, 403)

    @patch("core.views.send_mail")
    def test_password_recovery_does_not_disclose_existing_accounts(self, send_mail):
        path = "/api/users/passwordReset/sendResetEmail/"
        known = self.client.post(path, {"email": self.buyer.email}, format="json")
        missing = self.client.post(
            path, {"email": "missing@example.test"}, format="json"
        )
        self.assertEqual(known.status_code, 200)
        self.assertEqual(known.data, missing.data)
        send_mail.assert_called_once()
        self.assertEqual(PasswordResetToken.objects.count(), 1)
        self.assertEqual(
            self.client.post(path, {"email": "invalid"}, format="json").status_code, 400
        )

    def test_deleting_user_preserves_order_history(self):
        self.client.force_authenticate(self.admin)
        order = SalesOrder.objects.create(
            user=self.buyer, totalSaleValue=20, finished=True
        )
        self.assertEqual(
            self.client.delete(f"/api/users/{self.buyer.pk}/delete/").status_code, 400
        )
        self.assertTrue(SalesOrder.objects.filter(pk=order.pk).exists())
        self.assertEqual(
            self.client.delete(f"/api/users/{self.other.pk}/delete/").status_code, 204
        )

    def test_superuser_manager_rejects_disabled_administrator_flags(self):
        for flag in ("is_superuser", "is_staff"):
            with self.assertRaises(ValueError):
                User.objects.create_superuser(
                    username="invalid", cpf="111.111.111-11", **{flag: False}
                )
