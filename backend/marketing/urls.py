from django.urls import path

from .views import PromotionCreateView, PromotionListView, PromotionRetrieveProductView

app_name = "marketing"

urlpatterns = [
    path("", PromotionListView.as_view()),
    path("register/", PromotionCreateView.as_view()),
    path("promotion/<int:pk>/", PromotionRetrieveProductView.as_view()),
]
