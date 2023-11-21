from django.urls import path
from .views import (
  SalesOrderCreateView, CheckOpenSalesOrderView, ItemSalesOrderCreateView, ProductsInSalesOrderListView, SalesOrderListView,
  UserSalesOrderListView, ItemSalesOrderDestroyView, SalesOrderUpdateView, 

  SupplierOrderCreateView, CheckOpenSupplierOrderView, ItemSupplierOrderCreateView, ProductsInSupplierOrderListView, 
  SupplierOrderListView, UserSupplierOrderListView, ItemSupplierOrderDestroyView, SupplierOrderUpdateView, 
  SupplierOrderDestroyView,

  SalesInvoiceCreateView, SalesInvoiceListView, SalesInvoiceUpdateView,
  ItemSalesInvoiceCreateView, ItemSalesInvoiceListView, ItemSalesInvoiceUpdateView,

  SupplierInvoiceCreateView, SupplierInvoiceListView, SupplierInvoiceUpdateView,
  ItemSupplierInvoiceCreateView, ItemSupplierInvoiceListView, ItemSupplierInvoiceUpdateView
)

app_name = 'orders'

urlpatterns = [
    path('salesOrder/', SalesOrderListView.as_view()),
    path('salesOrder/register/', SalesOrderCreateView.as_view()),
    path('salesOrder/<int:pk>/update/', SalesOrderUpdateView.as_view()),
    path('salesOrder/user/', UserSalesOrderListView.as_view()),
    path('salesOrder/getUnfinished/', CheckOpenSalesOrderView.as_view()),

    path('itemSalesOrder/<int:pk>/', ProductsInSalesOrderListView.as_view()),
    path('itemSalesOrder/register/', ItemSalesOrderCreateView.as_view()),
    path('itemSalesOrder/<int:pk>/delete/', ItemSalesOrderDestroyView.as_view()),

    path('salesInvoice/', SalesInvoiceListView.as_view()),
    path('salesInvoice/register/', SalesInvoiceCreateView.as_view()),
    path('salesInvoice/<int:pk>/update/', SalesInvoiceUpdateView.as_view()),

    path('itemSalesInvoice/', ItemSalesInvoiceListView.as_view()),
    path('itemSalesInvoice/register/', ItemSalesInvoiceCreateView.as_view()),
    path('itemSalesInvoice/<int:pk>/update/', ItemSalesInvoiceUpdateView.as_view()),


    path('supplierOrder/', SupplierOrderListView.as_view()),
    path('supplierOrder/register/', SupplierOrderCreateView.as_view()),
    path('supplierOrder/<int:pk>/update/', SupplierOrderUpdateView.as_view()),
    path('supplierOrder/user/', UserSupplierOrderListView.as_view()),
    path('supplierOrder/getUnfinished/', CheckOpenSupplierOrderView.as_view()),
    path('supplierOrder/<int:pk>/delete/', SupplierOrderDestroyView.as_view()),

    path('itemSupplierOrder/<int:pk>/', ProductsInSupplierOrderListView.as_view()),
    path('itemSupplierOrder/register/', ItemSupplierOrderCreateView.as_view()),
    path('itemSupplierOrder/<int:pk>/delete/', ItemSupplierOrderDestroyView.as_view()),

    path('supplierInvoice/', SupplierInvoiceListView.as_view()),
    path('supplierInvoice/register/', SupplierInvoiceCreateView.as_view()),
    path('supplierInvoice/<int:pk>/update/', SupplierInvoiceUpdateView.as_view()),
    
    path('itemSupplierInvoice/', ItemSupplierInvoiceListView.as_view()),
    path('itemSupplierInvoice/register/', ItemSupplierInvoiceCreateView.as_view()),
    path('itemSupplierInvoice/<int:pk>/update/', ItemSupplierInvoiceUpdateView.as_view()),
]