from rest_framework import serializers

from core.validators import validate_cnpj

from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ("id", "name", "email", "cnpj")

    def validate_cnpj(self, value):
        validate_cnpj(value)
        return value
