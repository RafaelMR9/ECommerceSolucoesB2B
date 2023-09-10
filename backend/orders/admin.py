from django.contrib import admin
from .models import SalesOrder, ItemSalesOrder

# Register your models here.
admin.site.register(SalesOrder)
admin.site.register(ItemSalesOrder)