from django.db.models import Count
from rest_framework import views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from apps.courses_main.models import Category, Course, Lesson
from apps.courses_main.serializers import CoursesStatisticsSerializer

from .serializers import AdminManageCategoryModelSerializer, AdminManageCourseReadSerializer, AdminManageCourseWriteSerializer
from .viewset import BaseAdminViewSet
from .permissions import HasPermission


class AdminCategoriesViewSet(BaseAdminViewSet):
    queryset = Category.admin_objects.all().order_by("-created_at")
    serializer_class = AdminManageCategoryModelSerializer

    permissions_map = {
        "list": ("courses", "read_categories"),
        "retrieve": ("courses", "read_categories"),
        "create": ("courses", "create_category"),
        "update": ("courses", "update_category"),
        "partial_update": ("courses", "partial_update_category"),
        "destroy": ("courses", "delete_category"),
        "bulk_delete": ("courses", "bulk_delete_category"),
        "change_state": ("courses", "change_category_state"),
    }


class AdminCourseViewSet(BaseAdminViewSet):
    queryset = (
        Course.admin_objects.all()
        .select_related("category", "author")
        .prefetch_related("course_lessons_courses")
        .order_by("-created_at")
    )
    serializer_class = AdminManageCourseReadSerializer
    parser_classes = [MultiPartParser, FormParser]

    permissions_map = {
        "list": ("courses", "read_courses"),
        "retrieve": ("courses", "read_courses"),
        "create": ("courses", "create_course"),
        "update": ("courses", "update_course"),
        "partial_update": ("courses", "partial_update_course"),
        "destroy": ("courses", "delete_course"),
        "bulk_delete": ("courses", "bulk_delete_course"),
        "change_state": ("courses", "change_course_state"),
    }

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return AdminManageCourseWriteSerializer
        return AdminManageCourseReadSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CoursesStatisticsView(views.APIView):
    permission_classes = [HasPermission]

    def post(self, request, *args, **kwargs):
        total_courses = Course.objects.count()
        total_lessons = Lesson.objects.count()

        category_qs = (
            Course.objects.values("category__title")
            .annotate(count=Count("guid"))
            .order_by()
        )
        courses_by_category = {row["category__title"]: row["count"] for row in category_qs}

        data = {
            "total_courses": total_courses,
            "total_lessons": total_lessons,
            "courses_by_category": courses_by_category,
        }
        serializer = CoursesStatisticsSerializer(data)
        return Response(serializer.data)
