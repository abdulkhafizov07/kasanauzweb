from apps.news_main.models import Category, DocumentsModel, NewsModel
from apps.news_main.serializers import NewsStatisticsSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, views
from django.db.models import Count

from .serializers import (
    AdminManageCategoriesModelSerializer,
    AdminManageDocumentsModelSerializer,
    AdminManageNewsModelSerializer,
)
from .viewset import BaseAdminViewSet
from .permissions import HasPermission


class AdminCategoriesViewSet(BaseAdminViewSet):
    queryset = Category.admin_objects.all().order_by("-created_at")
    serializer_class = AdminManageCategoriesModelSerializer

    permissions_map = {
        "retrieve": ("news", "read_categories"),
        "create": ("news", "create_category"),
        "update": ("news", "update_category"),
        "partial_update": ("news", "partial_update_category"),
        "destroy": ("news", "delete_category"),
        "bulk_delete": ("news", "bulk_delete_category"),
        "change_state": ("news", "change_category_state"),
    }

    @action(detail=False, methods=["get"], url_path="all", url_name="all-categories")
    def all_categories(self, request):
        self.pagination_class = None
        queryset = Category.admin_objects.all().order_by("-created_at")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminNewsViewSet(BaseAdminViewSet):
    queryset = NewsModel.admin_objects.all().select_related("user", "category").order_by("-created_at")
    serializer_class = AdminManageNewsModelSerializer

    permissions_map = {
        "list": ("news", "read_news"),
        "retrieve": ("news", "read_news"),
        "create": ("news", "create_news"),
        "update": ("news", "update_news"),
        "partial_update": ("news", "write_news"),
        "destroy": ("news", "delete_news"),
        "bulk_delete": ("news", "delete_news"),
        "change_state": ("news", "write_news"),
    }

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["user_id"] = request.user.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AdminDocumentsViewSet(BaseAdminViewSet):
    queryset = DocumentsModel.admin_objects.all().order_by("-created_at")
    serializer_class = AdminManageDocumentsModelSerializer

    permissions_map = {
        "list": ("news", "read_documents"),
        "retrieve": ("news", "read_documents"),
        "create": ("news", "create_document"),
        "update": ("news", "update_document"),
        "partial_update": ("news", "partial_update_document"),
        "destroy": ("news", "delete_document"),
        "bulk_delete": ("news", "bulk_delete_document"),
        "change_state": ("news", "change_document_state"),
    }


class NewsStatisticsView(views.APIView):
    permission_classes = [HasPermission]

    def post(self, request, *args, **kwargs):
        total_news = NewsModel.objects.count()
        total_documents = DocumentsModel.objects.count()
        total_news_views = sum(n.hit_count_generic.count() for n in NewsModel.objects.all())
        news_by_category_qs = (
            NewsModel.objects.values("category__title")
            .annotate(count=Count("guid"))
            .order_by()
        )
        news_by_category = {row["category__title"]: row["count"] for row in news_by_category_qs}
        docs_by_type_qs = (
            DocumentsModel.objects.values("doc_type")
            .annotate(count=Count("guid"))
            .order_by()
        )
        documents_by_type = {row["doc_type"]: row["count"] for row in docs_by_type_qs}

        data = {
            "total_news": total_news,
            "total_news_views": total_news_views,
            "total_documents": total_documents,
            "news_by_category": news_by_category,
            "documents_by_type": documents_by_type,
        }

        serializer = NewsStatisticsSerializer(data)
        return Response(serializer.data)
