import uuid

from django.db import models


class ModelStateChoices(models.TextChoices):
    ON_MODERATION = "moderation", "Moderatsiya jarayonida"
    APPROVED = "approved", "Tasdiqlangan"
    REJECTED = "rejected", "Rad etilgan"
    BANNED = "banned", "Ban qilingan"
    HIDDEN = "hidden", "Yashirilgan / ko‘rinmaydi"


class BaseModel(models.Model):
    guid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

    state = models.CharField(max_length=12, choices=ModelStateChoices.choices)

    class Meta:
        abstract = True
        ordering = ("-created_at",)
