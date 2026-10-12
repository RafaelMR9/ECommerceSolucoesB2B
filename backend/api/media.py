"""One ImageField contract for local uploads and existing Cloudinary references."""

import cloudinary.uploader
from cloudinary.models import CloudinaryField
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import FileSystemStorage, Storage


def is_cloudinary_reference(name):
    return str(name).startswith(
        ("image/upload/", "image/private/", "image/authenticated/")
    )


def cloudinary_url(name):
    if not settings.CLOUDINARY_CLOUD_NAME:
        raise ImproperlyConfigured(
            "CLOUDINARY_CLOUD_NAME is needed to display legacy cloud images."
        )
    resource = CloudinaryField("image").to_python(str(name))
    return resource.build_url(secure=True, cloud_name=settings.CLOUDINARY_CLOUD_NAME)


class LocalMediaStorage(FileSystemStorage):
    def url(self, name):
        if str(name).startswith(("https://", "http://")):
            return str(name)
        if is_cloudinary_reference(name):
            return cloudinary_url(name)
        return super().url(name)


class CloudinaryMediaStorage(Storage):
    def _save(self, name, content):
        # Store the same reference format as the deployed CloudinaryField.
        result = cloudinary.uploader.upload(
            content, resource_type="image", unique_filename=True
        )
        return f"image/upload/v{result['version']}/{result['public_id']}.{result['format']}"

    def exists(self, name):
        # Cloudinary allocates a unique public_id; avoid a remote check per upload.
        return False

    def url(self, name):
        if str(name).startswith(("https://", "http://")):
            return str(name)
        return cloudinary_url(name)

    def delete(self, name):
        if not is_cloudinary_reference(name):
            raise ValueError("Refusing to delete an ambiguous legacy image reference.")
        resource = CloudinaryField("image").to_python(str(name))
        cloudinary.uploader.destroy(
            resource.public_id, resource_type=resource.resource_type, type=resource.type
        )
