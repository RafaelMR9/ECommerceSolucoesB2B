from django.db import models
from products.models import Product
from core.models import User

# Create your models here.
# class SalesOrder(models.Model):
#   orderDate = models.DateTimeField()
#   cancelled = models.BooleanField(default=False)
#   saleValue = models.FloatField()
#   deliveryFrequency = models.BooleanField(default=False)
#   user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

#   def __str__(self):
#       return self.orderDate
  
# class ItemSalesOrder(models.Model):
#   salePrice = models.FloatField()
#   quantity = models.IntegerField()
#   product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
#   salesOrder = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, null=False)

#   def __str__(self):
#       return self.salesOrder
  