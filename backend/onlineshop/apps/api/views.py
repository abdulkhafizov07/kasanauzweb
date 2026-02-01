import uuid
import random

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.utils.text import slugify
from django.views.decorators.cache import cache_page

from rest_framework import generics, pagination, response, views, status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request

from apps.onlineshop_main.models import (
    Category,
    Product,
    ProductImage,
    ProductLike,
    ProductComment,
)

from .filters import CategoryFilter, ProductFilter
from .serializers import (
    CategorySerializer,
    CategoryListProductSerializer,
    ProductSerializer,
    FullProductSerializer,
    LeastProductSerializer,
    UserProductSerializer,
    RootCommentSerializer,
    SearchResultSerializer,
    CreateProductSerializer,
    ProductDataSerializer,
)


# ----------------- Pagination -----------------

class CategoryLimitOffsetPagination(pagination.LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "category_limit"
    offset_query_param = "category_offset"


class ProductLimitOffsetPagination(pagination.LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "product_limit"
    offset_query_param = "product_offset"


class CustomPageNumberPagination(pagination.PageNumberPagination):
    def get_page_number(self, request, paginator):
        return request.data.get("page_number", 1)

    def get_page_size(self, request):
        return 50


class ProductsPageNumberPagination(pagination.PageNumberPagination):
    page_size = 8
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 16

    def get_paginated_response(self, data):
        return response.Response(
            {
                "results": data,
                "page": self.page.number,
                "limit": self.get_page_size(self.request),
                "total": self.page.paginator.count,
            }
        )


# ----------------- Categories -----------------

class CategoriesApiView(ListAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class CategoryContentApiView(ListAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = CategoryListProductSerializer

    def get_queryset(self):
        category_meta = self.kwargs.get("category")
        category = get_object_or_404(Category, meta=category_meta)
        return category.onlineshop_app_category_products.all()


# ----------------- Products -----------------

class TopProductsApiView(ListAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = ProductSerializer
    queryset = Product.objects.order_by("?")
    pagination_class = ProductsPageNumberPagination


class ProductContentApiView(views.APIView):
    permission_classes = []

    def get(self, request, meta):
        try:
            product = (
                Product.admin_objects.get(meta=meta)
                if request.user.is_authenticated and request.user.role in ["superadmin", "admin", "moderator"]
                else Product.objects.get(meta=meta)
            )
        except Product.DoesNotExist:
            return response.Response({"message": "Product not found"}, status=404)

        related_products = product.category.onlineshop_app_category_products.all()[:4]
        serializer = FullProductSerializer({"product": product, "related": related_products})
        return response.Response(serializer.data)


class MessageProductContentApiView(views.APIView):
    permission_classes = []

    @method_decorator(cache_page(60 * 60 * 24 * 30))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request, guid):
        product = Product.objects.filter(guid=guid).first()
        if not product:
            return response.Response({"message": "Product not found"}, status=404)
        serializer = LeastProductSerializer(product)
        return response.Response(serializer.data)


class UserProductsApiView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.admin_objects.filter(user=request.user).prefetch_related(
            "onlineshop_app_product_images", "category"
        )
        serializer = UserProductSerializer(products, many=True)
        return response.Response(serializer.data)


class UserLikedProductsApiView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        liked_products = Product.objects.filter(
            onlineshop_app_product_likes__user=request.user
        ).prefetch_related("onlineshop_app_product_images", "category")

        serializer = ProductSerializer(liked_products, many=True)
        return response.Response(serializer.data)


class UserUploadProductApiView(views.APIView):
    permission_classes = [IsAuthenticated]

    def generate_unique_slug(self, title):
        base_slug = slugify(title)
        slug = base_slug
        while Product.admin_objects.filter(meta=slug).exists():
            slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
        return slug

    def post(self, request: Request):
        data = request.data.dict()
        data["user"] = request.user.guid

        title = data.get("title")
        if not title:
            return response.Response({"error": "Title is required"}, status=400)

        data["meta"] = self.generate_unique_slug(title)
        serializer = CreateProductSerializer(data=data)

        if serializer.is_valid():
            try:
                with transaction.atomic():
                    product = serializer.save(user=request.user)
                    images = request.FILES.getlist("images_upload")
                    for img in images:
                        ProductImage.objects.create(product=product, image=img)

                    request.user.is_kasanachi = True
                    request.user.save()

                    return response.Response(
                        {"message": "Product created successfully", "product_meta": product.meta, "images": len(images)},
                        status=201,
                    )
            except Exception as e:
                return response.Response({"error": str(e)}, status=400)
        return response.Response(serializer.errors, status=400)


class UserLikeProductApiView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "guid" not in request.data.keys():
            return {"details": "guid is missing"}
        product = Product.objects.filter(guid=request.data.get("guid")).first()
        if not product:
            return response.Response({"message": "Product not found"}, status=404)

        like, created = ProductLike.objects.get_or_create(user=request.user, product=product)
        if created:
            return response.Response({"liked": True})
        like.delete()
        return response.Response({"liked": False})


class UserIsProductLikedApiView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "guid" not in request.data.keys():
            return response.Response({"details": "guid is missing"})
        return response.Response({
            "isProductLiked": ProductLike.objects.filter(
                user=request.user,
                product__guid=request.data.get("guid")
            ).exists()
        })


# ----------------- Comments -----------------

class ProductCommentListAPIView(generics.ListAPIView):
    serializer_class = RootCommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            ProductComment.objects.filter(product__guid=self.kwargs["guid"], reply__isnull=True)
            .select_related("user")
            .prefetch_related("onlineshop_app_comment_replies")
        )


class ProductCommentCreateAPIView(generics.CreateAPIView):
    serializer_class = RootCommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product_guid = request.data.get("product")
        text = request.data.get("text")

        if not text or not product_guid:
            return response.Response({"detail": "Missing fields"}, status=400)

        product = Product.objects.filter(guid=product_guid).first()
        if not product:
            return response.Response({"detail": "Product not found"}, status=404)

        comment = ProductComment.objects.create(product=product, user=request.user, comment=text)
        return response.Response(self.get_serializer(comment).data, status=201)


class ProductCommentReplyAPIView(generics.CreateAPIView):
    serializer_class = RootCommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        parent = ProductComment.objects.filter(guid=request.data.get("comment")).first()
        if not parent:
            return response.Response({"detail": "Parent comment not found"}, status=404)

        reply = ProductComment.objects.create(
            product=parent.product, user=request.user, reply=parent, comment=request.data.get("text")
        )
        return response.Response(self.get_serializer(reply).data, status=201)


# ----------------- Search -----------------

class WebsearchApiView(views.APIView):
    permission_classes = []

    def get(self, request):
        category_qs = CategoryFilter(request.GET, queryset=Category.objects.all()).qs
        product_qs = ProductFilter(
            request.GET, queryset=Product.objects.select_related("category").prefetch_related("onlineshop_app_product_images")
        ).qs

        cat_pag = CategoryLimitOffsetPagination()
        prod_pag = ProductLimitOffsetPagination()

        categories = cat_pag.paginate_queryset(category_qs, request, view=self)
        products = prod_pag.paginate_queryset(product_qs, request, view=self)

        return response.Response(
            {
                "categories": {
                    "count": cat_pag.count,
                    "next": cat_pag.get_next_link(),
                    "previous": cat_pag.get_previous_link(),
                    "results": SearchResultSerializer(categories, many=True).data,
                },
                "products": {
                    "count": prod_pag.count,
                    "next": prod_pag.get_next_link(),
                    "previous": prod_pag.get_previous_link(),
                    "results": SearchResultSerializer(products, many=True).data,
                },
            }
        )


# ----------------- Microservice Endpoint -----------------

class ProductDataView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, guid, *args, **kwargs):
        product = get_object_or_404(
            Product.objects.select_related("user", "category").only(
                "guid", "title", "user__guid", "category__guid",
                "short_description", "price", "price_discount"
            ),
            guid=guid
        )
        serializer = ProductDataSerializer(product)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class FilterApiView(ListAPIView):
    permission_classes = []
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related("category")

        categories_param = self.request.GET.get("categories")

        if categories_param:
            category_metas = [
                meta.strip()
                for meta in categories_param.split(",")
                if meta.strip()
            ]
            queryset = queryset.filter(category__meta__in=category_metas)

        return queryset
