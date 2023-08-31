from django.db import models
from products.models import Product

# Create your models here.
class Promotion(models.Model):
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    salePrice = models.FloatField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"Promoção: {self.startDate} - {self.endDate}"