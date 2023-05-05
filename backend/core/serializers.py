from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .validators import CustomValidators
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('is_staff', 'is_superuser')
    
    password = serializers.CharField(required=False)

    def create(self, validated_data):
        CustomValidators.validate_cpf(validated_data['cpf'])
        CustomValidators.validate_cnpj(validated_data['cnpj'])
        CustomValidators.validate_email(validated_data['email'])
        CustomValidators.validate_password(validated_data['password'])
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if value is not None:
                setattr(instance, key, value)
                if key == 'cpf':
                    CustomValidators.validate_cpf(value)
                    CustomValidators.validate_unique_cpf(value)
                elif key == 'cnpj':
                    CustomValidators.validate_cnpj(value)
                    CustomValidators.validate_unique_cnpj(value)
                elif key == 'email':
                    CustomValidators.validate_email(value)
                    CustomValidators.validate_unique_email(value)
                elif key == 'password':
                    CustomValidators.validate_password(value)
                elif key == 'endereco':
                    CustomValidators.validate_unique_endereco(value)
        instance.save()
        return instance
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['username'] = user.username
        token['eAdministrador'] = user.is_superuser
        token['cpf'] = user.cpf
        token['cnpj'] = user.cnpj
        token['endereco'] = user.endereco
        token['podeComprar'] = user.podeComprar
        token['podeFaturada'] = user.podeFaturada
        return token