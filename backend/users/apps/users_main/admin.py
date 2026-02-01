from django.contrib import admin

from apps.users.user_model import UserModel

# Register your models here.


admin.site.register({UserModel})
