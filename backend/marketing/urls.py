from django.urls import path
from .views import PromotionCreateView, PromotionRetrieveProductView

app_name = 'marketing'

urlpatterns = [
  path('register/', PromotionCreateView.as_view()),
  path('promotion/<int:pk>/', PromotionRetrieveProductView.as_view()),
]