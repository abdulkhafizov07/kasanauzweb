from rest_framework import serializers


class CoursesStatisticsSerializer(serializers.Serializer):
    total_courses = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    courses_by_category = serializers.DictField(child=serializers.IntegerField())
