from rest_framework import serializers
from django.utils import timezone

class CustomValidators:
    
    @staticmethod
    def validate_delivery_date_before_today(date):
      if date < timezone.now().date():
        raise serializers.ValidationError({"deliveryDate":["A data de entrega não pode ser anterior ao dia atual."]})
    
    @staticmethod
    def validate_delivery_frequency(value):
      if value > 0 and value < 10:
        raise serializers.ValidationError({"deliveryFrequency":["Este campo só aceita valor 0 ou valores maiores que 9."]})