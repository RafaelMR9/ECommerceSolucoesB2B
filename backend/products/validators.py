from rest_framework import serializers
from .models import Product

class CustomValidators:
    
    @staticmethod
    def validate_category_circular_relationship(category, subCategory):
      visited = set()

      while subCategory is not None:
          if subCategory in visited:
              raise serializers.ValidationError("Não é permitido criar uma dependência circular entre categorias.")
          
          visited.add(subCategory)
          
          if category == subCategory.category:
            subCategory = category
          else:
            subCategory = subCategory.category

    @staticmethod
    def validate_category_same_subcategory(category, subCategory):
        if category == subCategory:
            raise serializers.ValidationError("Uma categoria não pode ser subcategoria de si própria.")
        
    @staticmethod
    def validate_category_deletion(category):
      if Product.objects.filter(category=category).exists():
        raise serializers.ValidationError({'title':"Não é possível excluir esta categoria, pois existem produtos associados a ela.", "leading":"Associe os produtos a outras categorias antes de prosseguir com a remoção."})
      
      if category.subcategory.exists():
        for subcategory in category.subcategory.all():
          if Product.objects.filter(category=subcategory).exists():
            raise serializers.ValidationError({'title':"Não é possível excluir esta categoria, pois suas subcategorias têm produtos associados a elas.", "leading":"Associe os produtos a outras categorias antes de prosseguir com a remoção."})