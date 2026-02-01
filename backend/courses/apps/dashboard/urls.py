from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminCategoriesViewSet, AdminCourseViewSet, CoursesStatisticsView

app_name = "dashboard"


router = DefaultRouter()
router.register(r"categories", AdminCategoriesViewSet, basename="admin-categories")
router.register(r"courses", AdminCourseViewSet, basename="admin-courses")

urlpatterns = [
    path("", include(router.urls), name="uAdmin123"),
    path("statistics", CoursesStatisticsView.as_view(), name="statistics")
]
