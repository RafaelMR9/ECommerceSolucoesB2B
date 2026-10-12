from rest_framework import serializers

from .models import PasswordResetToken, User
from .validators import validate_cnpj, validate_cpf, validate_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=False,
        write_only=True,
        trim_whitespace=False,
        validators=[validate_password],
    )
    confirmPassword = serializers.CharField(
        required=False, write_only=True, trim_whitespace=False
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "name",
            "cpf",
            "cnpj",
            "address",
            "authorizeFature",
            "canPurchase",
            "is_staff",
            "is_superuser",
            "last_login",
            "password",
            "confirmPassword",
        )
        read_only_fields = ("is_staff", "is_superuser", "canPurchase", "last_login")
        extra_kwargs = {"email": {"required": False}}

    def validate_cpf(self, value):
        validate_cpf(value)
        return value or None

    def validate_cnpj(self, value):
        validate_cnpj(value)
        return value or None

    def validate_name(self, value):
        return value or None

    def validate_address(self, value):
        return value or None

    def validate(self, data):
        if self.instance is None:
            missing = {
                field: "Este campo é obrigatório."
                for field in ("email", "password", "confirmPassword")
                if not data.get(field)
            }
            if missing:
                raise serializers.ValidationError(missing)
        confirmation = data.pop("confirmPassword", None)
        if "password" in data and data["password"] != confirmation:
            raise serializers.ValidationError(
                {"confirmPassword": "As senhas não coincidem."}
            )
        request = self.context.get("request")
        administrator = (
            self.instance is not None and request and request.user.is_superuser
        )
        if not administrator and "authorizeFature" in data:
            if data["authorizeFature"] is True:
                raise serializers.ValidationError(
                    {"authorizeFature": "A autorização depende da administração."}
                )
            if self.instance and self.instance.authorizeFature is True:
                data.pop("authorizeFature")
        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password is not None:
            instance.set_password(password)
        return super().update(instance, validated_data)


class PasswordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetToken
        fields = ("id", "user", "token", "created_at")


class ResetPasswordInput(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(
        trim_whitespace=False, validators=[validate_password]
    )
    confirmPassword = serializers.CharField(trim_whitespace=False)

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError(
                {"confirmPassword": "As senhas não coincidem."}
            )
        return data


class ResetEmailInput(serializers.Serializer):
    email = serializers.EmailField()
