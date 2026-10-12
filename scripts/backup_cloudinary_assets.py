import argparse
import hashlib
import json
import urllib.request
from pathlib import Path

import cloudinary
import cloudinary.api
from cloudinary.models import CloudinaryField
from dotenv import dotenv_values
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--credentials", type=Path, default=ROOT.parent / "ECommerceServer/.env"
    )
    args = parser.parse_args()
    private_root = ROOT / "backups/heroku-current"
    report = json.loads(
        (private_root / "restore-validation.json").read_text(encoding="utf-8")
    )
    credentials = dotenv_values(args.credentials, encoding="utf-8")
    cloud_name = credentials.get("CLOUDINARY_CLOUD_NAME")
    if not cloud_name:
        raise SystemExit("Missing private Cloudinary configuration; values suppressed.")
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=credentials.get("CLOUDINARY_API_KEY"),
        api_secret=credentials.get("CLOUDINARY_API_SECRET"),
        secure=True,
    )
    destination = private_root / "cloudinary-assets"
    destination.mkdir(exist_ok=True)
    manifest_path = private_root / "cloudinary-assets-manifest.json"
    if manifest_path.exists():
        raise SystemExit("Image backup manifest exists; refusing to overwrite it.")
    manifest = {"read_only": True, "images": [], "failures": []}
    for item in report["images"]:
        record = dict(item)
        reference = item["reference"]
        try:
            if not reference.startswith("image/"):
                raise ValueError("Non-Cloudinary reference requires manual review.")
            resource = CloudinaryField("image").to_python(reference)
            url = resource.build_url(secure=True, cloud_name=cloud_name)
            record["url"] = url
            try:
                record["metadata"] = cloudinary.api.resource(
                    resource.public_id,
                    resource_type=resource.resource_type,
                    type=resource.type,
                )
                record["metadata_status"] = "preserved"
            except Exception as error:
                record["metadata_status"] = type(error).__name__
            extension = resource.format or "bin"
            if not extension.isalnum():
                raise ValueError("Unexpected extension.")
            path = destination / f"product-{item['product_id']}.{extension}"
            if path.exists():
                raise ValueError("Asset backup already exists; refusing overwrite.")
            with (
                urllib.request.urlopen(url, timeout=30) as response,
                path.open("wb") as stream,
            ):
                while True:
                    chunk = response.read(1024 * 1024)
                    if not chunk:
                        break
                    stream.write(chunk)
            with Image.open(path) as image:
                image.verify()
            record["file"] = path.relative_to(private_root).as_posix()
            record["bytes"] = path.stat().st_size
            record["sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
            manifest["images"].append(record)
        except Exception as error:
            manifest["failures"].append(
                {"product_id": item["product_id"], "error_type": type(error).__name__}
            )
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(
        "Referenced images preserved:",
        len(manifest["images"]),
        "of",
        len(report["images"]),
    )
    print(
        "Metadata preserved:",
        sum(item["metadata_status"] == "preserved" for item in manifest["images"]),
    )
    if manifest["failures"]:
        raise SystemExit(
            "Some assets unavailable; failure IDs recorded privately. No Cloudinary assets changed."
        )


if __name__ == "__main__":
    main()
