from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminAnnouncementsViewSet, AnnouncementStatisticsView

app_name = "dashboard"


router = DefaultRouter()
router.register(r"announcements", AdminAnnouncementsViewSet, basename="admin-categories")

urlpatterns = [
    path("", include(router.urls), name="uAdmin123"),
    path("statistics", AnnouncementStatisticsView.as_view(), name="statistics")
]
