from django.urls import path
from .views import (
    CategoryListView, CategoryCreateView, CategoryRetrieveView, CategoryDestroyView, CategoryUpdateView, CategoryFilterView,
    ProductListView, ProductCreateView, ProductRetrieveView, ProductUpdateView, ProductDestroyView, ProductFilterNameView, ProductFilterCategoryView
)

app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view()),
    path('register/', ProductCreateView.as_view()),
    path('filterName/', ProductFilterNameView.as_view()),
    path('filterCategory/', ProductFilterCategoryView.as_view()),
    path('<int:pk>/update/', ProductUpdateView.as_view()),
    path('<int:pk>/detail/', ProductRetrieveView.as_view()),
    path('<int:pk>/delete/', ProductDestroyView.as_view()),
    path('categories/', CategoryListView.as_view()),
    path('categories/register/', CategoryCreateView.as_view()),
    path('categories/filter/', CategoryFilterView.as_view()),
    path('categories/<int:pk>/update/', CategoryUpdateView.as_view()),
    path('categories/<int:pk>/detail/', CategoryRetrieveView.as_view()),
    path('categories/<int:pk>/delete/', CategoryDestroyView.as_view()),
]