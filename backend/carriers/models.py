from django.db import models
from orders.models import SalesOrder

class Carrier(models.Model):
    email = models.EmailField(unique=True, error_messages={'unique': 'Já existe uma Transportadora com este E-Mail.'})
    name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe uma Transportadora com este Nome.'})
    cnpj = models.CharField(max_length=18, unique=True, error_messages={'unique': 'Já existe uma Transportadora com este CNPJ.'})

    def __str__(self):
        return self.name
    
class SalesShipment(models.Model):
  dateHour = models.DateTimeField()
  salesOrder = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)
  carrier = models.ForeignKey(Carrier, on_delete=models.CASCADE)

  def __str__(self):
    return f"Embarque do Pedido: {self.salesOrder}"