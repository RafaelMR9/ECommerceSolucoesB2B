from rest_framework import generics
from rest_framework.views import APIView

from core.permissions import IsAdministrator

from .models import Carrier, SalesShipment
from .serializers import CarrierSerializer, SalesShipmentSerializer
from .validators import validate_carrier_deletion


class CarrierCreateView(generics.CreateAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = CarrierSerializer


class CarrierListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = Carrier.objects.order_by("pk")
    serializer_class = CarrierSerializer


class CarrierRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAdministrator]
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer


class CarrierUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdministrator]
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer


class CarrierFilterView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = CarrierSerializer

    def get_queryset(self):
        search = self.request.query_params.get("fetchCarriers", "").strip()
        return Carrier.objects.filter(name__icontains=search).order_by("pk")


class CarrierDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAdministrator]
    queryset = Carrier.objects.all()
    serializer_class = CarrierSerializer

    def perform_destroy(self, instance):
        validate_carrier_deletion(instance)
        instance.delete()


class LegacyShipmentWriteView(APIView):
    permission_classes = [IsAdministrator]
    http_method_names = ["options"]


class SalesShipmentFilterView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = SalesShipmentSerializer

    def get_queryset(self):
        carrier = self.request.query_params.get("fetchCarrier", "")
        if not carrier.isdecimal():
            return SalesShipment.objects.none()
        return SalesShipment.objects.filter(carrier_id=carrier).order_by("pk")
