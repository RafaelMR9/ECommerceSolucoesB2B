from rest_framework import serializers
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
                elif key == 'address':
                    CustomValidators.validate_unique_address(value)
        instance.save()
        return instance