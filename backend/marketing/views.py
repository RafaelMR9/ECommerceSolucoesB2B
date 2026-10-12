from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics
from rest_framework.views import APIView

from core.permissions import IsAdministrator

from .models import Promotion
from .serializers import PromotionSerializer


class PromotionListView(generics.ListAPIView):
    queryset = Promotion.objects.order_by("pk")
    serializer_class = PromotionSerializer


class PromotionCreateView(generics.CreateAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = PromotionSerializer


class PromotionRetrieveProductView(APIView):
    def get(self, request, pk):
        now = timezone.now()
        promotion = (
            Promotion.objects.filter(
                product_id=pk, startDate__lte=now, endDate__gte=now
            )
            .order_by("pk")
            .first()
        )
        data = PromotionSerializer(promotion).data if promotion else None
        return JsonResponse(data, safe=False)
