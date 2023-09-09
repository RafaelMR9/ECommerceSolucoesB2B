from rest_framework import generics
from django.db.models import Q
from .validators import CustomValidators
from .models import Ticket
from .serializers import TicketSerializer

class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.filter(answer=None).order_by('dateHour')

        return queryset
    
class TicketCreateView(generics.CreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        subject = serializer.validated_data.get('subject')
        answer = serializer.validated_data.get('answer')
        
        if answer == None:
            CustomValidators.validate_subject(subject)

        serializer.save()

class TicketFilterView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')
        queryset = Ticket.objects.filter(Q(sender=user) | Q(recipient=user), answer__isnull=True)
        return queryset
    
class TicketRetrieveView(generics.RetrieveAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class TicketResponsesListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        originalTicket = self.kwargs['pk']
        queryset = Ticket.objects.filter(answer__id=originalTicket).order_by('dateHour')

        return queryset