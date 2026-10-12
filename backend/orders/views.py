from rest_framework import generics
from rest_framework.views import APIView

from core.permissions import IsAdministrator, requested_user_id

from .models import ItemSalesOrder, ItemSupplierOrder, SalesOrder, SupplierOrder
from .serializers import (
    ItemSalesOrderSerializer,
    ItemSupplierOrderSerializer,
    SalesOrderSerializer,
    SupplierOrderSerializer,
)


class LegacyOrderWriteView(APIView):
    permission_classes = [IsAdministrator]
    http_method_names = ["options"]


class SalesOrderListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = SalesOrder.objects.filter(finished=True).order_by("-orderDate", "-pk")
    serializer_class = SalesOrderSerializer


class UserSalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer

    def get_queryset(self):
        return SalesOrder.objects.filter(
            user_id=requested_user_id(self.request), finished=True
        ).order_by("-orderDate", "-pk")


class CheckOpenSalesOrderView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer

    def get_queryset(self):
        return SalesOrder.objects.filter(
            user_id=requested_user_id(self.request), finished=False
        ).order_by("pk")


class ProductsInSalesOrderListView(generics.ListAPIView):
    serializer_class = ItemSalesOrderSerializer

    def get_queryset(self):
        return ItemSalesOrder.objects.filter(
            salesOrder__user_id=requested_user_id(self.request),
            salesOrder_id=self.kwargs["pk"],
        ).order_by("pk")


class SupplierOrderListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = SupplierOrder.objects.filter(finished=True).order_by("-orderDate", "-pk")
    serializer_class = SupplierOrderSerializer


class UserSupplierOrderListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = SupplierOrderSerializer

    def get_queryset(self):
        return SupplierOrder.objects.filter(
            user_id=requested_user_id(self.request), finished=True
        ).order_by("-orderDate", "-pk")


class CheckOpenSupplierOrderView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = SupplierOrderSerializer

    def get_queryset(self):
        return SupplierOrder.objects.filter(
            user_id=requested_user_id(self.request), finished=False
        ).order_by("pk")


class ProductsInSupplierOrderListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = ItemSupplierOrderSerializer

    def get_queryset(self):
        return ItemSupplierOrder.objects.filter(
            supplierOrder__user_id=requested_user_id(self.request),
            supplierOrder_id=self.kwargs["pk"],
        ).order_by("pk")
