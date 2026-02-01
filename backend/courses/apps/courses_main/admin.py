from django.contrib import admin

from .models import Category, Course, Lesson

# Register your models here.

admin.site.register({Category, Course, Lesson})
