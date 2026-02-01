from django.db import models

from .base_model import ModelStateChoices


class ModelManager(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(state=ModelStateChoices.APPROVED)
