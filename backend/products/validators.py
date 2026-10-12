import math
from collections import defaultdict

from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import Category, Product


def validate_price(value):
    if not math.isfinite(value) or value < 0:
        raise ValidationError("Informe um valor finito maior ou igual a zero.")


def validate_category_deletion(category):
    children = defaultdict(list)
    for category_id, parent_id in Category.objects.values_list("pk", "category_id"):
        children[parent_id].append(category_id)
    category_ids = set()
    pending = [category.pk]
    while pending:
        category_id = pending.pop()
        if category_id not in category_ids:
            category_ids.add(category_id)
            pending.extend(children[category_id])
    if Product.objects.filter(category_id__in=category_ids).exists():
        raise serializers.ValidationError(
            {
                "title": "Não é possível excluir esta categoria, pois ela ou suas subcategorias têm produtos associados.",
                "leading": "Associe os produtos a outras categorias antes de prosseguir com a remoção.",
            }
        )
