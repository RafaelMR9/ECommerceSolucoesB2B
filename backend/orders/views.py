from rest_framework import generics
from .models import SalesOrder, ItemSalesOrder
from .serializers import SalesOrderSerializer, ItemSalesOrderSerializer

# Create your views here.
class SalesOrderCreateView(generics.CreateAPIView):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

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