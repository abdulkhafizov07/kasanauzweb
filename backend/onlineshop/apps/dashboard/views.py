from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, views

from apps.onlineshop_main.models import Category, Product, ProductSellDocument
from apps.onlineshop_main.serializers import OnlineShopStatisticsSerializer

from .serializers import AdminManageCategoriesModelSerializer, AdminManageProductsModelSerializer
from .viewset import BaseAdminViewSet
from .permissions import HasPermission


class AdminCategoriesViewSet(BaseAdminViewSet):
    queryset = Category.admin_objects.all().order_by("-created_at")
    serializer_class = AdminManageCategoriesModelSerializer

    permissions_map = {
        "list": ("onlineshop", "read_categories"),
        "retrieve": ("onlineshop", "read_categories"),
        "create": ("onlineshop", "create_category"),
        "update": ("onlineshop", "update_category"),
        "partial_update": ("onlineshop", "write_categories"),
        "destroy": ("onlineshop", "delete_category"),
        "bulk_delete": ("onlineshop", "bulk_delete_category"),
        "change_state": ("onlineshop", "write_categories"),
        "all_categories": ("onlineshop", "read_categories"),
    }

    @action(detail=False, methods=["get"], url_path="all", url_name="all-categories")
    def all_categories(self, request):
        self.pagination_class = None
        queryset = Category.admin_objects.all().order_by("-created_at")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminProductsViewSet(BaseAdminViewSet):
    queryset = (
        Product.admin_objects.all()
        .select_related("user", "category")
        .prefetch_related("onlineshop_app_product_images")
        .order_by("-created_at")
    )
    serializer_class = AdminManageProductsModelSerializer

    permissions_map = {
        "list": ("onlineshop", "read_products"),
        "retrieve": ("onlineshop", "read_products"),
        "create": ("onlineshop", "create_product"),
        "update": ("onlineshop", "update_product"),
        "partial_update": ("onlineshop", "write_products"),
        "destroy": ("onlineshop", "delete_product"),
        "bulk_delete": ("onlineshop", "bulk_delete_product"),
        "change_state": ("onlineshop", "write_products"),
    }

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        user_phone = data.pop("user", None)
        if user_phone:
            User = get_user_model()
            try:
                user = User.objects.get(phone=user_phone)
                data["user"] = user
            except User.DoesNotExist:
                return Response(
                    {"user": f"No user with phone {user_phone}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        category_uuid = data.get("category")
        if category_uuid:
            try:
                category = Category.objects.get(guid=category_uuid)
                data["category"] = category
            except Category.DoesNotExist:
                return Response(
                    {"category": f"No category with UUID {category_uuid}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OnlineShopStatisticsView(views.APIView):
    permission_classes = [HasPermission]

    def post(self, request, *args, **kwargs):
        total_products = Product.objects.count()
        total_sold = ProductSellDocument.objects.count()

        category_qs = (
            Product.objects.values("category__title")
            .annotate(count=Count("guid"))
            .order_by()
        )
        category_stats = {row["category__title"]: row["count"] for row in category_qs}

        visible_products = Product.objects.filter(is_active=True).count()
        invisible_products = Product.objects.filter(is_active=False).count()

        unverified_count = Product.objects.filter(meta="unverified").count() if hasattr(Product, "meta") else 0
        banned_products = Product.objects.filter(meta="banned").count() if hasattr(Product, "meta") else 0

        data = {
            "total_products": total_products,
            "total_sold": total_sold,
            "category_stats": category_stats,
            "unverified_count": unverified_count,
            "visible_products": visible_products,
            "invisible_products": invisible_products,
            "banned_products": banned_products,
        }
        serializer = OnlineShopStatisticsSerializer(data)
        return Response(serializer.data)
