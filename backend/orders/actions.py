"""Order transitions with role checks and atomic stock/payment updates."""
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from carriers.models import Carrier, SalesShipment
from core.models import User
from products.models import Product
from support.models import Ticket
from .models import SalesOrder, SupplierOrder


class OrderActionInput(serializers.Serializer):
    action = serializers.ChoiceField(choices=['cancel', 'prepare', 'send', 'receive', 'unreceived', 'paid', 'unpaid'])
    carrier = serializers.IntegerField(min_value=1, required=False)


def restore_stock(items):
    for item in items.order_by('product_id', 'pk'):
        Product.objects.filter(pk=item.product_id).update(currentStockQuantity=F('currentStockQuantity') + item.quantity)


class OrderActionView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, kind, pk):
        data = OrderActionInput(data=request.data)
        data.is_valid(raise_exception=True)
        action = data.validated_data['action']
        admin = request.user.is_superuser
        if kind == 'supplier':
            if not admin:
                raise PermissionDenied('Esta ação é exclusiva da administração.')
            order = get_object_or_404(SupplierOrder.objects.select_for_update(), pk=pk, finished=True)
            if action not in ['receive', 'unreceived'] or order.recieved is not None:
                raise serializers.ValidationError({'detail': 'Este pedido já foi processado ou a ação é inválida.'})
            order.recieved = action == 'receive'
            if order.recieved:
                restore_stock(order.itemsupplierorder_set.all())
        else:
            orders = SalesOrder.objects.select_for_update().filter(finished=True)
            if not admin:
                orders = orders.filter(user=request.user)
                if action != 'cancel':
                    raise PermissionDenied('Esta ação é exclusiva da administração.')
            order = get_object_or_404(orders, pk=pk)
            if action in ['cancel', 'prepare']:
                if order.cancelled is not False:
                    raise serializers.ValidationError({'detail': 'Este pedido já foi processado.'})
                order.cancelled = True if action == 'cancel' else None
                if action == 'cancel':
                    restore_stock(order.itemsalesorder_set.all())
            elif action == 'send':
                if order.cancelled is not None or order.sending:
                    raise serializers.ValidationError({'detail': 'Prepare o pedido antes de enviá-lo.'})
                carrier = get_object_or_404(Carrier, pk=data.validated_data.get('carrier'))
                SalesShipment.objects.create(dateHour=timezone.now(), salesOrder=order, carrier=carrier)
                order.sending = True
            elif action == 'receive':
                if order.cancelled is True or not order.sending or order.recieved:
                    raise serializers.ValidationError({'detail': 'Este pedido não está aguardando recebimento.'})
                order.recieved = True
            elif action in ['paid', 'unpaid']:
                paid = action == 'paid'
                if order.cancelled is not None or order.paid is paid:
                    raise serializers.ValidationError({'detail': 'Este pagamento já foi processado ou o pedido não foi preparado.'})
                buyer = User.objects.select_for_update().get(pk=order.user_id)
                order.paid = paid
                order.save(update_fields=['paid'])
                if not paid:
                    Ticket.objects.create(sender=request.user, recipient=buyer, subject=f'{buyer.name or buyer.username}: Atraso no pagamento.', content=f'O pagamento do pedido {order.pk} está pendente. Regularize os pagamentos para voltar a realizar compras.')
                buyer.canPurchase = not SalesOrder.objects.filter(user=buyer, paid=False).exclude(cancelled=True).exists()
                buyer.save(update_fields=['canPurchase'])
            else:
                raise serializers.ValidationError({'detail': 'Ação inválida para este pedido.'})
        order.save()
        return Response({'id': order.pk})
