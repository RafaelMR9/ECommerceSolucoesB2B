from django.db import models
from products.models import Product
from core.models import User

# Create your models here.
# class itemSalesOrder(models.Model):
#   salePrice = models.FloatField()
#   quantity = models.IntegerField()
#   product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
#   salesOrder = models.ForeignKey(salesOrder, on_delete=models.CASCADE, null=False)

#   def __str__(self):
#       return self.salesOrder
  
# class salesOrder(models.Model):
#   orderDate = models.DateTimeField()
#   cancelled = models.BooleanField(default=False)
#   saleValue = models.FloatField()
#   deliveryFrequency = models.BooleanField(default=False)
#   user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

#   def __str__(self):
#       return self.orderDate