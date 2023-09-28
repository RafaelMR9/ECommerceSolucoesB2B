from django.db import models
from products.models import Product
from core.models import User

# Create your models here.
class SalesOrder(models.Model):
  orderDate = models.DateTimeField(auto_now_add=True)
  deliveryDate = models.DateField(null=True)
  cancelled = models.BooleanField(default=False, null=True)
  paid = models.BooleanField(default=False)
  faturedPayment = models.BooleanField(default=False)
  finished = models.BooleanField(default=False)
  totalSaleValue = models.FloatField()
  deliveryFrequency = models.IntegerField(null=True, blank=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

  def __str__(self):
      return f"Pedido: {self.id}"
  
class ItemSalesOrder(models.Model):
  salePrice = models.FloatField()
  quantity = models.IntegerField()
  product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
  salesOrder = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)

  def __str__(self):
      return f"Item Pedido: {self.id}"
  