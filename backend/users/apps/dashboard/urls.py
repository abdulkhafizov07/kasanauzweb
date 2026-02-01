from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminUsersViewSet, UserStatisticsView

app_name = "dashboard"


router = DefaultRouter()
router.register(r"users", AdminUsersViewSet, basename="admin-users")

urlpatterns = [
    path("", include(router.urls), name="uAdmin123"),
    path("statistics", UserStatisticsView.as_view(), name="statistics")
]
