from rest_framework.exceptions import ValidationError
from rest_framework.permissions import BasePermission


class IsAdministrator(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_superuser
        )


def requested_user_id(request):
    value = request.query_params.get("user")
    if not request.user.is_superuser or value is None:
        return request.user.pk
    if not value.isdecimal() or int(value) < 1:
        raise ValidationError({"user": "Informe um identificador de usuário válido."})
    return int(value)
