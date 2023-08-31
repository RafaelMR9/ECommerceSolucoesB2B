from django.urls import path
from .views import PromotionCreateView

app_name = 'marketing'

urlpatterns = [
  path('register/', PromotionCreateView.as_view()),
]