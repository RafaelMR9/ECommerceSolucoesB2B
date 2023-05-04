from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from .validators import CustomViewsValidation
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from .models import User

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
  lookup_field = 'pk'

class UserDetail(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserCreate(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def perform_create(self, serializer):
    CustomViewsValidation.validate_password(serializer.validated_data['password'], self.request.data.get('confirmPassword'))
    serializer.save()

class CustomTokenObtainPairView(TokenObtainPairView):
  serializer_class = CustomTokenObtainPairSerializer