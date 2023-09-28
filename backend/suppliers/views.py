from rest_framework import generics
from .models import Supplier
from .validators import CustomValidators
from .serializers import SupplierSerializer

class SupplierCreateView(generics.CreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    def perform_create(self, serializer):
        email = serializer.validated_data.get('email')
        name = serializer.validated_data.get('name')
        cnpj = serializer.validated_data.get('cnpj')

        CustomValidators.validate_unique_email(email)
        CustomValidators.validate_unique_name(name)
        CustomValidators.validate_unique_cnpj(cnpj)

        serializer.save()

class SupplierListView(generics.ListAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierRetrieveView(generics.RetrieveAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierUpdateView(generics.UpdateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierFilterView(generics.ListAPIView):
    serializer_class = SupplierSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('fetchSuppliers', '')
        return Supplier.objects.all().filter(name__iregex=search_query)

class SupplierDestroyView(generics.DestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer