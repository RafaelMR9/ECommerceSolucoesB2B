from django.db import models
from core.models import User

# Create your models here.
class Message(models.Model):
  answer = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
  sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
  recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
  subject = models.CharField(max_length=255)
  content = models.TextField(max_length=300)
  dateHour = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return self.subject