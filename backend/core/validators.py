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
            raise serializers.ValidationError(str(e))
        
    @staticmethod    
    def validate_email(value):
        try:
            validate_email(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
    
    @staticmethod
    def validate_cnpj(value):
      pattern = re.compile(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$')
      if not pattern.match(value):
        raise serializers.ValidationError('CNPJ inválido')
      
    @staticmethod
    def validate_cpf(value):
      pattern = re.compile(r'^\d{3}\.\d{3}\.\d{3}\-\d{2}$')
      if not pattern.match(value):
        raise serializers.ValidationError('CPF inválido')
    

class CustomViewsValidation:
    
    @staticmethod
    def validate_password(value1, value2):
        if value1 != value2:
            raise ValidationError('As senhas não coincidem')
        
    @staticmethod
    def validate_login(value):
        if User.objects.filter(login=value).exists():
            raise ValidationError('Já existe um usuário com este login')
    
    @staticmethod
    def validate_email(value):
        if User.objects.filter(email=value).exists():
            raise ValidationError('Já existe um usuário com este email')
    
    @staticmethod
    def validate_cnpj(value):
        if User.objects.filter(cnpj=value).exists():
            raise ValidationError('Já existe um usuário com este CNPJ')
    
    @staticmethod
    def validate_endereco(value):
        if User.objects.filter(endereco=value).exists():
            raise ValidationError('Já existe um usuário com este endereço')
    
    @staticmethod
    def validate_cpf(value):
        if User.objects.filter(cpf=value).exists():
            raise ValidationError('Já existe um usuário com este CPF')