from django.urls import path

from .actions import OrderActionView
from .checkout import AddCartItemView, CheckoutView, RemoveCartItemView
from .views import (
    CheckOpenSalesOrderView,
    CheckOpenSupplierOrderView,
    LegacyOrderWriteView,
    ProductsInSalesOrderListView,
    ProductsInSupplierOrderListView,
    SalesOrderListView,
    SupplierOrderListView,
    UserSalesOrderListView,
    UserSupplierOrderListView,
)

app_name = "orders"

urlpatterns = [
    path("salesOrder/<int:pk>/action/", OrderActionView.as_view(), {"kind": "sales"}),
    path(
        "supplierOrder/<int:pk>/action/",
        OrderActionView.as_view(),
        {"kind": "supplier"},
    ),
    path("cart/add/", AddCartItemView.as_view()),
    path("cart/items/<int:pk>/delete/", RemoveCartItemView.as_view()),
    path("checkout/", CheckoutView.as_view()),
    path("salesOrder/", SalesOrderListView.as_view()),
    path("salesOrder/user/", UserSalesOrderListView.as_view()),
    path("salesOrder/getUnfinished/", CheckOpenSalesOrderView.as_view()),
    path("itemSalesOrder/<int:pk>/", ProductsInSalesOrderListView.as_view()),
    path("supplierOrder/", SupplierOrderListView.as_view()),
    path("supplierOrder/user/", UserSupplierOrderListView.as_view()),
    path("supplierOrder/getUnfinished/", CheckOpenSupplierOrderView.as_view()),
    path("itemSupplierOrder/<int:pk>/", ProductsInSupplierOrderListView.as_view()),
    path("salesOrder/register/", LegacyOrderWriteView.as_view()),
    path("salesOrder/<int:pk>/update/", LegacyOrderWriteView.as_view()),
    path("itemSalesOrder/register/", LegacyOrderWriteView.as_view()),
    path("itemSalesOrder/<int:pk>/delete/", LegacyOrderWriteView.as_view()),
    path("salesInvoice/register/", LegacyOrderWriteView.as_view()),
    path("salesInvoice/<int:pk>/update/", LegacyOrderWriteView.as_view()),
    path("itemSalesInvoice/register/", LegacyOrderWriteView.as_view()),
    path("supplierOrder/register/", LegacyOrderWriteView.as_view()),
    path("supplierOrder/<int:pk>/update/", LegacyOrderWriteView.as_view()),
    path("supplierOrder/<int:pk>/delete/", LegacyOrderWriteView.as_view()),
    path("itemSupplierOrder/register/", LegacyOrderWriteView.as_view()),
    path("itemSupplierOrder/<int:pk>/delete/", LegacyOrderWriteView.as_view()),
    path("supplierInvoice/register/", LegacyOrderWriteView.as_view()),
    path("supplierInvoice/<int:pk>/update/", LegacyOrderWriteView.as_view()),
    path("itemSupplierInvoice/register/", LegacyOrderWriteView.as_view()),
]
