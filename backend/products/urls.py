from django.urls import path
from .views import (
    CategoriaListView, CategoriaCreateView, CategoriaRetrieveView, CategoriaDestroyView, CategoriaUpdateView, CategoriaFilterView,
    ProdutoListView, ProdutoCreateView, ProdutoRetrieveView, ProdutoUpdateView
)

app_name = 'products'

urlpatterns = [
    path('', ProdutoListView.as_view()),
    path('register/', ProdutoCreateView.as_view()),
    path('<int:pk>/update/', ProdutoUpdateView.as_view()),
    path('<int:pk>/detail/', ProdutoRetrieveView.as_view()),
    path('categories/', CategoriaListView.as_view()),
    path('categories/register/', CategoriaCreateView.as_view()),
    path('categories/filter/', CategoriaFilterView.as_view()),
    path('categories/<int:pk>/update/', CategoriaUpdateView.as_view()),
    path('categories/<int:pk>/detail/', CategoriaRetrieveView.as_view()),
    path('categories/<int:pk>/delete/', CategoriaDestroyView.as_view()),
]