from rest_framework import serializers


class AnnouncementStatisticsSerializer(serializers.Serializer):
    total_announcements = serializers.IntegerField()
    total_views = serializers.IntegerField()
    announcements_by_type = serializers.DictField(child=serializers.IntegerField())
    announcements_by_region = serializers.DictField(child=serializers.IntegerField())
