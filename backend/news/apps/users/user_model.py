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
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    username = models.CharField(max_length=256, unique=True)
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)
    permissions = models.JSONField(default=dict)

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"
        ordering = ("-created_at",)
        managed = False
