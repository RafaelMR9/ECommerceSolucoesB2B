import uuid
from datetime import timedelta
from urllib.parse import urlencode

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PasswordResetToken, User
from .permissions import IsAdministrator
from .serializers import (
    PasswordResetTokenSerializer,
    ResetEmailInput,
    ResetPasswordInput,
    UserSerializer,
)


def valid_reset_tokens():
    return PasswordResetToken.objects.filter(
        created_at__gte=timezone.now() - timedelta(hours=1)
    )


class AdministratorIdView(APIView):
    def get(self, request):
        admin = User.objects.filter(is_superuser=True).order_by("pk").first()
        if not admin:
            return Response({"detail": "Atendimento indisponível."}, status=404)
        return Response({"id": admin.pk})


class UserListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = User.objects.order_by("pk")
    serializer_class = UserSerializer


class UserDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAdministrator]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_destroy(self, instance):
        if (
            instance.salesorder_set.exists()
            or instance.supplierorder_set.exists()
            or instance.sender.exists()
            or instance.recipient.exists()
        ):
            raise serializers.ValidationError(
                {
                    "detail": "Esta conta possui um histórico de pedidos ou atendimento e não pode ser excluída."
                }
            )
        instance.delete()


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(pk=self.request.user.pk)

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class UserRetrieveView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        if self.kwargs["pk"] == self.request.user.pk:
            self.check_object_permissions(self.request, self.request.user)
            return self.request.user
        return super().get_object()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(pk=self.request.user.pk)


class UserCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class GetUserIdByEmail(APIView):
    permission_classes = [IsAdministrator]

    def get(self, request):
        user_id = (
            User.objects.filter(email=request.query_params.get("email"))
            .values_list("pk", flat=True)
            .first()
        )
        return Response({"id": user_id})


class UpdatePasswordView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def put(self, request, pk):
        data = ResetPasswordInput(data=request.data)
        data.is_valid(raise_exception=True)
        reset = (
            valid_reset_tokens()
            .select_for_update()
            .filter(token=data.validated_data["token"], user_id=pk)
            .first()
        )
        if not reset:
            raise serializers.ValidationError(
                {"detail": "Este link de recuperação é inválido ou expirou."}
            )
        user = reset.user
        user.set_password(data.validated_data["password"])
        user.save(update_fields=["password"])
        PasswordResetToken.objects.filter(user=user).delete()
        return Response({"status": 200})

    patch = put


class PasswordResetTokenCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            token = uuid.UUID(request.query_params.get("token", ""))
        except (ValueError, TypeError, AttributeError):
            return Response({"status": False})
        reset = valid_reset_tokens().filter(token=token).first()
        if not reset:
            return Response({"status": False})
        return Response({"status": True, "id": reset.pk, "user_id": reset.user_id})


class PasswordResetTokenDestroyView(generics.DestroyAPIView):
    serializer_class = PasswordResetTokenSerializer

    def get_queryset(self):
        return PasswordResetToken.objects.filter(user=self.request.user)


class SendResetEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = ResetEmailInput(data=request.data)
        data.is_valid(raise_exception=True)
        user = User.objects.filter(email=data.validated_data["email"]).first()
        if user:
            token = PasswordResetToken.objects.create(user=user, token=uuid.uuid4())
            query = urlencode({"token": token.token})
            url = f"{settings.FRONTEND_URL}/authentication/recover-password?{query}"
            send_mail(
                "Redefinição de Senha",
                f"Olá,\n\nPara redefinir sua senha, acesse:\n{url}\n\nSe você não solicitou a mudança, ignore esta mensagem.",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                using="default",
            )
        return Response(
            {
                "status": "success",
                "message": "Se houver uma conta com este e-mail, enviaremos o link de redefinição. Confira também o spam.",
            }
        )
