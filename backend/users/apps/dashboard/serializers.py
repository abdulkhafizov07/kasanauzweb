from rest_framework.serializers import ModelSerializer

from apps.users.models import UserModel


class UserModelDataSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            "guid",
            "pfp",
            "first_name",
            "last_name",
            "phone",
            "email",
            "birthday",
            "gender",
            "purposes",
            "about",
            "biography",
            "region",
            "district",
            "role",
            "created_at",
        ]
        read_only_fields = ["guid", "role"]
