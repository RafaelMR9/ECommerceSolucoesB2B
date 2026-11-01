from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import User
from marketing.models import Promotion
from products.models import Product
from support.models import Ticket

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
from .serializers import CartItemInput, CheckoutInput


def create_invoice(order, items):
    if isinstance(order, SupplierOrder):
        total = sum(item.costPrice for item in items)
        invoice = SupplierInvoice.objects.create(number=0, costPrice=total)
        ItemSupplierInvoice.objects.bulk_create(
            [
                ItemSupplierInvoice(
                    supplierInvoice=invoice,
                    quantity=item.quantity,
                    costPrice=item.costPrice,
                )
                for item in items
            ]
        )
        order.totalCostValue = total
    else:
        total = sum(item.salePrice for item in items)
        invoice = SalesInvoice.objects.create(number=0, salePrice=total)
        ItemSalesInvoice.objects.bulk_create(
            [
                ItemSalesInvoice(
                    salesInvoice=invoice,
                    quantity=item.quantity,
                    salePrice=item.salePrice,
                )
                for item in items
            ]
        )
        order.totalSaleValue = total
    invoice.number = invoice.pk
    invoice.save(update_fields=["number"])


def add_supplier_item(user, product, quantity):
    order = (
        SupplierOrder.objects.filter(user=user, finished=False).order_by("pk").first()
    )
    if order and order.supplier_id != product.supplier_id:
        raise serializers.ValidationError(
            {"detail": "Finalize o pedido atual antes de comprar de outro fornecedor."}
        )
    if not order:
        order = SupplierOrder.objects.create(
            user=user, supplier_id=product.supplier_id, totalCostValue=0
        )
    item = ItemSupplierOrder.objects.create(
        supplierOrder=order,
        product=product,
        quantity=quantity,
        costPrice=product.costPrice * quantity,
    )
    return item, order


def add_sales_item(user, product, quantity):
    if not user.canPurchase:
        raise serializers.ValidationError(
            {"detail": "Regularize os pagamentos pendentes para comprar."}
        )
    if quantity > product.currentStockQuantity:
        raise serializers.ValidationError(
            {
                "quantity": f"Estoque disponível: {product.currentStockQuantity} embalagens."
            }
        )
    order = SalesOrder.objects.filter(user=user, finished=False).order_by("pk").first()
    if not order:
        order = SalesOrder.objects.create(user=user, totalSaleValue=0)
    now = timezone.now()
    promotion = (
        Promotion.objects.filter(product=product, startDate__lte=now, endDate__gte=now)
        .order_by("pk")
        .first()
    )
    price = promotion.salePrice if promotion else product.salePrice
    item = ItemSalesOrder.objects.create(
        salesOrder=order,
        product=product,
        quantity=quantity,
        salePrice=price * quantity,
    )
    product.currentStockQuantity -= quantity
    product.save(update_fields=["currentStockQuantity"])
    return item, order


class AddCartItemView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = CartItemInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = User.objects.select_for_update().get(pk=request.user.pk)
        product = get_object_or_404(
            Product.objects.select_for_update(), pk=data["product"], visible=True
        )
        if user.is_superuser:
            item, order = add_supplier_item(user, product, data["quantity"])
        else:
            item, order = add_sales_item(user, product, data["quantity"])
        return Response({"id": item.id, "order": order.id}, status=201)


class RemoveCartItemView(APIView):
    @transaction.atomic
    def delete(self, request, pk):
        user = User.objects.select_for_update().get(pk=request.user.pk)
        if user.is_superuser:
            item = get_object_or_404(
                ItemSupplierOrder.objects.select_for_update(),
                pk=pk,
                supplierOrder__user=user,
                supplierOrder__finished=False,
            )
            order = item.supplierOrder
            item.delete()
            if not order.itemsupplierorder_set.exists():
                order.delete()
        else:
            item = get_object_or_404(
                ItemSalesOrder.objects.select_for_update(),
                pk=pk,
                salesOrder__user=user,
                salesOrder__finished=False,
            )
            product = Product.objects.select_for_update().get(pk=item.product_id)
            product.currentStockQuantity += item.quantity
            product.save(update_fields=["currentStockQuantity"])
            item.delete()
        return Response(status=204)


class CheckoutView(APIView):
    @transaction.atomic
    def post(self, request):
        serializer = CheckoutInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = User.objects.select_for_update().get(pk=request.user.pk)
        if not user.is_superuser and not user.canPurchase:
            raise serializers.ValidationError(
                {"detail": "Regularize os pagamentos pendentes para comprar."}
            )
        if data["faturedPayment"] and not user.authorizeFature:
            raise serializers.ValidationError(
                {"faturedPayment": "Compras faturadas ainda não estão autorizadas."}
            )
        model = SupplierOrder if user.is_superuser else SalesOrder
        order = model.objects.filter(user=user, finished=False).order_by("pk").first()
        if not order:
            raise serializers.ValidationError(
                {"detail": "Adicione um produto ao carrinho antes de finalizar."}
            )
        items = list(
            order.itemsupplierorder_set.all()
            if user.is_superuser
            else order.itemsalesorder_set.all()
        )
        if not items:
            raise serializers.ValidationError({"detail": "O carrinho está vazio."})
        create_invoice(order, items)
        order.deliveryDate = data["deliveryDate"]
        order.deliveryFrequency = data["deliveryFrequency"]
        order.faturedPayment = data["faturedPayment"]
        order.finished = True
        order.save()
        if not user.is_superuser:
            admin = User.objects.filter(is_superuser=True).order_by("pk").first()
            if admin:
                Ticket.objects.create(
                    sender=admin,
                    recipient=user,
                    subject=f"{(user.name or user.username)[:180]}: Compra realizada com sucesso.",
                    content=f"Sua compra foi efetuada com sucesso. Número do pedido: {order.pk}.",
                )
        return Response(
            {"order": order.pk, "next": "/orders" if user.is_superuser else "/support"}
        )
