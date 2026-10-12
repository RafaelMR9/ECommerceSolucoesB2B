"""Upload local product images only when explicitly requested, preserving originals."""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from api.media import CloudinaryMediaStorage, is_cloudinary_reference
from products.models import Product


class Command(BaseCommand):
    help = "Plan local image uploads; --apply uploads and records old/new references in an ignored manifest."

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true")

    def handle(self, *args, **options):
        root = Path(settings.MEDIA_ROOT).resolve()
        plan = []
        for product in Product.objects.order_by("pk"):
            name = product.image.name
            if (
                not name
                or is_cloudinary_reference(name)
                or name.startswith(("http://", "https://"))
            ):
                continue
            path = (root / name).resolve()
            if not path.is_relative_to(root) or not path.is_file():
                raise CommandError(
                    f"Product {product.pk}: missing or ambiguous local reference; nothing changed."
                )
            plan.append((product.pk, name, path))
        self.stdout.write(
            f"{len(plan)} local product images; originals will remain on disk."
        )
        if not options["apply"]:
            self.stdout.write(
                "Dry run. Use --apply only against the chosen migration database after backup."
            )
            return
        if not all(
            (
                settings.CLOUDINARY_CLOUD_NAME,
                os.getenv("CLOUDINARY_API_KEY"),
                os.getenv("CLOUDINARY_API_SECRET"),
            )
        ):
            raise CommandError("Private Cloudinary credentials required for --apply.")
        if not plan:
            return
        output = settings.BASE_DIR.parent / "backups"
        output.mkdir(exist_ok=True)
        manifest_path = output / (
            "image-mapping-"
            + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
            + ".json"
        )
        manifest = {"status": "uploading", "images": []}
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        storage = CloudinaryMediaStorage()
        for pk, old, path in plan:
            with path.open("rb") as stream:
                new = storage.save(path.name, File(stream))
            manifest["images"].append({"product_id": pk, "old": old, "new": new})
            manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        with transaction.atomic():
            for item in manifest["images"]:
                product = Product.objects.select_for_update().get(pk=item["product_id"])
                if product.image.name != item["old"]:
                    raise CommandError(
                        "Concurrent product change. Database not updated; uploaded assets recorded in manifest."
                    )
                product.image = item["new"]
                product.save(update_fields=["image"])
        manifest["status"] = "applied"
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        self.stdout.write(f"Applied. Rollback references: {manifest_path}")
