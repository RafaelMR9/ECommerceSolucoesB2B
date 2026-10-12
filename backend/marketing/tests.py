from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from core.models import User
from products.models import Category, Product
from suppliers.models import Supplier

from .models import Promotion


class PromotionTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        supplier = Supplier.objects.create(
            name="Supplier", email="supplier@example.test", cnpj="00.000.000/0001-00"
        )
        category = Category.objects.create(name="Office")
        self.product = Product.objects.create(
            name="Paper",
            category=category,
            supplier=supplier,
            currentStockQuantity=10,
            costPrice=20,
            salePrice=50,
            packaging=1,
            description="Paper",
            image="paper.jpg",
        )
        self.start = timezone.now() + timedelta(days=1)
        self.end = self.start + timedelta(days=1)
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def create(self, **overrides):
        return self.client.post(
            "/api/marketing/register/",
            {
                "product": self.product.pk,
                "salePrice": 30,
                "startDate": self.start.isoformat(),
                "endDate": self.end.isoformat(),
                **overrides,
            },
            format="json",
        )

    def test_invalid_price_and_dates_are_rejected(self):
        for fields in (
            {"salePrice": -1},
            {"salePrice": "NaN"},
            {"startDate": (timezone.now() - timedelta(days=1)).isoformat()},
            {"endDate": self.start.isoformat()},
        ):
            self.assertEqual(self.create(**fields).status_code, 400, fields)
        self.assertFalse(Promotion.objects.exists())

    def test_overlapping_promotion_is_rejected_including_boundaries(self):
        self.assertEqual(self.create().status_code, 201)
        self.assertEqual(self.create().status_code, 400)
        self.assertEqual(
            self.create(
                startDate=self.end.isoformat(),
                endDate=(self.end + timedelta(days=1)).isoformat(),
            ).status_code,
            400,
        )
        self.assertEqual(Promotion.objects.count(), 1)

    def test_legacy_overlapping_promotions_have_deterministic_lookup(self):
        now = timezone.now()
        first = Promotion.objects.create(
            product=self.product,
            salePrice=30,
            startDate=now - timedelta(days=1),
            endDate=now + timedelta(days=1),
        )
        Promotion.objects.create(
            product=self.product,
            salePrice=25,
            startDate=first.startDate,
            endDate=first.endDate,
        )
        response = self.client.get(f"/api/marketing/promotion/{self.product.pk}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], first.pk)

    def test_missing_active_promotion_is_null(self):
        response = self.client.get(f"/api/marketing/promotion/{self.product.pk}/")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.json())

    def test_buyer_cannot_create_promotion(self):
        buyer = User.objects.create_user(
            email="buyer@example.test", username="buyer", password="test-password"
        )
        self.client.force_authenticate(buyer)
        self.assertEqual(self.create().status_code, 403)
