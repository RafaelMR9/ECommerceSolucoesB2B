from django.urls import path
from .views import UserListView, UserCreateView, UserRetrieveView, UserUpdateView, UserDestroyView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

app_name = 'core'

urlpatterns = [
    path('', UserListView.as_view()),
    path('register/', UserCreateView.as_view()),
    path('<int:pk>/update/', UserUpdateView.as_view()),
    path('<int:pk>/delete/', UserDestroyView.as_view()),
    path('<int:pk>/detail/', UserRetrieveView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
