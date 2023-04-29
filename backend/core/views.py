from rest_framework import generics
from .validators import CustomViewsValidation
from .models import User
from .serializers import UserSerializer

# Create your views here.
class UserList(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDelete(generics.DestroyAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserUpdate(generics.UpdateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserCreate(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def perform_create(self, serializer):
    CustomViewsValidation.validate_password(serializer.validated_data['password'], self.request.data.get('confirmPassword'))
    serializer.save()