from rest_framework import serializers
from .models import SalesOrder, ItemSalesOrder

class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = '__all__'

class ItemSalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSalesOrder
        fields = '__all__'
