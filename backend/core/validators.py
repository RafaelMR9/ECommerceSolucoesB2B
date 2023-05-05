from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from .models import User
import re

class CustomValidators:
    
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
            raise serializers.ValidationError({'email': list(e)})
    
    @staticmethod
    def validate_cnpj(value):
      pattern = re.compile(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$')
      if value and not pattern.match(value):
        raise serializers.ValidationError({'cnpj': ['Certifique-se de que este campo esteja no formato certo.']})
      
    @staticmethod
    def validate_cpf(value):
      pattern = re.compile(r'^\d{3}\.\d{3}\.\d{3}\-\d{2}$')
      if value and not pattern.match(value):
        raise serializers.ValidationError({'cpf': ['Certifique-se de que este campo esteja no formato certo.']})
    
    @staticmethod
    def validate_equal_password(value1, value2):
        if value1 != value2:
            raise serializers.ValidationError({'password': ['As senhas não coincidem.']})
        
    @staticmethod
    def validate_unique_email(value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({'email': ['Já existe um Usuário com este Email.']})

    @staticmethod
    def validate_unique_username(value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError({'username': ['Já existe um Usuário com este Nome.']})

    @staticmethod
    def validate_unique_cpf(value):
        if User.objects.filter(cpf=value).exists():
            raise serializers.ValidationError({'cpf': ['Já existe um Usuário com este CPF.']})

    @staticmethod
    def validate_unique_cnpj(value):
        if User.objects.filter(cnpj=value).exists():
            raise serializers.ValidationError({'cnpj': ['Já existe um Usuário com este CNPJ.']})

    @staticmethod
    def validate_unique_endereco(value):
        if User.objects.filter(endereco=value).exists():
            raise serializers.ValidationError({'endereco': ['Já existe um Usuário com este Endereço.']})