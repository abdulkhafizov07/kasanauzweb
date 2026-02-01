from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response

from .models import DocumentsModel, NewsModel, Category
from .serializers import DocumentsReadOnlySerializer, NewsHomeSerializer, NewsDetailModelSerializer, CategorySerializer, NewsListModelSerializer


class KasanaUzHomePageDataApiView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        legacy_qs = DocumentsModel.objects.filter(doc_type="legacy_documents").order_by("-created_at")[:4]

        business_qs = DocumentsModel.objects.filter(doc_type="business_documents").order_by("-created_at")[:4]

        legacy_data = DocumentsReadOnlySerializer(legacy_qs, many=True).data
        business_data = DocumentsReadOnlySerializer(business_qs, many=True).data

        return Response(
            {
                "legacy_documents": legacy_data,
                "business_documents": business_data,
            }
        )


class NewsHomeViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = NewsModel.objects.all().order_by("-created_at")[:5]
        serializer = NewsHomeSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)


class NewsWeeklyViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = NewsHomeSerializer

    def get_queryset(self):
        return NewsModel.objects.all().order_by("-created_at")


class DocumentsHomeAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        legacy = DocumentsModel.objects.filter(doc_type="legacy_documents").order_by("-created_at")[:5]
        business = DocumentsModel.objects.filter(doc_type="business_documents").order_by("-created_at")[:5]

        return Response({
            "legacyDocuments": DocumentsReadOnlySerializer(legacy, many=True).data,
            "bussiniesDocuments": DocumentsReadOnlySerializer(business, many=True).data,
        })


class NewsDetailsAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def get(self, request, meta: str):
        news = NewsModel.objects.get(meta=meta)
        serializer = NewsDetailModelSerializer(news)

        return Response(serializer.data)


class CategoriesAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    permission_classes = [AllowAny]
    lookup_field = "meta"

    @action(detail=True, methods=["get"], url_path="news")
    def news(self, request, meta=None):
        category = self.get_object()
        news = NewsModel.objects.filter(category=category).order_by("-created_at")

        page = self.paginate_queryset(news)
        if page is not None:
            serializer = NewsListModelSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = NewsListModelSerializer(news, many=True, context={"request": request})
        return Response(serializer.data)
