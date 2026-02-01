from rest_framework import serializers

from hitcount.utils import get_hitcount_model

from apps.courses_main.models import Category, Course, Lesson
from apps.users.models import UserModel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]


class SimpleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["title", "meta"]


class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["pfp", "first_name", "last_name"]


class CoursesListSerializer(serializers.ModelSerializer):
    views = serializers.SerializerMethodField()
    category = SimpleCategorySerializer()
    author = SimpleAuthorSerializer()

    class Meta:
        model = Course
        fields = ["guid", "author", "title", "category", "meta", "short_description", "thumbnail", "views", "created_at"]

    def get_views(self, obj):
        return get_hitcount_model().objects.get_for_object(obj).hits


class LessonDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["guid", "order", "video", "created_at"]


class CourseDetailSerializer(serializers.ModelSerializer):
    views = serializers.SerializerMethodField()
    lessons = serializers.SerializerMethodField()
    author = SimpleAuthorSerializer()
    category = SimpleCategorySerializer()

    class Meta:
        model = Course
        fields = ["guid", "author", "title", "category", "meta", "thumbnail", "description", "views", "lessons", "created_at"]

    def get_views(self, obj):
        return get_hitcount_model().objects.get_for_object(obj).hits

    def get_lessons(self, obj):
        return obj.course_lessons_courses.values("guid", "order", "video")


class FullLoadContentSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True)
    top = CoursesListSerializer(many=True)
    new = CoursesListSerializer(many=True)
    offered = CoursesListSerializer(many=True)


class SearchResultSerializer(serializers.Serializer):
    meta = serializers.CharField()
    title = serializers.CharField()
