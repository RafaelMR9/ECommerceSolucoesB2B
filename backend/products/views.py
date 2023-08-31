from rest_framework import generics
from rest_framework.response import Response
from .models import Category, Product
from .validators import CustomValidators
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryFilterView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('categoryId', '')
        return Category.objects.all().filter(name__iregex=search_query)

class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryRetrieveView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryUpdateView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        newSubcategory = serializer.validated_data.get('category')
        newInstance = Category.objects.get(pk=instance.pk)
        newInstance.category = newSubcategory

        CustomValidators.validate_category_same_subcategory(instance, newSubcategory)
        CustomValidators.validate_category_circular_relationship(newInstance, newSubcategory)

        self.perform_update(serializer)
        return Response(serializer.data)

class CategoryDestroyView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all().filter(visible=True)
    
class ProductFilterNameView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('fetchProduct', '')
        return Product.objects.all().filter(visible=True, name__iregex=search_query)

class ProductFilterCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('categoryId', '')
        return Product.objects.all().filter(visible=True, category__id=search_query)

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductRetrieveView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDestroyView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer