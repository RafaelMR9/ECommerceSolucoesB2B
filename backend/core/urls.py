from django.urls import path
from .views import UserList, UserCreate, UserDetail, UserUpdate, UserDelete
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

app_name = 'core'

urlpatterns = [
    path('', UserList.as_view()),
    path('register/', UserCreate.as_view()),
    path('<int:pk>/update/', UserUpdate.as_view()),
    path('<int:pk>/delete/', UserDelete.as_view()),
    path('<int:pk>/detail/', UserDetail.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
