from rest_framework import generics
from rest_framework.response import Response
from .models import SalesOrder, ItemSalesOrder, SupplierOrder, ItemSupplierOrder, SalesInvoice, ItemSalesInvoice, SupplierInvoice, ItemSupplierInvoice 
from .serializers import SalesOrderSerializer, ItemSalesOrderSerializer, SupplierOrderSerializer, ItemSupplierOrderSerializer, SalesInvoiceSerializer, ItemSalesInvoiceSerializer, SupplierInvoiceSerializer, ItemSupplierInvoiceSerializer
from .validators import CustomValidators

# Create your views here.
class SalesOrderCreateView(generics.CreateAPIView):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def perform_create(self, serializer):
        deliveryDate = serializer.validated_data.get('deliveryDate')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)

        serializer.save()

class SalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer

    def get_queryset(self):
        queryset = SalesOrder.objects.filter(finished=True).order_by('-orderDate')

        return queryset

class SalesOrderUpdateView(generics.UpdateAPIView):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        deliveryDate = serializer.validated_data.get('deliveryDate')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)

        self.perform_update(serializer)

        return Response(serializer.data)

class UserSalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = SalesOrder.objects.filter(user=user, finished=True).order_by('-orderDate')

        return queryset

class CheckOpenSalesOrderView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = SalesOrder.objects.filter(user=user, finished=False)
        
        return queryset

class ProductsInSalesOrderListView(generics.ListAPIView):
    serializer_class = ItemSalesOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = ItemSalesOrder.objects.filter(
            salesOrder__user=user,
            salesOrder__id=self.kwargs['pk'],
        )

        return queryset

class ItemSalesOrderCreateView(generics.CreateAPIView):
    queryset = ItemSalesOrder.objects.all()
    serializer_class = ItemSalesOrderSerializer

class ItemSalesOrderDestroyView(generics.DestroyAPIView):
    queryset = ItemSalesOrder.objects.all()
    serializer_class = ItemSalesOrderSerializer



class SupplierOrderCreateView(generics.CreateAPIView):
    queryset = SupplierOrder.objects.all()
    serializer_class = SupplierOrderSerializer

    def perform_create(self, serializer):
        deliveryDate = serializer.validated_data.get('deliveryDate')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)

        serializer.save()

class SupplierOrderListView(generics.ListAPIView):
    serializer_class = SupplierOrderSerializer

    def get_queryset(self):
        queryset = SupplierOrder.objects.filter(finished=True).order_by('-orderDate')

        return queryset

class SupplierOrderUpdateView(generics.UpdateAPIView):
    queryset = SupplierOrder.objects.all()
    serializer_class = SupplierOrderSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        deliveryDate = serializer.validated_data.get('deliveryDate')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)

        self.perform_update(serializer)

        return Response(serializer.data)

class UserSupplierOrderListView(generics.ListAPIView):
    serializer_class = SupplierOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = SupplierOrder.objects.filter(user=user, finished=True).order_by('-orderDate')

        return queryset

class CheckOpenSupplierOrderView(generics.ListAPIView):
    serializer_class = SupplierOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = SupplierOrder.objects.filter(user=user, finished=False)
        
        return queryset

class ProductsInSupplierOrderListView(generics.ListAPIView):
    serializer_class = ItemSupplierOrderSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = ItemSupplierOrder.objects.filter(
            supplierOrder__user=user,
            supplierOrder__id=self.kwargs['pk'],
        )

        return queryset

class SupplierOrderDestroyView(generics.DestroyAPIView):
    queryset = SupplierOrder.objects.all()
    serializer_class = SupplierOrderSerializer

class ItemSupplierOrderCreateView(generics.CreateAPIView):
    queryset = ItemSupplierOrder.objects.all()
    serializer_class = ItemSupplierOrderSerializer

class ItemSupplierOrderDestroyView(generics.DestroyAPIView):
    queryset = ItemSupplierOrder.objects.all()
    serializer_class = ItemSupplierOrderSerializer



class SalesInvoiceCreateView(generics.CreateAPIView):
    queryset = SalesInvoice.objects.all()
    serializer_class = SalesInvoiceSerializer

class SalesInvoiceListView(generics.ListAPIView):
    queryset = SalesInvoice.objects.all()
    serializer_class = SalesInvoiceSerializer

class SalesInvoiceUpdateView(generics.UpdateAPIView):
    queryset = SalesInvoice.objects.all()
    serializer_class = SalesInvoiceSerializer

class ItemSalesInvoiceCreateView(generics.CreateAPIView):
    queryset = ItemSalesInvoice.objects.all()
    serializer_class = ItemSalesInvoiceSerializer

class ItemSalesInvoiceListView(generics.ListAPIView):
    queryset = ItemSalesInvoice.objects.all()
    serializer_class = ItemSalesInvoiceSerializer

class ItemSalesInvoiceUpdateView(generics.UpdateAPIView):
    queryset = ItemSalesInvoice.objects.all()
    serializer_class = ItemSalesInvoiceSerializer



class SupplierInvoiceCreateView(generics.CreateAPIView):
    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer

class SupplierInvoiceListView(generics.ListAPIView):
    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer

class SupplierInvoiceUpdateView(generics.UpdateAPIView):
    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer

class ItemSupplierInvoiceCreateView(generics.CreateAPIView):
    queryset = ItemSupplierInvoice.objects.all()
    serializer_class = ItemSupplierInvoiceSerializer

class ItemSupplierInvoiceListView(generics.ListAPIView):
    queryset = ItemSupplierInvoice.objects.all()
    serializer_class = ItemSupplierInvoiceSerializer

class ItemSupplierInvoiceUpdateView(generics.UpdateAPIView):
    queryset = ItemSupplierInvoice.objects.all()
    serializer_class = ItemSupplierInvoiceSerializer