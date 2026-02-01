from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminCategoriesViewSet, AdminDocumentsViewSet, AdminNewsViewSet, NewsStatisticsView

app_name = "dashboard"


router = DefaultRouter()
router.register(r"categories", AdminCategoriesViewSet, basename="admin-categories")
router.register(r"news", AdminNewsViewSet, basename="admin-news")
router.register(r"documents", AdminDocumentsViewSet, basename="admin-documents")


urlpatterns = [
    path("", include(router.urls), name="uAdmin123"),
    path("statistics", NewsStatisticsView.as_view(), name="statistics")
]
