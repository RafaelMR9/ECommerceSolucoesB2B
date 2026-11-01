from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdministrator
from marketing.models import Promotion
from marketing.serializers import PromotionSerializer

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .validators import validate_category_deletion


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.order_by("pk")
    serializer_class = CategorySerializer


class CategoryFilterView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        search = self.request.query_params.get("fetchCategories", "").strip()
        return Category.objects.filter(name__icontains=search).order_by("pk")


class CategoryCreateView(generics.CreateAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = CategorySerializer


class CategoryRetrieveView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdministrator]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class CategoryDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAdministrator]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_destroy(self, instance):
        validate_category_deletion(instance)
        instance.delete()


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(visible=True).order_by("pk")
    serializer_class = ProductSerializer


class CatalogView(APIView):
    def get(self, request):
        products = Product.objects.filter(visible=True).order_by("pk")
        categories = Category.objects.order_by("pk")
        promotions = Promotion.objects.order_by("pk")
        return Response(
            {
                "products": ProductSerializer(
                    products, many=True, context={"request": request}
                ).data,
                "categories": CategorySerializer(categories, many=True).data,
                "promotions": PromotionSerializer(promotions, many=True).data,
            },
            headers={"Cache-Control": "private, no-store"},
        )


class ProductFilterNameView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        search = self.request.query_params.get("fetchProduct", "").strip()
        return Product.objects.filter(visible=True, name__icontains=search).order_by(
            "pk"
        )


class ProductFilterCategoryView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category = self.request.query_params.get("categoryId", "")
        if not category.isdecimal():
            return Product.objects.none()
        return Product.objects.filter(visible=True, category_id=category).order_by("pk")


class ProductCreateView(generics.CreateAPIView):
    permission_classes = [IsAdministrator]
    serializer_class = ProductSerializer


class ProductRetrieveView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Product.objects.all()
        return Product.objects.filter(visible=True)


class ProductUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdministrator]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class ProductDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAdministrator]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_destroy(self, instance):
        instance.visible = False
        instance.save(update_fields=["visible"])
