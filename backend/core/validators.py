from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from .models import User
import re

class CustomSerializersValidation:
    
    @staticmethod
    def validate_password(value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e)})
        
    @staticmethod    
    def validate_email(value):
        try:
            validate_email(value)
        except ValidationError as e:
            raise serializers.ValidationError({'email': e})
    
    @staticmethod
    def validate_cnpj(value):
      pattern = re.compile(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$')
      if value and not pattern.match(value):
        raise serializers.ValidationError({'cnpj': ['Certifique-se de que este campo esteja no formato certo.']})
      
    @staticmethod
    def validate_cpf(value):
      pattern = re.compile(r'^\d{3}\.\d{3}\.\d{3}\-\d{2}$')
      if value and not pattern.match(value):
        raise serializers.ValidationError('CPF inválido.')
    

class CustomViewsValidation:
    
    @staticmethod
    def validate_password(value1, value2):
        if value1 != value2:
            raise ValidationError('As senhas não coincidem.')