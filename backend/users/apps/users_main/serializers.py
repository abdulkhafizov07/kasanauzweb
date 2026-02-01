from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainPairSerializer

class SafeTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except get_user_model().DoesNotExist:
            raise InvalidToken("User no longer exists")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = user.role

        return token

class UserStatisticsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    today_users = serializers.IntegerField()
    average_age = serializers.FloatField(allow_null=True)
    gender_stats = serializers.DictField(child=serializers.IntegerField())
    role_stats = serializers.DictField(child=serializers.IntegerField())
    region_stats = serializers.DictField(child=serializers.IntegerField())
