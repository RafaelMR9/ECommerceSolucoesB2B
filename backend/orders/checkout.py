"""Transactional cart operations. Prices, stock and ownership are checked on the server."""
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from core.models import User
from products.models import Product
from marketing.models import Promotion
from support.models import Ticket
from .models import (SalesOrder, SupplierOrder, ItemSalesOrder, ItemSupplierOrder,
                     SalesInvoice, SupplierInvoice, ItemSalesInvoice, ItemSupplierInvoice)


class CartItemInput(serializers.Serializer):
    product = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)


class CheckoutInput(serializers.Serializer):
    deliveryDate = serializers.DateField(allow_null=True, default=None)
    deliveryFrequency = serializers.IntegerField(min_value=10, allow_null=True, default=None)
    faturedPayment = serializers.BooleanField(default=False)

    def validate(self, data):
        if data['deliveryDate'] and data['deliveryDate'] < timezone.localdate():
            raise serializers.ValidationError({'deliveryDate': 'Escolha uma data de hoje em diante.'})
        if data['deliveryFrequency'] and not data['deliveryDate']:
            raise serializers.ValidationError({'deliveryDate': 'Informe a primeira entrega para o pedido recorrente.'})
        return data


class AddCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = CartItemInput(data=request.data)
        data.is_valid(raise_exception=True)
        user = User.objects.select_for_update().get(pk=request.user.pk)
        product = get_object_or_404(Product.objects.select_for_update(), pk=data.validated_data['product'], visible=True)
        quantity = data.validated_data['quantity']
        if user.is_superuser:
            order = SupplierOrder.objects.filter(user=user, finished=False).first()
            if order and order.supplier_id != product.supplier_id:
                raise serializers.ValidationError({'detail': 'Finalize o pedido atual antes de comprar de outro fornecedor.'})
            if not order:
                order = SupplierOrder.objects.create(user=user, supplier=product.supplier, totalCostValue=0)
            item = ItemSupplierOrder.objects.create(supplierOrder=order, product=product, quantity=quantity, costPrice=product.costPrice * quantity)
        else:
            if not user.canPurchase:
                raise serializers.ValidationError({'detail': 'Regularize os pagamentos pendentes para comprar.'})
            if quantity > product.currentStockQuantity:
                raise serializers.ValidationError({'quantity': f'Estoque disponível: {product.currentStockQuantity} embalagens.'})
            order = SalesOrder.objects.filter(user=user, finished=False).first()
            if not order:
                order = SalesOrder.objects.create(user=user, totalSaleValue=0)
            now = timezone.now()
            promotion = Promotion.objects.filter(product=product, startDate__lte=now, endDate__gte=now).first()
            price = promotion.salePrice if promotion else product.salePrice
            item = ItemSalesOrder.objects.create(salesOrder=order, product=product, quantity=quantity, salePrice=price * quantity)
            product.currentStockQuantity -= quantity
            product.save(update_fields=['currentStockQuantity'])
        return Response({'id': item.id, 'order': order.id}, status=201)


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def delete(self, request, pk):
        user = User.objects.select_for_update().get(pk=request.user.pk)
        if user.is_superuser:
            item = get_object_or_404(ItemSupplierOrder.objects.select_for_update(), pk=pk, supplierOrder__user=user, supplierOrder__finished=False)
            order = item.supplierOrder
            item.delete()
            if not order.itemsupplierorder_set.exists():
                order.delete()
        else:
            item = get_object_or_404(ItemSalesOrder.objects.select_for_update(), pk=pk, salesOrder__user=user, salesOrder__finished=False)
            product = Product.objects.select_for_update().get(pk=item.product_id)
            product.currentStockQuantity += item.quantity
            product.save(update_fields=['currentStockQuantity'])
            item.delete()
        return Response(status=204)


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = CheckoutInput(data=request.data)
        data.is_valid(raise_exception=True)
        user = User.objects.select_for_update().get(pk=request.user.pk)
        if not user.is_superuser and not user.canPurchase:
            raise serializers.ValidationError({'detail': 'Regularize os pagamentos pendentes para comprar.'})
        if data.validated_data['faturedPayment'] and not user.authorizeFature:
            raise serializers.ValidationError({'faturedPayment': 'Compras faturadas ainda não estão autorizadas.'})
        model = SupplierOrder if user.is_superuser else SalesOrder
        order = model.objects.filter(user=user, finished=False).first()
        if not order:
            raise serializers.ValidationError({'detail': 'Adicione um produto ao carrinho antes de finalizar.'})
        items = list(order.itemsupplierorder_set.all() if user.is_superuser else order.itemsalesorder_set.all())
        if not items:
            raise serializers.ValidationError({'detail': 'O carrinho está vazio.'})
        price_field = 'costPrice' if user.is_superuser else 'salePrice'
        total = sum(getattr(item, price_field) for item in items)
        invoice_model = SupplierInvoice if user.is_superuser else SalesInvoice
        invoice_item_model = ItemSupplierInvoice if user.is_superuser else ItemSalesInvoice
        invoice = invoice_model.objects.create(number=0, **{price_field: total})
        invoice.number = invoice.pk
        invoice.save(update_fields=['number'])
        invoice_item_model.objects.bulk_create([invoice_item_model(quantity=item.quantity, **{price_field: getattr(item, price_field), 'supplierInvoice' if user.is_superuser else 'salesInvoice': invoice}) for item in items])
        order.deliveryDate = data.validated_data['deliveryDate']
        order.deliveryFrequency = data.validated_data['deliveryFrequency']
        order.faturedPayment = data.validated_data['faturedPayment']
        order.finished = True
        setattr(order, 'totalCostValue' if user.is_superuser else 'totalSaleValue', total)
        order.save()
        if not user.is_superuser:
            admin = User.objects.filter(is_superuser=True).first()
            if admin:
                Ticket.objects.create(sender=admin, recipient=user, subject=f'{user.name or user.username}: Compra realizada com sucesso.', content=f'Sua compra foi efetuada com sucesso. Número do pedido: {order.pk}.')
        return Response({'order': order.pk, 'next': '/orders' if user.is_superuser else '/support'})
