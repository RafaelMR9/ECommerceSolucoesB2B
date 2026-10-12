from django.test import TestCase
from rest_framework.test import APIClient

from core.models import User
from orders.models import SupplierOrder

from .models import Supplier


class SupplierTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        self.supplier = Supplier.objects.create(
            name="Supplier", email="supplier@example.test", cnpj="00.000.000/0001-00"
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_completed_orders_prevent_deletion_of_supplier_history(self):
        order = SupplierOrder.objects.create(
            user=self.admin,
            supplier=self.supplier,
            totalCostValue=20,
            finished=True,
            recieved=True,
        )
        self.assertEqual(
            self.client.delete(
                f"/api/suppliers/{self.supplier.pk}/delete/"
            ).status_code,
            400,
        )
        self.assertTrue(SupplierOrder.objects.filter(pk=order.pk).exists())

    def test_duplicate_email_and_invalid_cnpj_do_not_partially_update(self):
        other = Supplier.objects.create(
            name="Other", email="other@example.test", cnpj="00.000.000/0002-00"
        )
        for fields in ({"email": other.email}, {"cnpj": "invalid"}):
            response = self.client.put(
                f"/api/suppliers/{self.supplier.pk}/update/",
                {"name": "Changed", **fields},
                format="json",
            )
            self.assertEqual(response.status_code, 400)
        self.supplier.refresh_from_db()
        self.assertEqual(self.supplier.name, "Supplier")

    def test_literal_search_and_deletion_without_history(self):
        self.assertEqual(
            self.client.get("/api/suppliers/filter/?fetchSuppliers=[").data, []
        )
        self.assertEqual(
            self.client.delete(
                f"/api/suppliers/{self.supplier.pk}/delete/"
            ).status_code,
            204,
        )
