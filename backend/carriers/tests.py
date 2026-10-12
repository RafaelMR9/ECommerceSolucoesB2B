from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from core.models import User
from orders.models import SalesOrder

from .models import Carrier, SalesShipment


class CarrierTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        self.carrier = Carrier.objects.create(
            name="Carrier", email="carrier@example.test", cnpj="00.000.000/0001-00"
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_delivered_orders_prevent_deletion_of_shipping_history(self):
        order = SalesOrder.objects.create(
            user=self.admin,
            totalSaleValue=20,
            finished=True,
            sending=True,
            recieved=True,
        )
        shipment = SalesShipment.objects.create(
            carrier=self.carrier, salesOrder=order, dateHour=timezone.now()
        )
        self.assertEqual(
            self.client.delete(f"/api/carriers/{self.carrier.pk}/delete/").status_code,
            400,
        )
        self.assertTrue(SalesShipment.objects.filter(pk=shipment.pk).exists())

    def test_direct_shipment_creation_cannot_bypass_order_processing(self):
        self.assertEqual(
            self.client.post(
                "/api/carriers/salesShipment/register/", {}, format="json"
            ).status_code,
            405,
        )
        self.assertFalse(SalesShipment.objects.exists())

    def test_literal_search_and_deletion_without_history(self):
        self.assertEqual(
            self.client.get("/api/carriers/filter/?fetchCarriers=[").data, []
        )
        self.assertEqual(
            self.client.delete(f"/api/carriers/{self.carrier.pk}/delete/").status_code,
            204,
        )
