from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    CharField,
    ValidationError,
)
from apps.announcements_main.models import Announcement
from apps.users.user_model import UserModel


class _AdminManageUserAnnouncementModelSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "first_name", "last_name"]
        read_only_fields = fields


class AdminManageAnnouncementModelSerializer(ModelSerializer):
    # Write-only helper fields
    user_phone = CharField(write_only=True, required=False)

    # Read-only nested fields
    user = _AdminManageUserAnnouncementModelSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = [
            "guid",
            "user",
            "announcement_type",
            "title",
            "meta",
            "state",
            "thumbnail",
            "price_min",
            "price_max",
            "dealed",
            "region",
            "district",
            "address",
            "experience",
            "work_time",
            "short_description",
            "description",
            "created_at",
            "user_phone",  # write-only
        ]
        read_only_fields = ["guid", "user", "created_at"]

    def create(self, validated_data):
        user_phone = validated_data.pop("user_phone", None)

        if user_phone:
            try:
                validated_data["user"] = UserModel.objects.get(phone=user_phone)
            except UserModel.DoesNotExist:
                raise ValidationError({"user_phone": "User not found with this phone"})
        else:
            raise ValidationError({"user_phone": "This field is required."})

        return Announcement.objects.create(**validated_data)
