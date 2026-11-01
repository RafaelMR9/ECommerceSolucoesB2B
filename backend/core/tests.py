from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from carriers.models import Carrier
from orders.models import ItemSalesOrder, ItemSupplierOrder, SalesOrder, SupplierOrder
from products.models import Category, Product
from suppliers.models import Supplier
from support.models import Ticket

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

    def test_current_user_requires_authentication_and_ignores_other_user_ids(self):
        self.assertEqual(self.client.get("/api/users/me/").status_code, 401)
        token = AccessToken.for_user(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        with self.assertNumQueries(2):
            response = self.client.get(f"/api/users/me/?user={self.other.pk}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.buyer.pk)
        self.assertEqual(response.data["cartCount"], 0)
        self.assertNotIn("password", response.data)

    def test_invalid_refresh_token_is_rejected(self):
        response = self.client.post(
            "/api/users/token/refresh/", {"refresh": "invalid"}, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_authenticated_profile_reads_user_only_once(self):
        token = AccessToken.for_user(self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        with self.assertNumQueries(1):
            response = self.client.get(f"/api/users/{self.buyer.pk}/detail/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.buyer.pk)

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

    def test_analise_de_credito_exige_administrador(self):
        path = f"/api/users/{self.buyer.pk}/credit-analysis/"
        self.assertEqual(
            self.client.post(path, {"approved": True}, format="json").status_code,
            401,
        )
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.post(path, {"approved": True}, format="json").status_code,
            403,
        )
        self.assertFalse(Ticket.objects.exists())

    def test_aprovacao_de_credito_cria_ticket_e_nao_pode_ser_repetida(self):
        User.objects.filter(pk=self.buyer.pk).update(authorizeFature=False)
        self.client.force_authenticate(self.admin)
        path = f"/api/users/{self.buyer.pk}/credit-analysis/"
        response = self.client.post(path, {"approved": True}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["authorizeFature"])
        ticket = Ticket.objects.get()
        self.assertEqual(ticket.sender_id, self.admin.pk)
        self.assertEqual(ticket.recipient_id, self.buyer.pk)
        self.assertEqual(
            ticket.content,
            "Sua organização está autorizada a realizar compras faturadas.",
        )
        self.assertEqual(
            self.client.post(path, {"approved": False}, format="json").status_code,
            400,
        )
        self.buyer.refresh_from_db()
        self.assertTrue(self.buyer.authorizeFature)
        self.assertEqual(Ticket.objects.count(), 1)

    def test_recusa_de_credito_cria_ticket_sem_autorizar_compras(self):
        User.objects.filter(pk=self.buyer.pk).update(authorizeFature=False)
        self.client.force_authenticate(self.admin)
        path = f"/api/users/{self.buyer.pk}/credit-analysis/"
        response = self.client.post(path, {"approved": False}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data["authorizeFature"])
        self.assertEqual(
            Ticket.objects.get().content,
            "Sua solicitação de compras faturadas não foi aprovada neste momento.",
        )

    def test_analise_rejeita_resultado_invalido_ou_conta_administrativa(self):
        User.objects.filter(pk=self.buyer.pk).update(authorizeFature=False)
        self.client.force_authenticate(self.admin)
        path = f"/api/users/{self.buyer.pk}/credit-analysis/"
        for data in ({}, {"approved": None}, {"approved": "inválido"}):
            self.assertEqual(
                self.client.post(path, data, format="json").status_code, 400
            )
        self.assertEqual(
            self.client.post(
                f"/api/users/{self.admin.pk}/credit-analysis/",
                {"approved": True},
                format="json",
            ).status_code,
            404,
        )
        self.buyer.refresh_from_db()
        self.assertFalse(self.buyer.authorizeFature)
        self.assertFalse(Ticket.objects.exists())

    @patch(
        "core.views.Ticket.objects.create", side_effect=RuntimeError("Falha no ticket")
    )
    def test_falha_no_ticket_desfaz_a_aprovacao_de_credito(self, create_ticket):
        User.objects.filter(pk=self.buyer.pk).update(authorizeFature=False)
        self.client.force_authenticate(self.admin)
        with self.assertRaises(RuntimeError):
            self.client.post(
                f"/api/users/{self.buyer.pk}/credit-analysis/",
                {"approved": True},
                format="json",
            )
        create_ticket.assert_called_once()
        self.buyer.refresh_from_db()
        self.assertFalse(self.buyer.authorizeFature)
        self.assertFalse(Ticket.objects.exists())

    def test_analise_aceita_organizacao_com_nome_longo(self):
        User.objects.filter(pk=self.buyer.pk).update(
            name="A" * 255, authorizeFature=False
        )
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            f"/api/users/{self.buyer.pk}/credit-analysis/",
            {"approved": True},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertLessEqual(len(Ticket.objects.get().subject), 255)


class CartCountTests(TestCase):
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
        self.supplier = Supplier.objects.create(
            name="Fornecedor", email="supplier@example.test", cnpj="00.000.000/0001-00"
        )
        self.product = Product.objects.create(
            name="Produto",
            category=Category.objects.create(name="Categoria"),
            supplier=self.supplier,
            currentStockQuantity=100,
            costPrice=5,
            salePrice=10,
            packaging=1,
            description="Produto de teste",
            image="produto.jpg",
        )
        self.client = APIClient()

    def test_contador_vazio_retorna_zero_para_os_dois_perfis(self):
        for user in (self.buyer, self.admin):
            self.client.force_authenticate(user)
            self.assertEqual(self.client.get("/api/users/me/").data["cartCount"], 0)

    def test_contador_soma_quantidades_apenas_do_primeiro_carrinho_do_usuario(self):
        first = SalesOrder.objects.create(user=self.buyer, totalSaleValue=0)
        later = SalesOrder.objects.create(user=self.buyer, totalSaleValue=0)
        finished = SalesOrder.objects.create(
            user=self.buyer, totalSaleValue=50, finished=True
        )
        other = SalesOrder.objects.create(user=self.other, totalSaleValue=0)
        for order, quantity in (
            (first, 2),
            (first, 3),
            (later, 20),
            (finished, 30),
            (other, 40),
        ):
            ItemSalesOrder.objects.create(
                salesOrder=order,
                product=self.product,
                quantity=quantity,
                salePrice=quantity * 10,
            )
        self.client.force_authenticate(self.buyer)
        with self.assertNumQueries(2):
            response = self.client.get(f"/api/users/me/?user={self.other.pk}")
        self.assertEqual(response.data["cartCount"], 5)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get("/api/users/me/").data["cartCount"], 40)

    def test_contador_administrativo_usa_apenas_o_carrinho_de_reposicao(self):
        sales = SalesOrder.objects.create(user=self.admin, totalSaleValue=0)
        ItemSalesOrder.objects.create(
            salesOrder=sales, product=self.product, quantity=50, salePrice=500
        )
        first = SupplierOrder.objects.create(
            user=self.admin, supplier=self.supplier, totalCostValue=0
        )
        later = SupplierOrder.objects.create(
            user=self.admin, supplier=self.supplier, totalCostValue=0
        )
        for order, quantity in ((first, 4), (later, 20)):
            ItemSupplierOrder.objects.create(
                supplierOrder=order,
                product=self.product,
                quantity=quantity,
                costPrice=quantity * 5,
            )
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get("/api/users/me/").data["cartCount"], 4)

    def test_contador_reflete_alteracoes_sem_cache_entre_leituras(self):
        order = SalesOrder.objects.create(user=self.buyer, totalSaleValue=0)
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.get("/api/users/me/").data["cartCount"], 0)
        item = ItemSalesOrder.objects.create(
            salesOrder=order, product=self.product, quantity=3, salePrice=30
        )
        self.assertEqual(self.client.get("/api/users/me/").data["cartCount"], 3)
        item.delete()
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.data["cartCount"], 0)
        self.assertEqual(response["Cache-Control"], "private, no-store")


class DemoDataTests(TestCase):
    fixtures = ["demo"]

    def test_contatos_da_demonstracao_sao_ficticios(self):
        for model in (User, Supplier, Carrier):
            emails = list(model.objects.values_list("email", flat=True))
            self.assertTrue(emails)
            self.assertTrue(
                all(email.endswith("@demonstracao.invalid") for email in emails)
            )

    def test_demonstracao_preserva_perfis_e_permite_novos_cadastros(self):
        buyer = User.objects.get(username="compradora-demo")
        admin = User.objects.get(username="atacadista-demo")
        self.assertFalse(buyer.is_superuser)
        self.assertTrue(buyer.canPurchase)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
        existing_ids = set(Category.objects.values_list("pk", flat=True))
        category = Category.objects.create(name="Categoria de Teste")
        self.assertNotIn(category.pk, existing_ids)
