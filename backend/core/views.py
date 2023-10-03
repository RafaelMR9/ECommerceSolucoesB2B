from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from django.core.mail import send_mail
from .validators import CustomValidators
from .serializers import UserSerializer, PasswordResetTokenSerializer
from .models import User, PasswordResetToken

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

class GetUserIdByEmail(APIView):
    
    def get(self, request, *args, **kwargs):
        email = self.request.query_params.get('email')
        
        try:
            user = User.objects.get(email=email)
            return Response({'id': user.id})
        except User.DoesNotExist:
            return Response({"id": None})

class UpdatePasswordView(generics.UpdateAPIView):

    def update(self, request, *args, **kwargs):
        password = request.data.get("password")
        confirmPassword = request.data.get("confirmPassword")
        
        CustomValidators.validate_equal_password(password, confirmPassword)

        user = User.objects.get(id=kwargs.get('pk'))
        user.set_password(password)
        user.save()

        return Response({"status": 200})
    
class PasswordResetTokenCheckView(generics.RetrieveAPIView):
    queryset = PasswordResetToken.objects.all()

    def get(self, request, *args, **kwargs):
        token = self.request.query_params.get('token')
        try:
          obj = PasswordResetToken.objects.get(token=token)
          return Response({'status': True, 'id': obj.id})
        except PasswordResetToken.DoesNotExist:
          return Response({'status': False})

class PasswordResetTokenDestroyView(generics.DestroyAPIView):
    queryset = PasswordResetToken.objects.all()
    serializer_class = PasswordResetTokenSerializer

class SendResetEmailView(APIView):

    def post(self, request, *args, **kwargs):
      email_receiver = request.data.get("email")
      user = User.objects.filter(email=email_receiver).first()
      admin = User.objects.filter(is_superuser=True).first()

      if user:
        token = uuid.uuid4()

        PasswordResetToken.objects.create(user=user, token=token)
        send_mail(
          "Redefinição de Senha",
          f'''
          Olá,

          Você solicitou a redefinição de senha. 

          Clique no link abaixo para redefinir sua senha:

          http://localhost:3000/authentication/recover-password?token={token}&isReady={token}&email={user.email}

          Se você não solicitou essa mudança, ignore este e-mail.
          ''',
          admin.email,
          [user.email],
          fail_silently=False
        )
        return Response({"status": "success", "message": "E-Mail de redefinição enviado. Certifique-se de checar o spam."})
      return Response({"status": "error", "message": "Não existe nenhuma conta relacionada ao E-Mail fornecido."})