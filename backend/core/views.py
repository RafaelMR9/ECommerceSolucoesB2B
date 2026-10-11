from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .validators import CustomValidators
from .serializers import UserSerializer, PasswordResetTokenSerializer
from .models import User, PasswordResetToken

# Create your views here.
class AdministratorIdView(APIView):
  def get(self, request):
    admin = User.objects.filter(is_superuser=True).order_by('pk').first()
    return Response({'id': admin.id}) if admin else Response({'detail': 'Atendimento indisponível.'}, status=404)
        
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

class ResetPasswordInput(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField()
    confirmPassword = serializers.CharField()

class UpdatePasswordView(generics.UpdateAPIView):
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        data = ResetPasswordInput(data=request.data)
        data.is_valid(raise_exception=True)
        values = data.validated_data
        reset = PasswordResetToken.objects.select_for_update().filter(token=values['token'], user_id=kwargs['pk'], created_at__gte=timezone.now()-timedelta(hours=1)).first()
        if not reset:
            raise serializers.ValidationError({'detail': 'Este link de recuperação é inválido ou expirou.'})
        CustomValidators.validate_equal_password(values['password'], values['confirmPassword'])
        CustomValidators.validate_password(values['password'])
        user = reset.user
        user.set_password(values['password'])
        user.save(update_fields=['password'])
        PasswordResetToken.objects.filter(user=user).delete()
        return Response({'status': 200})

class PasswordResetTokenCheckView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            token = uuid.UUID(request.query_params.get('token', ''))
        except (ValueError, TypeError, AttributeError):
            return Response({'status': False})
        reset = PasswordResetToken.objects.filter(token=token, created_at__gte=timezone.now()-timedelta(hours=1)).first()
        return Response({'status': True, 'id': reset.id, 'user_id': reset.user_id}) if reset else Response({'status': False})

class PasswordResetTokenDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PasswordResetToken.objects.filter(user=self.request.user)

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

          {settings.FRONTEND_URL}/authentication/recover-password?token={token}&isReady={token}&email={user.email}

          Se você não solicitou essa mudança, ignore este e-mail.
          ''',
          admin.email if admin else settings.DEFAULT_FROM_EMAIL,
          [user.email],
          fail_silently=False
        )
        return Response({"status": "success", "message": "E-Mail de redefinição enviado. Certifique-se de checar o spam."})
      return Response({"status": "error", "message": "Não existe nenhuma conta relacionada ao E-Mail fornecido."})
