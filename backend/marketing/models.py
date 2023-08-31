from django.db import models
from django.utils import timezone
from products.models import Product

# Create your models here.
class Promotion(models.Model):
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    salePrice = models.FloatField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def get_active_promotion(self):
        current_date = timezone.now()
        if self.startDate <= current_date and current_date <= self.endDate:
            return self.salePrice
        return None

    def __str__(self):
        return f"Promoção: {self.startDate} - {self.endDate}"