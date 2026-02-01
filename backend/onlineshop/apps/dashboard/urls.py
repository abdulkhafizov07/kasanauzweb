from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminCategoriesViewSet, AdminProductsViewSet, OnlineShopStatisticsView

app_name = "dashboard"


router = DefaultRouter()
router.register(r"categories", AdminCategoriesViewSet, basename="admin-categories")
router.register(r"products", AdminProductsViewSet, basename="admin-products")

urlpatterns = [
    path("", include(router.urls), name="uAdmin123"),
    path("statistics", OnlineShopStatisticsView.as_view(), name="statistics")
]
