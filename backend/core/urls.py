from django.urls import path
from .views import UserList, UserCreate, UserDetail, UserUpdate, UserDelete

app_name = 'core'

urlpatterns = [
    path('', UserList.as_view()),
    path('create/', UserCreate.as_view()),
    path('<int:pk>/', UserDetail.as_view()),
    path('<int:pk>/update/', UserUpdate.as_view()),
    path('<int:pk>/delete/', UserDelete.as_view()),
]
