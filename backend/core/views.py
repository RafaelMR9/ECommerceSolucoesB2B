from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .validators import CustomValidators
from .serializers import UserSerializer
from .models import User

# Create your views here.
class AdministratorIdView(APIView):
  def get(self, request):
    admin = User.objects.get(is_superuser=True)
    return Response({'id': admin.id})
        
class UserListView(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDestroyView(generics.DestroyAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserUpdateView(generics.UpdateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  lookup_field = 'pk'

class UserRetrieveView(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserCreateView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def perform_create(self, serializer):
    CustomValidators.validate_equal_password(serializer.validated_data['password'], self.request.data.get('confirmPassword'))
    serializer.save()