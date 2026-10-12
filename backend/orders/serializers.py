from django.utils import timezone
from rest_framework import serializers

from .models import ItemSalesOrder, ItemSupplierOrder, SalesOrder, SupplierOrder


class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = (
            "id",
            "orderDate",
            "deliveryDate",
            "cancelled",
            "sending",
            "recieved",
            "paid",
            "faturedPayment",
            "finished",
            "totalSaleValue",
            "deliveryFrequency",
            "user",
        )
        read_only_fields = fields


class ItemSalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSalesOrder
        fields = ("id", "salePrice", "quantity", "product", "salesOrder")
        read_only_fields = fields


class SupplierOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierOrder
        fields = (
            "id",
            "orderDate",
            "deliveryDate",
            "recieved",
            "faturedPayment",
            "finished",
            "totalCostValue",
            "deliveryFrequency",
            "supplier",
            "user",
        )
        read_only_fields = fields


class ItemSupplierOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSupplierOrder
        fields = ("id", "costPrice", "quantity", "product", "supplierOrder")
        read_only_fields = fields


class CartItemInput(serializers.Serializer):
    product = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)


class CheckoutInput(serializers.Serializer):
    deliveryDate = serializers.DateField(allow_null=True, default=None)
    deliveryFrequency = serializers.IntegerField(
        min_value=10, allow_null=True, default=None
    )
    faturedPayment = serializers.BooleanField(default=False)

    def validate(self, data):
        if data["deliveryDate"] and data["deliveryDate"] < timezone.localdate():
            raise serializers.ValidationError(
                {"deliveryDate": "Escolha uma data de hoje em diante."}
            )
        if data["deliveryFrequency"] and not data["deliveryDate"]:
            raise serializers.ValidationError(
                {"deliveryDate": "Informe a primeira entrega para o pedido recorrente."}
            )
        return data


class OrderActionInput(serializers.Serializer):
    action = serializers.ChoiceField(
        choices=["cancel", "prepare", "send", "receive", "unreceived", "paid", "unpaid"]
    )
    carrier = serializers.IntegerField(min_value=1, required=False)
