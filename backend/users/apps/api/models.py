from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.users.user_model import UserModel
from apps.users_main.models import BaseModel

from .utils import random_code_generate

# Create your models here.


class VerificationCodeModel(BaseModel):
    code = models.PositiveBigIntegerField(
        unique=True, validators=[MinValueValidator(10000), MaxValueValidator(99999)], default=random_code_generate
    )
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="user_verification_codes")

    def __str__(self):
        return f"{self.code} - {self.user} {'✅' if self.is_active else '❌'}"

    class Meta:
        db_table = "users_app__verification_code_model"
