from django.db import models

class Carrier(models.Model):
    email = models.EmailField(unique=True, error_messages={'unique': 'Já existe uma Transportadora com este E-Mail.'})
    name = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe uma Transportadora com este Nome.'})
    cnpj = models.CharField(max_length=18, unique=True, error_messages={'unique': 'Já existe uma Transportadora com este CNPJ.'})

    def __str__(self):
        return self.name