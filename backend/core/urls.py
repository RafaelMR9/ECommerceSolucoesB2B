from django.urls import path
from .views import UserList, UserCreate, UserDetail, UserUpdate, UserDelete, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'core'

urlpatterns = [
    path('', UserList.as_view()),
    path('register/', UserCreate.as_view()),
    path('<int:pk>/update/', UserUpdate.as_view()),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
