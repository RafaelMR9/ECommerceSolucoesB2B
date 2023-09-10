from django.urls import path
from .views import SalesOrderCreateView, CheckOpenSalesOrderView, ItemSalesOrderCreateView, ProductsInSalesOrderListView, ItemSalesOrderDestroyView

app_name = 'sales'

urlpatterns = [
    path('salesOrder/register/', SalesOrderCreateView.as_view()),
    path('salesOrder/getUnfinished/', CheckOpenSalesOrderView.as_view()),
    path('itemSalesOrder/<int:pk>/', ProductsInSalesOrderListView.as_view()),
    path('itemSalesOrder/register/', ItemSalesOrderCreateView.as_view()),
    path('itemSalesOrder/<int:pk>/delete/', ItemSalesOrderDestroyView.as_view()),
]