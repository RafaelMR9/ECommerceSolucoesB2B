from rest_framework import serializers

from orders.models import SupplierOrder
from products.models import Product


def validate_supplier_deletion(supplier):
    if SupplierOrder.objects.filter(supplier=supplier).exists():
        raise serializers.ValidationError(
            {
                "title": "Não é possível excluir este fornecedor, pois existem pedidos de ressuprimentos associados a ele.",
                "leading": "Mantenha o fornecedor para preservar o histórico dos pedidos.",
            }
        )
    if Product.objects.filter(supplier=supplier).exists():
        raise serializers.ValidationError(
            {
                "title": "Não é possível excluir este fornecedor, pois existem produtos associados a ele.",
                "leading": "Associe os produtos a outros fornecedores antes de prosseguir com a remoção.",
            }
        )
