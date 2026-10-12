from rest_framework import serializers

from .models import Category, Product
from .validators import validate_price


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "category")

    def validate_category(self, parent):
        if parent is None:
            return None
        parents = dict(Category.objects.values_list("pk", "category_id"))
        visited = {self.instance.pk} if self.instance else set()
        parent_id = parent.pk
        while parent_id is not None:
            if parent_id in visited:
                raise serializers.ValidationError(
                    "Não é permitido criar uma dependência circular entre categorias."
                )
            visited.add(parent_id)
            parent_id = parents.get(parent_id)
        return parent


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "currentStockQuantity",
            "costPrice",
            "salePrice",
            "description",
            "image",
            "packaging",
            "visible",
            "category",
            "supplier",
        )
        extra_kwargs = {
            "currentStockQuantity": {"min_value": 0},
            "packaging": {"min_value": 1},
            "costPrice": {"validators": [validate_price]},
            "salePrice": {"validators": [validate_price]},
        }

    def validate_image(self, image):
        if image.size > 4 * 1024 * 1024:
            raise serializers.ValidationError("A imagem deve ter no máximo 4 MB.")
        return image
