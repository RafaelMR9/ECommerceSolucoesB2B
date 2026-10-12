from django.utils import timezone
from rest_framework import serializers

from products.validators import validate_price

from .models import Promotion


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ("id", "startDate", "endDate", "salePrice", "product")
        extra_kwargs = {"salePrice": {"validators": [validate_price]}}

    def validate(self, data):
        start = data["startDate"]
        end = data["endDate"]
        product = data["product"]
        if end <= start:
            raise serializers.ValidationError(
                {"endDate": "A data de término deve ser posterior à data de início."}
            )
        if start < timezone.now():
            raise serializers.ValidationError(
                {
                    "startDate": "A data de início não pode ser anterior ao momento atual."
                }
            )
        promotions = Promotion.objects.filter(
            product=product, startDate__lte=end, endDate__gte=start
        )
        if promotions.exists():
            raise serializers.ValidationError(
                {"endDate": "Já existe uma promoção para este produto neste período."}
            )
        return data
