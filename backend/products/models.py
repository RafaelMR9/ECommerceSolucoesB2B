from django.db import models
from suppliers.models import Supplier

# Create your models here.
class Category(models.Model):
  name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe uma Categoria com este Nome.'})
  category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategory')

  def __str__(self):
    return self.name
  
class Product(models.Model):
  name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe um Produto com este Nome.'})
  currentStockQuantity = models.IntegerField(default=0)
  costPrice = models.FloatField()
  salePrice = models.FloatField()
  description = models.TextField()
  image = models.ImageField()
  packaging = models.IntegerField(default=1)
  visible = models.BooleanField(default=True)
  category = models.ForeignKey(Category, on_delete=models.CASCADE)
  supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)

  def __str__(self):
    return self.name