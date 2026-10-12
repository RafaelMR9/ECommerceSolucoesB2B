from django.contrib import admin

from .models import PasswordResetToken, User

admin.site.register(User)
admin.site.register(PasswordResetToken)
