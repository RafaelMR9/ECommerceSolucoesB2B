from rest_framework import generics
from django.utils import timezone
from .models import Promotion
from .serializers import PromotionSerializer
from .validators import CustomValidators

class PromotionListView(generics.ListAPIView):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

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

class PromotionRetrieveProductView(generics.RetrieveAPIView):
    serializer_class = PromotionSerializer

    def get_object(self):
        currentDate = timezone.now()
        try:
            return Promotion.objects.get(
                product_id=self.kwargs['pk'],
                startDate__lte=currentDate,
                endDate__gte=currentDate
            )
        except Promotion.DoesNotExist:
            return None