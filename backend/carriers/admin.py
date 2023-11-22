from django.contrib import admin
from .models import Carrier, SalesShipment

# Register your models here.
admin.site.register(Carrier)
admin.site.register(SalesShipment)