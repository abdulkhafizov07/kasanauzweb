from rest_framework.serializers import ModelSerializer, ValidationError, UUIDField

from apps.news_main.models import Category, DocumentsModel, NewsModel
from apps.users.models import UserModel


class AdminManageCategoriesModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta", "state", "created_at"]
        read_only_fields = ["guid", "created_at"]


class _AdminManageNewsCategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]
        read_only_fields = fields


class _AdminManageUsersCategoryModelSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "first_name", "last_name"]
        read_only_fields = fields


class AdminManageNewsModelSerializer(ModelSerializer):
    category = _AdminManageNewsCategoryModelSerializer(read_only=True)
    user = _AdminManageUsersCategoryModelSerializer(read_only=True)

    category_id = UUIDField(write_only=True)
    user_id = UUIDField(write_only=True)

    class Meta:
        model = NewsModel
        fields = ["guid", "category", "user", "category_id", "user_id", "thumbnail", "title", "meta", "short_description", "state", "created_at"]
        read_only_fields = ["guid", "category", "user", "created_at"]


class AdminManageDocumentsModelSerializer(ModelSerializer):
    class Meta:
        model = DocumentsModel
        fields = [
            "guid",
            "doc_type",
            "title",
            "subtitle",
            "meta",
            "link",
            "file",
            "state",
            "created_at",
        ]
        read_only_fields = ["guid", "created_at"]

    def validate(self, attrs):
        doc_type = attrs.get("doc_type") or getattr(self.instance, "doc_type", None)

        if doc_type == "legacy_documents" and not attrs.get("link"):
            raise ValidationError({"link": "Legacy documents must include a link."})

        if doc_type == "business_documents" and not attrs.get("file"):
            raise ValidationError({"file": "Business documents must include a file upload."})

        return attrs
