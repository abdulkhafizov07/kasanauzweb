from rest_framework import serializers

from .models import DocumentsModel, NewsModel, Category


class DocumentsReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentsModel
        fields = ["guid", "title", "subtitle", "link", "file", "created_at"]
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.doc_type == "legacy_documents":
            data.pop("file", None)

        if instance.doc_type == "business_documents":
            data.pop("link", None)

        return data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["title", "meta"]


class NewsHomeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = NewsModel
        fields = [
            "title",
            "short_description",
            "category",
            "meta",
            "created_at",
            "thumbnail",
        ]


class NewsStatisticsSerializer(serializers.Serializer):
    total_news = serializers.IntegerField()
    total_news_views = serializers.IntegerField()
    total_documents = serializers.IntegerField()
    news_by_category = serializers.DictField(child=serializers.IntegerField())
    documents_by_type = serializers.DictField(child=serializers.IntegerField())


class NewsDetailModelSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    views = serializers.SerializerMethodField()

    def get_views(self, obj):
        return 1

    class Meta:
        model = NewsModel
        fields = ["guid", "meta", "thumbnail", "title", "short_description", "description", "views", "category", "created_at"]


class NewsListModelSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    views = serializers.SerializerMethodField()

    def get_views(self, obj):
        return 1

    class Meta:
        model = NewsModel
        fields = ["guid", "meta", "thumbnail", "title", "short_description", "views", "category", "created_at"]
