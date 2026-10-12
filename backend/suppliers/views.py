from rest_framework import generics

from core.permissions import IsAdministrator

from .models import Supplier
from .serializers import SupplierSerializer
from .validators import validate_supplier_deletion


class SupplierCreateView(generics.CreateAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = SupplierSerializer


class SupplierListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = Supplier.objects.order_by("pk")
    serializer_class = SupplierSerializer


class SupplierRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAdministrator]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdministrator]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierFilterView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = SupplierSerializer

    def get_queryset(self):
        search = self.request.query_params.get("fetchSuppliers", "").strip()
        return Supplier.objects.filter(name__icontains=search).order_by("pk")


class SupplierDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAdministrator]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    def perform_destroy(self, instance):
        validate_supplier_deletion(instance)
        instance.delete()
