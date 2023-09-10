from django.urls import path
from .views import PromotionCreateView, PromotionRetrieveProductView, PromotionListView

app_name = 'marketing'

urlpatterns = [
  path('', PromotionListView.as_view()),
  path('register/', PromotionCreateView.as_view()),
  path('promotion/<int:pk>/', PromotionRetrieveProductView.as_view()),
]