from rest_framework import serializers

from .models import SalesShipment


def validate_carrier_deletion(carrier):
    if SalesShipment.objects.filter(carrier=carrier).exists():
        raise serializers.ValidationError(
            {
                "title": "Não é possível excluir esta transportadora, pois existem entregas associadas a ela.",
                "leading": "Mantenha a transportadora para preservar o histórico das entregas.",
            }
        )
