from django.urls import path
from .views import (
  CarrierCreateView, CarrierListView, CarrierRetrieveView, CarrierUpdateView, CarrierDestroyView, CarrierFilterView,
  SalesShipmentCreateView, SalesShipmentFilterView
)

app_name = 'carriers'

urlpatterns = [
    path('', CarrierListView.as_view()),
    path('register/', CarrierCreateView.as_view()),
    path('filter/', CarrierFilterView.as_view()),
    path('<int:pk>/update/', CarrierUpdateView.as_view()),
    path('<int:pk>/detail/', CarrierRetrieveView.as_view()),
    path('<int:pk>/delete/', CarrierDestroyView.as_view()),

    path('salesShipment/filter/', SalesShipmentFilterView.as_view()),
    path('salesShipment/register/', SalesShipmentCreateView.as_view()),
]