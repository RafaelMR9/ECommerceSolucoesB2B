from rest_framework import serializers
from .validators import CustomValidators
from .models import Carrier, SalesShipment

class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrier
        fields = '__all__'
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if value is not None:
                if key in ['email', 'cnpj', 'name'] and getattr(instance, key) == value:
                    continue
                setattr(instance, key, value)
                if key == 'cnpj':
                    CustomValidators.validate_cnpj(value)
                    CustomValidators.validate_unique_cnpj(value)
                elif key == 'email':
                    CustomValidators.validate_email(value)
                    CustomValidators.validate_unique_email(value)
                elif key == 'name':
                    CustomValidators.validate_unique_name(value)

        instance.save()
        return instance
    
class SalesShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesShipment
        fields = '__all__'