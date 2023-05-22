from rest_framework import serializers

class CustomValidators:
    
    @staticmethod
    def validate_category_circular_relationship(category, subCategory):
      visited = set()
      print("AAAAAAAAAAAAAAA", visited)
      while subCategory is not None:
          if subCategory in visited:
              raise serializers.ValidationError("Não é permitido criar uma dependência circular entre categorias.")
          
          visited.add(subCategory)
          
          if category == subCategory.categoria:
            subCategory = category
          else:
            subCategory = subCategory.categoria

    @staticmethod
    def validate_category_subcategory(category, subCategory):
        if category == subCategory:
            raise serializers.ValidationError("Uma categoria não pode ser subcategoria de si própria.")