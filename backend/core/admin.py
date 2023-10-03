from django.contrib import admin
from .models import User, PasswordResetToken

# Register your models here.
admin.site.register(User)
admin.site.register(PasswordResetToken)
