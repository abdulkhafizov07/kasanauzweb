from datetime import date

from rest_framework import serializers

from apps.users.models import UserModel

from .utils import random_username_generate


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["first_name", "phone", "password"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 8},
            "first_name": {"required": True},
            "phone": {"required": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = UserModel.objects.create_user(username=random_username_generate(), **validated_data)
        user.set_password(password)
        user.save(update_fields=["password"])

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    pfp = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = [
            "guid",
            "role",
            "pfp",
            "first_name",
            "last_name",
            "middle_name",
            "username",
            "phone",
            "email",
            "birthday",
            "gender",
            "region",
            "district",
            "purposes",
            "about",
            "biography",
            "permissions",
            "created_at",
        ]

        read_only_fields = [
            "guid",
            "role",
            "pfp",
            "username",
            "phone",
            "permissions",
            "created_at",
        ]

    def get_pfp(self, obj):
        return obj.pfp.url if obj.pfp else None

    def validate_birthday(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("Tug‘ilgan kun noto‘g‘ri")
        return value
