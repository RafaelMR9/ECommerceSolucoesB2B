from rest_framework import generics
from rest_framework.response import Response
from .models import Categoria, Produto
from .validators import CustomValidators
from .serializers import CategoriaSerializer, ProdutoSerializer

class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaFilterView(generics.ListAPIView):
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('search', '')
        return Categoria.objects.filter(nome__regex=search_query)

class CategoriaCreateView(generics.CreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaRetrieveView(generics.RetrieveAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaUpdateView(generics.UpdateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        newSubcategory = serializer.validated_data.get('categoria')
        newInstance = Categoria.objects.get(pk=instance.pk)
        newInstance.categoria = newSubcategory

        print(serializer.instance, serializer.instance.nome, serializer.instance.categoria)
        print(serializer.validated_data)
        CustomValidators.validate_category_subcategory(instance, newSubcategory)
        CustomValidators.validate_category_circular_relationship(newInstance, newSubcategory)

        self.perform_update(serializer)
        return Response(serializer.data)

class CategoriaDestroyView(generics.DestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProdutoListView(generics.ListAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ProdutoCreateView(generics.CreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ProdutoRetrieveView(generics.RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ProdutoUpdateView(generics.UpdateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
