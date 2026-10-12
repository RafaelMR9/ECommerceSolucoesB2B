from django.contrib import admin

from .models import (
    ItemSalesInvoice,
    ItemSalesOrder,
    ItemSupplierInvoice,
    ItemSupplierOrder,
    SalesInvoice,
    SalesOrder,
    SupplierInvoice,
    SupplierOrder,
)

admin.site.register(SalesOrder)
admin.site.register(ItemSalesOrder)
admin.site.register(SupplierOrder)
admin.site.register(ItemSupplierOrder)
admin.site.register(SalesInvoice)
admin.site.register(ItemSalesInvoice)
admin.site.register(SupplierInvoice)
admin.site.register(ItemSupplierInvoice)
