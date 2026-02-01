from datetime import timedelta

from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import response, status, views
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination

from apps.news_main.models import Category, DocumentsModel, NewsModel
from apps.tracking.models import CustomHitCount

from .filters import NewsCategoryFilter, NewsModelFilter
from .serializers import *

# Create your views here.


class CustomPageNumberPagination(PageNumberPagination):
    def get_page_number(self, request, paginator):
        return request.data.get("page_number", 1)


class HomeDataContentApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.all()

        news = list(NewsModel.objects.select_related("user", "category").order_by("-created_at")[:16])

        one_week_ago = timezone.now() - timedelta(days=7)
        week_news = [item for item in news if item.created_at >= one_week_ago]

        if len(week_news) < 8:
            extra_needed = 8 - len(week_news)
            recent_fallback = [n for n in news if n not in week_news][:extra_needed]
            week_news.extend(recent_fallback)

        week_sorted = sorted(week_news, key=lambda x: x.hit_count.hits if hasattr(x, "hit_count") else 0, reverse=True)

        serializer = FullLoadContentSerializer(
            {
                "categories": categories,
                "banner": news[:5],
                "week": week_sorted[:8],
            }
        )

        return response.Response(serializer.data, status=status.HTTP_200_OK)


class CategoryContentApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, meta):
        if meta != "all":
            try:
                category = Category.objects.get(meta=meta)
            except Category.DoesNotExist:
                return response.Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

            news_list = NewsModel.objects.filter(category=category)
        else:
            news_list = NewsModel.objects.all()

        paginator = CustomPageNumberPagination()
        paginator.page_size = 16
        paginated_queryset = paginator.paginate_queryset(list(news_list), request)
        serializer = NewsListSerializer(paginated_queryset, many=True)

        return paginator.get_paginated_response(serializer.data)


class CategoriesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class NewsDetailApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, meta):
        try:
            news = NewsModel.objects.get(meta=meta)
            self.count_hit(request, news)
        except NewsModel.DoesNotExist:
            return response.Response({"message": "News not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = NewsDetailSerializer(news)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    def count_hit(self, request, obj):
        content_type = ContentType.objects.get_for_model(obj)
        hit_count, _ = CustomHitCount.objects.get_or_create(content_type=content_type, object_pk=obj.pk)

        ip = self.get_client_ip(request)
        if not hit_count.hit_set.filter(ip=ip).exists():
            hit_count.increase()
            hit_count.hit_set.create(ip=ip)
            hit_count.save()

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR")


class LoadDocumentsApiView(views.APIView):
    def get(self, request, type):
        return response.Response(DocumentsSerializer(DocumentsModel.objects.filter(doc_type=type)).data)


class CategoryLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 5
    limit_query_param = "category_limit"
    offset_query_param = "category_offset"


class NewsLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "news_limit"
    offset_query_param = "news_offset"


class DocumentLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "doc_limit"
    offset_query_param = "doc_offset"


class WebsearchApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        q = request.GET.get("q", "")

        category_qs = NewsCategoryFilter(request.GET, queryset=Category.objects.all()).qs
        category_paginator = CategoryLimitOffsetPagination()
        paginated_categories = category_paginator.paginate_queryset(category_qs, request, view=self)
        serialized_categories = SearchResultSerializer(paginated_categories, many=True).data

        news_qs = NewsModelFilter(request.GET, queryset=NewsModel.objects.select_related("category", "user")).qs
        news_paginator = NewsLimitOffsetPagination()
        paginated_news = news_paginator.paginate_queryset(news_qs, request, view=self)
        serialized_news = SearchResultSerializer(paginated_news, many=True).data

        doc_qs = DocumentsModel.objects.all()
        if q:
            doc_qs = doc_qs.filter(title__icontains=q)
        doc_paginator = DocumentLimitOffsetPagination()
        paginated_docs = doc_paginator.paginate_queryset(doc_qs, request, view=self)
        serialized_docs = SearchResultSerializer(paginated_docs, many=True).data

        return response.Response(
            {
                "categories": {
                    "count": category_paginator.count,
                    "next": category_paginator.get_next_link(),
                    "previous": category_paginator.get_previous_link(),
                    "results": serialized_categories,
                },
                "news": {
                    "count": news_paginator.count,
                    "next": news_paginator.get_next_link(),
                    "previous": news_paginator.get_previous_link(),
                    "results": serialized_news,
                },
                "documents": {
                    "count": doc_paginator.count,
                    "next": doc_paginator.get_next_link(),
                    "previous": doc_paginator.get_previous_link(),
                    "results": serialized_docs,
                },
            }
        )
