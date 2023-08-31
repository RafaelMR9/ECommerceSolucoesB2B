from rest_framework import serializers
from django.utils import timezone
from .models import Promotion

class CustomValidators:
    
    @staticmethod
    def validate_price(price):
      if price < 0:
        raise serializers.ValidationError({"salePrice":["Valor deve ser maior ou igual à 0."]})

    @staticmethod
    def validate_end_before_start(startDate, endDate):
      if endDate <= startDate:
        raise serializers.ValidationError({"endDate":["A data de término deve ser posterior à data de início."]})
      
    @staticmethod
    def validate_existing_promotions(product, startDate, endDate):
      existing_promotions = Promotion.objects.filter(product=product, startDate__lte=endDate, endDate__gte=startDate)
      if existing_promotions.exists():
        raise serializers.ValidationError({"endDate":["Já existe uma promoção para este produto neste período de tempo."]})
      
    @staticmethod
    def validate_start_before_today(startDate):
      if startDate < timezone.now():
        raise serializers.ValidationError({"startDate":["A data de início não pode ser anterior ao dia atual."]})
      
    @staticmethod
    def validate_end_before_today(endDate):
      if endDate < timezone.now():
        raise serializers.ValidationError({"endDate":["A data de fim não pode ser anterior ao dia atual."]})