from django.contrib.auth.models import AbstractUser
from django.db import models

from .base_model_bind import BaseModel


class Role(models.TextChoices):
    SUPERADMIN = "superadmin", "Superadmin"
    ADMIN = "admin", "Admin"
    MODERATOR = "moderator", "Moderator"
    USER = "user", "Foydalanuvchi"
    HOUSEMAKER = "housemaker", "Kasanachi"


class UserModel(AbstractUser, BaseModel):
    DEFAULT_PFP = "users/default.jpg"

    pfp = models.ImageField(upload_to="users/", null=True, blank=True, default=DEFAULT_PFP)

    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    phone = models.CharField(max_length=15, unique=True)
    username = models.CharField(max_length=256, unique=True)

    purposes = models.TextField(max_length=1024)

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)
    permissions = models.JSONField(default=dict)

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"
        ordering = ("-created_at",)
        managed = False
