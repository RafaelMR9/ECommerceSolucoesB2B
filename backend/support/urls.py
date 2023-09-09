from django.urls import path
from .views import TicketCreateView, TicketFilterView, TicketRetrieveView, TicketResponsesListView, TicketListView

app_name = 'support'

urlpatterns = [
    path('', TicketListView.as_view()),
    path('register/', TicketCreateView.as_view()),
    path('filter/', TicketFilterView.as_view()),
    path('<int:pk>/detail/', TicketRetrieveView.as_view()),
    path('<int:pk>/responses/', TicketResponsesListView.as_view()),
]