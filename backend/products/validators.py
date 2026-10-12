import math

from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import Category, Product


def validate_price(value):
    if not math.isfinite(value) or value < 0:
        raise ValidationError("Informe um valor finito maior ou igual a zero.")


def validate_category_deletion(category):
    category_ids = {category.pk}
    pending = category_ids
    while pending:
        children = (
            set(
                Category.objects.filter(category_id__in=pending).values_list(
                    "pk", flat=True
                )
            )
            - category_ids
        )
        category_ids.update(children)
        pending = children
    if Product.objects.filter(category_id__in=category_ids).exists():
        raise serializers.ValidationError(
            {
                "title": "Não é possível excluir esta categoria, pois ela ou suas subcategorias têm produtos associados.",
                "leading": "Associe os produtos a outras categorias antes de prosseguir com a remoção.",
            }
        )
