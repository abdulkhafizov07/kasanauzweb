from rest_framework import serializers

from hitcount.utils import get_hitcount_model

from apps.news_main.models import Category, DocumentsModel, NewsModel
from apps.users.models import UserModel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]


class SimpleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["title", "meta"]


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["pfp", "first_name", "last_name"]


class NewsListSerializer(serializers.ModelSerializer):
    views = serializers.SerializerMethodField()
    category = SimpleCategorySerializer()

    class Meta:
        model = NewsModel
        fields = ["guid", "title", "category", "meta", "short_description", "thumbnail", "views", "created_at"]

    def get_views(self, obj):
        return get_hitcount_model().objects.get_for_object(obj).hits


class NewsDetailSerializer(serializers.ModelSerializer):
    views = serializers.SerializerMethodField()
    user = SimpleUserSerializer()
    category = SimpleCategorySerializer()

    class Meta:
        model = NewsModel
        fields = [
            "guid",
            "title",
            "user",
            "category",
            "meta",
            "thumbnail",
            "short_description",
            "description",
            "views",
            "created_at",
        ]

    def get_views(self, obj):
        return get_hitcount_model().objects.get_for_object(obj).hits


class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentsModel
        fields = ["guid", "doc_type", "title", "subtitle", "link", "file"]


class FullDocumentsSerializer(serializers.Serializer):
    legacy_documents = DocumentsSerializer(many=True)
    bussinies_documents = DocumentsSerializer(many=True)


class FullLoadContentSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True)
    banner = NewsListSerializer(many=True)
    week = NewsListSerializer(many=True)
    documents = FullDocumentsSerializer()


class SearchResultSerializer(serializers.Serializer):
    meta = serializers.CharField()
    title = serializers.CharField()
