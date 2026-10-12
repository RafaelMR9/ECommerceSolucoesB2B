from rest_framework import serializers

from core.validators import validate_cnpj

from .models import Carrier, SalesShipment


class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrier
        fields = ("id", "name", "email", "cnpj")

    def validate_cnpj(self, value):
        validate_cnpj(value)
        return value


class SalesShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesShipment
        fields = ("id", "dateHour", "salesOrder", "carrier")
