from rest_framework import generics
from .models import Carrier, SalesShipment
from .validators import CustomValidators
from .serializers import CarrierSerializer, SalesShipmentSerializer

class CarrierCreateView(generics.CreateAPIView):
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

    def perform_create(self, serializer):
        email = serializer.validated_data.get('email')
        name = serializer.validated_data.get('name')
        cnpj = serializer.validated_data.get('cnpj')

        CustomValidators.validate_unique_email(email)
        CustomValidators.validate_unique_name(name)
        CustomValidators.validate_unique_cnpj(cnpj)

        serializer.save()

class CarrierListView(generics.ListAPIView):
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

class CarrierRetrieveView(generics.RetrieveAPIView):
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

class CarrierUpdateView(generics.UpdateAPIView):
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

class CarrierFilterView(generics.ListAPIView):
    serializer_class = CarrierSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('fetchCarriers', '')
        return Carrier.objects.all().filter(name__iregex=search_query)

class CarrierDestroyView(generics.DestroyAPIView):
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

    def destroy(self, request, *args, **kwargs):
        carrier = self.get_object()

        CustomValidators.validate_carrier_deletion(carrier)

        return super().destroy(request, *args, **kwargs)
    

class SalesShipmentCreateView(generics.CreateAPIView):
    queryset = SalesShipment.objects.all()
    serializer_class = SalesShipmentSerializer

class SalesShipmentFilterView(generics.ListAPIView):
    serializer_class = SalesShipmentSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('fetchCarrier', '')
        return SalesShipment.objects.all().filter(carrier_id=search_query)