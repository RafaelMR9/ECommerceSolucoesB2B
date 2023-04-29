from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .validators import CustomSerializersValidation
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('is_staff', 'is_superuser')

    def create(self, validated_data):
        CustomSerializersValidation.validate_cpf(validated_data['cpf'])
        CustomSerializersValidation.validate_cnpj(validated_data['cnpj'])
        CustomSerializersValidation.validate_email(validated_data['email'])
        CustomSerializersValidation.validate_password(validated_data['password'])
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.cnpj = validated_data.get('cnpj', instance.cnpj)
        instance.endereco = validated_data.get('endereco', instance.endereco)
        instance.credito = validated_data.get('credito', instance.credito)
        instance.prazoPagamento = validated_data.get('prazoPagamento', instance.prazoPagamento)
        instance.podeComprar = validated_data.get('podeComprar', instance.podeComprar)
        instance.save()
        return instance