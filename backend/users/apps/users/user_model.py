import re
import os

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models

from .base_model_bind import BaseModel


def validate_uz_phone(value):
    pattern = re.compile(r"^(\+998|998)?(90|91|93|94|95|97|98|99|71|88)\d{7}$")

    normalized = re.sub(r"[\s\-\(\)]", "", value)
    if not pattern.match(normalized):
        raise ValidationError("The phone number entered is not valid.")


def random_username():
    return f"user_{os.urandom(12).hex()}"


class Gender(models.IntegerChoices):
    MALE = 0, "Erkak"
    FEMALE = 1, "Ayol"


class Role(models.TextChoices):
    SUPERADMIN = "superadmin", "Superadmin"
    ADMIN = "admin", "Admin"
    MODERATOR = "moderator", "Moderator"
    USER = "user", "Foydalanuvchi"
    HOUSEMAKER = "housemaker", "Kasanachi"


class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")

        extra_fields.setdefault("username", f"shelled_{phone}")

        user = self.model(phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not password:
            raise ValueError("Superusers must have a password.")

        return self.create_user(phone, password, **extra_fields)


class UserModel(AbstractUser, BaseModel):
    DEFAULT_PFP = "users/default.jpg"

    pfp = models.ImageField(upload_to="users/", null=True, blank=True, default=DEFAULT_PFP)

    first_name = models.CharField(max_length=25)
    middle_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)

    username = models.CharField(max_length=256, unique=True, default=random_username)
    phone = models.CharField(unique=True, validators=[validate_uz_phone])
    email = models.EmailField(null=True, blank=True)

    birthday = models.DateField(null=True, blank=True)
    gender = models.PositiveSmallIntegerField(choices=Gender.choices, default=Gender.MALE)

    region = models.CharField(max_length=64)
    district = models.CharField(max_length=64)

    purposes = models.TextField(max_length=1024)
    about = models.TextField(null=True, blank=True, max_length=1024)
    biography = models.TextField(null=True, blank=True, max_length=1024)

    is_oneid = models.BooleanField(default=False)

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)
    permissions = models.JSONField(default=dict)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["first_name", "last_name", "phone"]

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} - [#{self.phone}]"

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"
        ordering = ("-created_at",)
