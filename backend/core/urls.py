from django.urls import path

from .authentication import CurrentUserView, LoginView, RefreshView
from .views import (
    AdministratorIdView,
    GetUserIdByEmail,
    PasswordResetTokenCheckView,
    PasswordResetTokenDestroyView,
    SendResetEmailView,
    UpdatePasswordView,
    UserCreateView,
    UserDestroyView,
    UserListView,
    UserRetrieveView,
    UserUpdateView,
)

app_name = "core"

urlpatterns = [
    path("", UserListView.as_view()),
    path("me/", CurrentUserView.as_view()),
    path("register/", UserCreateView.as_view()),
    path("<int:pk>/update/", UserUpdateView.as_view()),
    path("<int:pk>/delete/", UserDestroyView.as_view()),
    path("<int:pk>/detail/", UserRetrieveView.as_view()),
    path("admin_id", AdministratorIdView.as_view()),
    path("user_id", GetUserIdByEmail.as_view()),
    path("passwordReset/sendResetEmail/", SendResetEmailView.as_view()),
    path("passwordReset/<int:pk>/delete/", PasswordResetTokenDestroyView.as_view()),
    path("passwordReset/<int:pk>/update/", UpdatePasswordView.as_view()),
    path("passwordReset/checkExistence/", PasswordResetTokenCheckView.as_view()),
    path("token/", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", RefreshView.as_view(), name="token_refresh"),
]
