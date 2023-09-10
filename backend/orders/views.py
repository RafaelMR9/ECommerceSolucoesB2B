from rest_framework import generics
from rest_framework.response import Response
from .models import SalesOrder, ItemSalesOrder
from .serializers import SalesOrderSerializer, ItemSalesOrderSerializer
from .validators import CustomValidators

# Create your views here.
class SalesOrderCreateView(generics.CreateAPIView):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def perform_create(self, serializer):
        deliveryDate = serializer.validated_data.get('deliveryDate')
        deliveryFrequency = serializer.validated_data.get('deliveryFrequency')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)
        CustomValidators.validate_delivery_frequency(deliveryFrequency)

        serializer.save()

class SalesOrderUpdateView(generics.UpdateAPIView):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        deliveryDate = serializer.validated_data.get('deliveryDate')
        deliveryFrequency = serializer.validated_data.get('deliveryFrequency')

        if deliveryDate is not None:
            CustomValidators.validate_delivery_date_before_today(deliveryDate)
        CustomValidators.validate_delivery_frequency(deliveryFrequency)

        self.perform_update(serializer)

        return Response(serializer.data)

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
            salesOrder__finished=False)

        return queryset

class ItemSalesOrderCreateView(generics.CreateAPIView):
    queryset = ItemSalesOrder.objects.all()
    serializer_class = ItemSalesOrderSerializer

class ItemSalesOrderCreateView(generics.CreateAPIView):
    serializer_class = ItemSalesOrderSerializer

class ItemSalesOrderDestroyView(generics.DestroyAPIView):
    queryset = ItemSalesOrder.objects.all()
    serializer_class = ItemSalesOrderSerializer