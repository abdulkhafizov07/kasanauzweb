from rest_framework import serializers

from apps.announcements_main.models import Announcement
from apps.users.user_model import UserModel


# ----------------- User -----------------

class AnnouncementUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "pfp", "first_name", "last_name"]


# ----------------- Announcement (General) -----------------

class AnnouncementSerializer(serializers.ModelSerializer):
    user = AnnouncementUserSerializer()

    class Meta:
        model = Announcement
        fields = [
            "guid",
            "user",
            "thumbnail",
            "title",
            "meta",
            "experience",
            "work_time",
            "price_min",
            "price_max",
            "dealed",
            "address",
            "short_description",
            "created_at",
        ]


class AnnouncementContentSerializer(serializers.ModelSerializer):
    user = AnnouncementUserSerializer()

    class Meta:
        model = Announcement
        fields = [
            "guid",
            "user",
            "thumbnail",
            "title",
            "meta",
            "experience",
            "work_time",
            "price_min",
            "price_max",
            "dealed",
            "address",
            "description",
            "created_at",
        ]


class LeastAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ["title", "short_description", "price_min", "price_max", "dealed", "thumbnail"]


# ----------------- Composite -----------------

class AnnouncementFullContentSerializer(serializers.Serializer):
    announcements = AnnouncementSerializer(many=True)
    announcement = AnnouncementContentSerializer()


class FullLoadContentSerializer(serializers.Serializer):
    service_announcement = AnnouncementSerializer(many=True)
    work_announcement = AnnouncementSerializer(many=True)


# ----------------- Create / Update -----------------

class CreateAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = [
            "user",
            "announcement_type",
            "thumbnail",
            "title",
            "meta",
            "experience",
            "work_time",
            "price_min",
            "price_max",
            "dealed",
            "region",
            "district",
            "address",
            "short_description",
            "description",
        ]


# ----------------- Search -----------------

class SearchResultAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ["meta", "title", "announcement_type"]


# ----------------- Microservice -----------------

class AnnouncementDataSerializer(serializers.ModelSerializer):
    user = serializers.UUIDField(source="user.guid", read_only=True)

    class Meta:
        model = Announcement
        fields = [
            "guid",
            "title",
            "user",
            "meta",
            "short_description",
            "price_min",
            "price_max",
            "dealed",
        ]
