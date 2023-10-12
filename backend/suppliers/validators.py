from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import serializers
from .models import Supplier
import re

class CustomValidators:
        
    @staticmethod    
    def validate_email(value):
        try:
            validate_email(value)
        except ValidationError as e:
            raise serializers.ValidationError({'email': list(e)})
    
    @staticmethod
    def validate_cnpj(value):
      pattern = re.compile(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$')
      if value and not pattern.match(value):
        raise serializers.ValidationError({'cnpj': ['CNPJ inválido.']})
        
    @staticmethod
    def validate_unique_email(value):
        if Supplier.objects.filter(email=value).exists():
            raise serializers.ValidationError({'email': ['Já existe um Fornecedor com este E-Mail.']})
    
    @staticmethod
    def validate_unique_name(value):
        if Supplier.objects.filter(name=value).exists():
            raise serializers.ValidationError({'name': ['Já existe um Fornecedor com este Nome.']})

    @staticmethod
    def validate_unique_cnpj(value):
        if Supplier.objects.filter(cnpj=value).exists():
            raise serializers.ValidationError({'cnpj': ['Já existe um Fornecedor com este CNPJ.']})