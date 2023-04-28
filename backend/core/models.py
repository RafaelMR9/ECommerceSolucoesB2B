from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def _create_user(self, email, login, password, **extra_fields):
        if not email or not login:
            raise ValueError('Há Campos não Preenchidos.')
        email = self.normalize_email(email)
        user = self.model(email=email, login=login, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, login=None, password=None, **extra_fields):
        extra_fields.setdefault('podeComprar', False)
        extra_fields.setdefault('credito', 0)
        return self._create_user(email, login, password, **extra_fields)

    def create_superuser(self, email, login, password=None, cpf=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not cpf:
            raise ValueError('Há Campos não Preenchidos.')
        return self._create_user(email, login, password, cpf=cpf, **extra_fields)
        

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    login = models.CharField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    cpf = models.CharField(default=None, max_length=15, null=True, blank=True, unique=True)
    cnpj = models.CharField(default=None, max_length=18, null=True, blank=True, unique=True)
    endereco = models.CharField(default=None, max_length=255, null=True, blank=True, unique=True)
    credito = models.FloatField(default=None, null=True, blank=True)
    prazoPagamento = models.IntegerField(default=None, null=True, blank=True)
    podeComprar = models.BooleanField(default=None, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['email', 'cpf']