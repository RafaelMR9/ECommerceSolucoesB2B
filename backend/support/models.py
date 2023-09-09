from django.db import models
from core.models import User

# Create your models here.
class Ticket(models.Model):
  answer = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
  originalTicket = models.ForeignKey('self', on_delete=models.CASCADE, null=True, related_name='responses')
  sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='sender')
  recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='recipient')
  subject = models.CharField(max_length=255, null=True)
  content = models.TextField(max_length=300)
  dateHour = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Ticket: {self.id}"