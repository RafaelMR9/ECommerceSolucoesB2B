from django.test import TestCase
from rest_framework.test import APIClient

from core.models import User
from suppliers.models import Supplier

from .models import Category, Product


class CatalogTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        self.buyer = User.objects.create_user(
            email="buyer@example.test", username="buyer", password="test-password"
        )
        self.supplier = Supplier.objects.create(
            name="Supplier", email="supplier@example.test", cnpj="00.000.000/0001-00"
        )
        self.root = Category.objects.create(name="Office")
        self.child = Category.objects.create(name="Printing", category=self.root)
        self.leaf = Category.objects.create(name="Paper", category=self.child)
        self.product = Product.objects.create(
            name="Paper",
            category=self.leaf,
            supplier=self.supplier,
            currentStockQuantity=10,
            costPrice=20,
            salePrice=50,
            packaging=1,
            description="Paper",
            image="paper.jpg",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_category_cycle_and_self_parent_are_rejected(self):
        path = f"/api/products/categories/{self.root.pk}/update/"
        for parent in (self.root.pk, self.leaf.pk):
            response = self.client.patch(path, {"category": parent}, format="json")
            self.assertEqual(response.status_code, 400)
        self.root.refresh_from_db()
        self.assertIsNone(self.root.category_id)

    def test_category_rename_keeps_parent(self):
        response = self.client.put(
            f"/api/products/categories/{self.leaf.pk}/update/",
            {"name": "Sheets"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.leaf.refresh_from_db()
        self.assertEqual(self.leaf.category_id, self.child.pk)

    def test_category_deletion_preserves_products_in_all_descendants(self):
        response = self.client.delete(
            f"/api/products/categories/{self.root.pk}/delete/"
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue(Product.objects.filter(pk=self.product.pk).exists())
        self.assertEqual(Category.objects.count(), 3)

    def test_category_deletion_also_preserves_hidden_products(self):
        Product.objects.filter(pk=self.product.pk).update(visible=False)
        self.assertEqual(
            self.client.delete(
                f"/api/products/categories/{self.root.pk}/delete/"
            ).status_code,
            400,
        )

    def test_empty_category_tree_can_be_deleted(self):
        empty = Category.objects.create(name="Empty")
        child = Category.objects.create(name="Empty child", category=empty)
        self.assertEqual(
            self.client.delete(
                f"/api/products/categories/{empty.pk}/delete/"
            ).status_code,
            204,
        )
        self.assertFalse(Category.objects.filter(pk=child.pk).exists())

    def test_legacy_cycle_cannot_be_used_as_new_parent(self):
        Category.objects.filter(pk=self.root.pk).update(category=self.leaf)
        response = self.client.post(
            "/api/products/categories/register/",
            {"name": "New", "category": self.child.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Category.objects.count(), 3)

    def test_invalid_numeric_fields_do_not_change_product(self):
        for field, value in (
            ("currentStockQuantity", -1),
            ("packaging", 0),
            ("salePrice", -1),
            ("costPrice", -1),
            ("salePrice", "NaN"),
            ("costPrice", "Infinity"),
        ):
            response = self.client.patch(
                f"/api/products/{self.product.pk}/update/",
                {field: value},
                format="json",
            )
            self.assertEqual(response.status_code, 400, (field, value))
        self.product.refresh_from_db()
        self.assertEqual(self.product.salePrice, 50)
        self.assertEqual(self.product.currentStockQuantity, 10)

    def test_search_is_literal_and_invalid_category_is_empty(self):
        for path in (
            "/api/products/filterName/?fetchProduct=[",
            "/api/products/categories/filter/?fetchCategories=[",
            "/api/products/filterCategory/?categoryId=invalid",
        ):
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data, [])

    def test_product_removal_hides_without_deleting(self):
        self.assertEqual(
            self.client.delete(f"/api/products/{self.product.pk}/delete/").status_code,
            204,
        )
        self.product.refresh_from_db()
        self.assertFalse(self.product.visible)
        self.assertEqual(self.product.image.name, "paper.jpg")
        self.assertEqual(
            self.client.get(f"/api/products/{self.product.pk}/detail/").status_code, 200
        )
        self.client.force_authenticate(self.buyer)
        self.assertEqual(
            self.client.get(f"/api/products/{self.product.pk}/detail/").status_code, 404
        )

    def test_catalog_write_requires_administrator(self):
        self.client.force_authenticate(self.buyer)
        for path in ("/api/products/register/", "/api/products/categories/register/"):
            self.assertEqual(self.client.post(path, {}, format="json").status_code, 403)
