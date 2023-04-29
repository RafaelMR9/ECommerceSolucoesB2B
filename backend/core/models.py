from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, username, password, **extra_fields):
        if not email or not username:
            raise ValueError('Há Campos não Preenchidos.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, cpf=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not cpf:
            raise ValueError('Há Campos não Preenchidos.')
        return self.create_user(email, username, password, cpf=cpf, **extra_fields)
        

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe um Usuário com este Nome.'})
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    cpf = models.CharField(default=None, max_length=15, null=True, blank=True, unique=True, error_messages={'unique': 'Já existe um Usuário com este CPF.'})
    cnpj = models.CharField(default=None, max_length=18, null=True, blank=True, unique=True, error_messages={'unique': 'Já existe um Usuário com este CNPJ.'})
    endereco = models.CharField(default=None, max_length=255, null=True, blank=True, unique=True, error_messages={'unique': 'Já existe um Usuário com este Endereço.'})
    podeFaturada = models.BooleanField(default=None, null=True, blank=True)
    prazoPagamento = models.IntegerField(default=None, null=True, blank=True)
    podeComprar = models.BooleanField(default=None, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'cpf']