import json
from django.db import transaction
from rest_framework import serializers

from apps.courses_main.models import Category, Course, Lesson
from apps.users.user_model import UserModel


class AdminManageCategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta", "state", "created_at"]
        read_only_fields = ["guid", "created_at"]


class _AdminManageCourseCategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]


class _AdminManageCourseAuthorModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            "guid",
            "first_name",
            "last_name",
        ]


class _AdminManageCourseLessonModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["order", "video"]


class AdminManageCourseReadSerializer(serializers.ModelSerializer):
    category = _AdminManageCourseCategoryModelSerializer()
    author = _AdminManageCourseAuthorModelSerializer()
    subscriptions = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "guid",
            "title",
            "meta",
            "state",
            "category",
            "short_description",
            "description",
            "thumbnail",
            "subscriptions",
            "likes",
            "author",
            "created_at",
            "lessons",
        ]

    def get_lessons(self, obj):
        return obj.course_lessons_courses.count()

    def get_likes(self, obj):
        return obj.liked.count()

    def get_subscriptions(self, obj):
        return obj.subscribed.count()


class CourseModelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["category", "author", "title", "short_description", "description", "meta", "state", "thumbnail"]


class LessonModelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["order", "video"]


class AdminManageCourseWriteSerializer(serializers.Serializer):
    course = serializers.JSONField(write_only=True)
    lessons = serializers.JSONField(write_only=True, required=False)
    thumbnail = serializers.ImageField(write_only=True, required=False)

    def validate_course(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON for course")
        if not isinstance(value, dict):
            raise serializers.ValidationError("Course must be an object")
        return value

    def validate_lessons(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON for lessons")
        if not isinstance(value, list):
            raise serializers.ValidationError("Lessons must be a list")
        return value

    @transaction.atomic
    def create(self, validated_data):
        course_data = validated_data.get("course", {})
        course_data['author'] = self.context["request"].user.guid
        lessons_data = validated_data.get("lessons", [])
        thumbnail = validated_data.get("thumbnail")

        if thumbnail:
            course_data["thumbnail"] = thumbnail

        course_serializer = CourseModelWriteSerializer(data=course_data)
        course_serializer.is_valid(raise_exception=True)
        course = course_serializer.save()

        for lesson in lessons_data:
            lesson_serializer = LessonModelWriteSerializer(data=lesson)
            lesson_serializer.is_valid(raise_exception=True)
            lesson_serializer.save(course=course)

        return course

    @transaction.atomic
    def update(self, instance, validated_data):
        course_data = validated_data.get("course", {})
        lessons_data = validated_data.get("lessons")
        thumbnail = validated_data.get("thumbnail")

        if thumbnail:
            course_data["thumbnail"] = thumbnail

        course_serializer = CourseModelWriteSerializer(instance, data=course_data, partial=True)
        course_serializer.is_valid(raise_exception=True)
        course = course_serializer.save()

        if lessons_data is not None:
            instance.course_lessons_courses.all().delete()
            for lesson in lessons_data:
                lesson_serializer = LessonModelWriteSerializer(data=lesson)
                lesson_serializer.is_valid(raise_exception=True)
                lesson_serializer.save(course=course)

        return course
