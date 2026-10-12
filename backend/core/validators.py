import re

from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from django.core.exceptions import ValidationError


def validate_password(value):
    django_validate_password(value)
    if not any(character.isalpha() for character in value):
        raise ValidationError("A senha deve incluir letras.")


def validate_cpf(value):
    if value and not re.fullmatch(r"\d{3}\.\d{3}\.\d{3}-\d{2}", value):
        raise ValidationError("CPF inválido.")


def validate_cnpj(value):
    if value and not re.fullmatch(r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}", value):
        raise ValidationError("CNPJ inválido.")
