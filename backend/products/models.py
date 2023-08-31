from django.db import models
from django.utils import timezone
from marketing.models import Promotion

# Create your models here.
class Category(models.Model):
  name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe uma Categoria com este Nome.'})
  category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategory')

  def __str__(self):
    return self.name
  
class Product(models.Model):
  name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe um Produto com este Nome.'})
  currentStockQuantity = models.IntegerField(default=0, blank=True)
  costPrice = models.FloatField()
  salePrice = models.FloatField()
  description = models.TextField()
  image = models.ImageField()
  packaging = models.IntegerField(default=1)
  visible = models.BooleanField(default=True)
  category = models.ForeignKey(Category, on_delete=models.CASCADE)

  def get_promotion_price(self):
    current_date = timezone.now()
    active_promotions = Promotion.objects.filter(
      product=self,
      startDate__lte=current_date,
      endDate__gte=current_date
    )

    if active_promotions.exists():
        return active_promotions.first().salePrice
    return self.salePrice

  def __str__(self):
      return self.name