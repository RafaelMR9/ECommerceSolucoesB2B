from django.db import models
from products.models import Product
from core.models import User
from suppliers.models import Supplier
from carriers.models import Carrier

# Create your models here.
class SalesOrder(models.Model):
  orderDate = models.DateTimeField(auto_now_add=True)
  deliveryDate = models.DateField(null=True)
  cancelled = models.BooleanField(default=False, null=True)
  sending = models.BooleanField(default=False)
  recieved = models.BooleanField(default=False)
  paid = models.BooleanField(null=True, default=None)
  faturedPayment = models.BooleanField(default=False)
  finished = models.BooleanField(default=False)
  totalSaleValue = models.FloatField()
  deliveryFrequency = models.IntegerField(null=True, blank=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return f"Pedido: {self.id}"
  
class ItemSalesOrder(models.Model):
  salePrice = models.FloatField()
  quantity = models.IntegerField()
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  salesOrder = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)

  def __str__(self):
    return f"Item Pedido: {self.id}"

class SalesInvoice(models.Model):
  salePrice = models.FloatField()
  number = models.IntegerField()

  def __str__(self):
    return f"Nota Fiscal: {self.id}"
  
class ItemSalesInvoice(models.Model):
  quantity = models.IntegerField()
  salePrice = models.FloatField()
  salesInvoice = models.ForeignKey(SalesInvoice, on_delete=models.CASCADE)

  def __str__(self):
    return f"Item Nota Fiscal: {self.id}"
  
class SalesShipment(models.Model):
  dateHour = models.DateTimeField()
  salesOrder = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)
  carrier = models.ForeignKey(Carrier, on_delete=models.CASCADE)

  def __str__(self):
    return f"Embarque do Pedido: {self.salesOrder}"


class SupplierOrder(models.Model):
  orderDate = models.DateTimeField(auto_now_add=True)
  deliveryDate = models.DateField(null=True)
  recieved = models.BooleanField(default=None, null=True)
  faturedPayment = models.BooleanField(default=False)
  finished = models.BooleanField(default=False)
  totalCostValue = models.FloatField()
  deliveryFrequency = models.IntegerField(null=True, blank=True)
  supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return f"Pedido: {self.id}"
  
class ItemSupplierOrder(models.Model):
  costPrice = models.FloatField()
  quantity = models.IntegerField()
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  supplierOrder = models.ForeignKey(SupplierOrder, on_delete=models.CASCADE)

  def __str__(self):
    return f"Item Pedido: {self.id}"
  
class SupplierInvoice(models.Model):
  costPrice = models.FloatField()
  number = models.IntegerField()

  def __str__(self):
    return f"Nota Fiscal: {self.id}"
  
class ItemSupplierInvoice(models.Model):
  quantity = models.IntegerField()
  costPrice = models.FloatField()
  supplierInvoice = models.ForeignKey(SupplierInvoice, on_delete=models.CASCADE)

  def __str__(self):
    return f"Item Nota Fiscal: {self.id}"