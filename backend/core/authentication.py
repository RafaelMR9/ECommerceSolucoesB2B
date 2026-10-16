from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserSerializer


class CurrentUserView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response.data["access_max_age"] = max(
            0, int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()) - 30
        )
        response.data["refresh_max_age"] = int(
            settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
        )
        return response


class RefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response.data["access_max_age"] = max(
            0, int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()) - 30
        )
        response.data["refresh_max_age"] = int(
            settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
        )
        return response
