from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics

from core.permissions import requested_user_id

from .models import Ticket
from .serializers import TicketSerializer


def accessible_tickets(user):
    tickets = Ticket.objects.all()
    if not user.is_superuser:
        tickets = tickets.filter(Q(sender=user) | Q(recipient=user))
    return tickets


class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        return (
            accessible_tickets(self.request.user)
            .filter(answer=None)
            .order_by("-dateHour", "-pk")
        )


class TicketCreateView(generics.CreateAPIView):
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class TicketFilterView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        user_id = requested_user_id(self.request)
        return (
            accessible_tickets(self.request.user)
            .filter(Q(sender_id=user_id) | Q(recipient_id=user_id), answer=None)
            .order_by("-dateHour", "-pk")
        )


class TicketRetrieveView(generics.RetrieveAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        return accessible_tickets(self.request.user)


class TicketResponsesListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        original = get_object_or_404(
            accessible_tickets(self.request.user), pk=self.kwargs["pk"], answer=None
        )
        return Ticket.objects.filter(answer=original).order_by("dateHour", "pk")
