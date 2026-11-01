from django.db.models import Sum

from .models import SalesOrder, SupplierOrder


def cart_count(user):
    model = SupplierOrder if user.is_superuser else SalesOrder
    order = model.objects.filter(user=user, finished=False).order_by("pk").first()
    if order is None:
        return 0
    items = (
        order.itemsupplierorder_set if user.is_superuser else order.itemsalesorder_set
    )
    return items.aggregate(total=Sum("quantity", default=0))["total"]
