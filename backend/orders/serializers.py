from rest_framework import serializers
from .models import SalesOrder, ItemSalesOrder, SupplierOrder, ItemSupplierOrder, SalesInvoice, ItemSalesInvoice, SupplierInvoice, ItemSupplierInvoice

class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = '__all__'

class ItemSalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSalesOrder
        fields = '__all__'

class SupplierOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierOrder
        fields = '__all__'

class ItemSupplierOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSupplierOrder
        fields = '__all__'


class SalesInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoice
        fields = '__all__'

class ItemSalesInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSalesInvoice
        fields = '__all__'

class SupplierInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierInvoice
        fields = '__all__'

class ItemSupplierInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSupplierInvoice
        fields = '__all__'