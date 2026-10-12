from django.urls import path

from .views import (
    SupplierCreateView,
    SupplierDestroyView,
    SupplierFilterView,
    SupplierListView,
    SupplierRetrieveView,
    SupplierUpdateView,
)

app_name = "suppliers"

urlpatterns = [
    path("", SupplierListView.as_view()),
    path("register/", SupplierCreateView.as_view()),
    path("filter/", SupplierFilterView.as_view()),
    path("<int:pk>/update/", SupplierUpdateView.as_view()),
    path("<int:pk>/detail/", SupplierRetrieveView.as_view()),
    path("<int:pk>/delete/", SupplierDestroyView.as_view()),
]
