from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, username, password, **extra_fields):
        if not email or not username:
            raise ValueError("Há Campos não Preenchidos.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, cpf=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("authorizeFature", True)
        if (
            extra_fields["is_staff"] is not True
            or extra_fields["is_superuser"] is not True
        ):
            raise ValueError("Um superusuário deve ter is_staff e is_superuser ativos.")
        if not cpf:
            raise ValueError("Há Campos não Preenchidos.")
        email = extra_fields.pop("email", settings.ADMIN_EMAIL)
        return self.create_user(email, username, password, cpf=cpf, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(
        unique=True, error_messages={"unique": "Já existe um Usuário com este E-Mail."}
    )
    username = models.CharField(
        max_length=255,
        unique=True,
        error_messages={"unique": "Já existe um Usuário com este Username."},
    )
    name = models.CharField(
        default=None,
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        error_messages={"unique": "Já existe um Usuário com este Nome."},
    )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    cpf = models.CharField(
        default=None,
        max_length=15,
        null=True,
        blank=True,
        unique=True,
        error_messages={"unique": "Já existe um Usuário com este CPF."},
    )
    cnpj = models.CharField(
        default=None,
        max_length=18,
        null=True,
        blank=True,
        unique=True,
        error_messages={"unique": "Já existe um Usuário com este CNPJ."},
    )
    address = models.CharField(
        default=None,
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        error_messages={"unique": "Já existe um Usuário com este Endereço."},
    )
    authorizeFature = models.BooleanField(default=None, null=True, blank=True)
    canPurchase = models.BooleanField(default=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["cpf"]

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Usuário {self.user}: {self.created_at}"
