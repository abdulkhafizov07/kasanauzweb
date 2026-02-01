import uuid

from django.db import models


class BaseModel(models.Model):
    guid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("-created_at",)
