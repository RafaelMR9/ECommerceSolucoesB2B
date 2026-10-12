import io
import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import SimpleTestCase, TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient, APIRequestFactory

from api.media import CloudinaryMediaStorage, LocalMediaStorage
from core.models import User
from core.views import SendResetEmailView
from products.models import Category, Product
from products.serializers import ProductSerializer
from suppliers.models import Supplier


@override_settings(CLOUDINARY_CLOUD_NAME="test-cloud")
class ImageStorageTests(SimpleTestCase):
    def test_local_upload_and_url(self):
        with tempfile.TemporaryDirectory() as directory:
            storage = LocalMediaStorage(location=directory, base_url="/media/")
            name = storage.save(
                "example.jpg", SimpleUploadedFile("example.jpg", b"image")
            )
            self.assertTrue(storage.exists(name))
            self.assertEqual(storage.url(name), "/media/example.jpg")

    def test_cloudinary_legacy_reference_retains_version_folder_and_format(self):
        reference = "image/upload/v123/folder/example.jpg"
        expected = (
            "https://res.cloudinary.com/test-cloud/image/upload/v123/folder/example.jpg"
        )
        for storage in (LocalMediaStorage(), CloudinaryMediaStorage()):
            self.assertEqual(storage.url(reference), expected)

    def test_absolute_image_url_is_unchanged(self):
        url = "https://res.cloudinary.com/test-cloud/image/upload/v123/test.jpg"
        for storage in (LocalMediaStorage(), CloudinaryMediaStorage()):
            self.assertEqual(storage.url(url), url)

    @patch("api.media.cloudinary.uploader.upload")
    def test_cloud_upload_serializes_to_full_url_without_frontend_prefix(self, upload):
        upload.return_value = {
            "version": 123,
            "public_id": "folder/new",
            "format": "png",
        }
        storage = CloudinaryMediaStorage()
        name = storage.save("new.png", SimpleUploadedFile("new.png", b"image"))
        self.assertEqual(name, "image/upload/v123/folder/new.png")
        self.assertEqual(
            storage.url(name),
            "https://res.cloudinary.com/test-cloud/image/upload/v123/folder/new.png",
        )
        upload.assert_called_once()

    def test_serializer_accepts_images_and_rejects_non_images(self):
        field = ProductSerializer().fields["image"]
        buffer = io.BytesIO()
        Image.new("RGB", (1, 1)).save(buffer, format="PNG")
        field.run_validation(
            SimpleUploadedFile("good.png", buffer.getvalue(), content_type="image/png")
        )
        serializer = ProductSerializer(
            data={"image": SimpleUploadedFile("bad.png", b"not an image")}, partial=True
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("image", serializer.errors)


class PasswordResetEnvironmentTests(TestCase):
    @override_settings(FRONTEND_URL="https://portfolio.example")
    @patch("core.views.send_mail")
    def test_password_reset_uses_configured_frontend(self, send_mail):
        User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test",
            is_superuser=True,
        )
        user = User.objects.create_user(
            email="buyer@example.test", username="buyer", password="test"
        )
        request = APIRequestFactory().post("/api/users/reset/", {"email": user.email})
        response = SendResetEmailView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn(
            "https://portfolio.example/authentication/recover-password?",
            send_mail.call_args.args[1],
        )
        self.assertNotIn("localhost", send_mail.call_args.args[1])

    def test_login_and_refresh_preserve_jwt_contract(self):
        User.objects.create_user(
            email="login@example.test", username="login", password="test-password"
        )
        client = APIClient()
        response = client.post(
            "/api/users/token/", {"username": "login", "password": "test-password"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        refreshed = client.post(
            "/api/users/token/refresh/", {"refresh": response.data["refresh"]}
        )
        self.assertEqual(refreshed.status_code, 200)
        self.assertIn("access", refreshed.data)


class ProductUploadContractTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="uploads@example.test",
            username="uploads",
            password="test-password",
            is_superuser=True,
        )
        self.category = Category.objects.create(name="Test category")
        self.supplier = Supplier.objects.create(
            name="Test supplier", email="supplier@example.test", cnpj="test-cnpj"
        )

    def data(self):
        buffer = io.BytesIO()
        Image.new("RGB", (1, 1)).save(buffer, format="PNG")
        return {
            "name": "Test product",
            "currentStockQuantity": 1,
            "costPrice": 2,
            "salePrice": 3,
            "description": "Test",
            "packaging": 1,
            "category": self.category.pk,
            "supplier": self.supplier.pk,
            "image": SimpleUploadedFile(
                "test.png", buffer.getvalue(), content_type="image/png"
            ),
        }

    def test_local_product_create_update_and_soft_delete(self):
        with (
            tempfile.TemporaryDirectory() as directory,
            override_settings(MEDIA_ROOT=directory),
        ):
            client = APIClient()
            client.force_authenticate(self.admin)
            response = client.post(
                "/api/products/register/", self.data(), format="multipart"
            )
            self.assertEqual(response.status_code, 201, response.data)
            self.assertTrue(
                response.data["image"].startswith("http://testserver/media/")
            )
            product_id = response.data["id"]
            updated = client.patch(
                f"/api/products/{product_id}/update/", {"description": "Updated"}
            )
            self.assertEqual(updated.status_code, 200)
            self.assertEqual(updated.data["image"], response.data["image"])
            deleted = client.delete(f"/api/products/{product_id}/delete/")
            self.assertEqual(deleted.status_code, 204)
            self.assertFalse(Product.objects.get(pk=product_id).visible)

    def test_multipart_put_preserves_unsupplied_fields(self):
        with (
            tempfile.TemporaryDirectory() as directory,
            override_settings(MEDIA_ROOT=directory),
        ):
            client = APIClient()
            client.force_authenticate(self.admin)
            created = client.post(
                "/api/products/register/", self.data(), format="multipart"
            ).data
            response = client.put(
                f"/api/products/{created['id']}/update/",
                {"description": "Updated"},
                format="multipart",
            )
            self.assertEqual(response.status_code, 200)
            for field in [
                "visible",
                "currentStockQuantity",
                "packaging",
                "image",
                "salePrice",
                "costPrice",
            ]:
                self.assertEqual(response.data[field], created[field], field)
            self.assertEqual(response.data["description"], "Updated")

    def test_valid_image_over_four_megabytes_is_rejected_without_saving(self):
        with (
            tempfile.TemporaryDirectory() as directory,
            override_settings(MEDIA_ROOT=directory),
        ):
            data = self.data()
            contents = data["image"].read().ljust(4 * 1024 * 1024 + 1, b"\x00")
            data["image"] = SimpleUploadedFile(
                "large.png", contents, content_type="image/png"
            )
            client = APIClient()
            client.force_authenticate(self.admin)
            response = client.post("/api/products/register/", data, format="multipart")
            self.assertEqual(response.status_code, 400)
            self.assertIn("image", response.data)
            self.assertFalse(Product.objects.exists())
            self.assertEqual(list(Path(directory).iterdir()), [])

    @override_settings(
        CLOUDINARY_CLOUD_NAME="test-cloud",
        STORAGES={
            "default": {"BACKEND": "api.media.CloudinaryMediaStorage"},
            "staticfiles": {
                "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"
            },
        },
    )
    @patch("api.media.cloudinary.uploader.upload")
    def test_cloud_product_multipart_upload_and_partial_update(self, upload):
        upload.return_value = {
            "version": 123,
            "public_id": "folder/new",
            "format": "png",
        }
        client = APIClient()
        client.force_authenticate(self.admin)
        response = client.post(
            "/api/products/register/", self.data(), format="multipart"
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(
            response.data["image"],
            "https://res.cloudinary.com/test-cloud/image/upload/v123/folder/new.png",
        )
        product = Product.objects.get(pk=response.data["id"])
        self.assertEqual(product.image.name, "image/upload/v123/folder/new.png")
        updated = client.patch(
            f"/api/products/{product.pk}/update/", {"description": "Updated"}
        )
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data["image"], response.data["image"])
        upload.assert_called_once()

    @patch("api.media.cloudinary.uploader.upload")
    def test_image_promotion_dry_run_and_apply_preserve_original_and_mapping(
        self, upload
    ):
        upload.return_value = {
            "version": 123,
            "public_id": "folder/promoted",
            "format": "png",
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            media = root / "media"
            media.mkdir()
            original = media / "test.png"
            original.write_bytes(b"original-file")
            product = Product.objects.create(
                name="Existing",
                costPrice=1,
                salePrice=2,
                description="Existing",
                category=self.category,
                supplier=self.supplier,
                image="test.png",
            )
            with (
                override_settings(
                    MEDIA_ROOT=media,
                    BASE_DIR=root / "backend",
                    CLOUDINARY_CLOUD_NAME="test-cloud",
                ),
                patch.dict(
                    "os.environ",
                    CLOUDINARY_API_KEY="fake-key",
                    CLOUDINARY_API_SECRET="fake-secret",
                ),
            ):
                call_command("promote_local_images", stdout=io.StringIO())
                upload.assert_not_called()
                product.refresh_from_db()
                self.assertEqual(product.image.name, "test.png")
                call_command("promote_local_images", apply=True, stdout=io.StringIO())
                product.refresh_from_db()
                self.assertEqual(
                    product.image.name, "image/upload/v123/folder/promoted.png"
                )
                self.assertEqual(original.read_bytes(), b"original-file")
                manifest = json.loads(
                    next((root / "backups").glob("*.json")).read_text()
                )
                self.assertEqual(manifest["status"], "applied")
                self.assertEqual(manifest["images"][0]["old"], "test.png")
                self.assertEqual(manifest["images"][0]["product_id"], product.pk)
