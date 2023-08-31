from rest_framework import generics
from .models import Promotion
from .serializers import PromotionSerializer
from .validators import CustomValidators

class PromotionCreateView(generics.CreateAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

    def perform_create(self, serializer):
        startDate = serializer.validated_data.get('startDate')
        endDate = serializer.validated_data.get('endDate')
        salePrice = serializer.validated_data.get('salePrice')
        product = serializer.validated_data.get('product')

        CustomValidators.validate_price(salePrice)
        CustomValidators.validate_end_before_start(startDate, endDate)
        CustomValidators.validate_existing_promotions(product, startDate, endDate)
        CustomValidators.validate_start_before_today(startDate)
        CustomValidators.validate_end_before_today(endDate)

        serializer.save()