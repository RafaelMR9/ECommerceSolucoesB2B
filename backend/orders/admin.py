from django.contrib import admin
from .models import SalesOrder, ItemSalesOrder, SupplierOrder, ItemSupplierOrder, SalesInvoice, ItemSalesInvoice, SupplierInvoice, ItemSupplierInvoice

# Register your models here.
admin.site.register(SalesOrder)
admin.site.register(ItemSalesOrder)
admin.site.register(SupplierOrder)
admin.site.register(ItemSupplierOrder)
admin.site.register(SalesInvoice)
admin.site.register(ItemSalesInvoice)
admin.site.register(SupplierInvoice)
admin.site.register(ItemSupplierInvoice)