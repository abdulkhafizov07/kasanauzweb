from datetime import timedelta

from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import pagination, response, status, views
from rest_framework.pagination import LimitOffsetPagination

from apps.courses_main.models import Category, Course, Lesson
from apps.tracking.models import CustomHitCount

from .filters import CategoryFilter, CourseFilter
from .serializers import (
    CourseDetailSerializer,
    CoursesListSerializer,
    FullLoadContentSerializer,
    LessonDetailSerializer,
    SearchResultSerializer,
)


# -------------------- PAGINATION --------------------
class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 8

    def get_page_number(self, request, paginator):
        page = request.query_params.get("page", 1)
        try:
            return int(page)
        except (ValueError, TypeError):
            return 1


class CategoryLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "category_limit"
    offset_query_param = "category_offset"


class CourseLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "course_limit"
    offset_query_param = "course_offset"


# -------------------- HOME --------------------
class HomeDataContentApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.values("guid", "title", "meta").all()

        top_courses = Course.objects.select_related("category").order_by("-hits")[:4]
        new_courses = Course.objects.select_related("category").order_by("-created_at")[:4]

        yesterday = timezone.now() - timedelta(days=1)
        offered_courses = (
            Course.objects.select_related("category")
            .filter(created_at__lte=yesterday)
            .order_by("-created_at")[:4]
        )

        serializer = FullLoadContentSerializer(
            {
                "categories": categories,
                "top": top_courses,
                "new": new_courses,
                "offered": offered_courses,
            }
        )
        return response.Response(serializer.data, status=status.HTTP_200_OK)


# -------------------- CATEGORIES --------------------
class CategoriesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        categories = Category.objects.values("guid", "title", "meta").all()
        return response.Response(list(categories), status=status.HTTP_200_OK)


# -------------------- CATEGORY CONTENT --------------------
class CategoryContentApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, meta):
        try:
            if meta != "all":
                category = Category.objects.get(meta=meta)
                queryset = Course.objects.select_related("category").filter(category=category)
            else:
                queryset = Course.objects.select_related("category").all()
        except Category.DoesNotExist:
            return response.Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        paginator = CustomPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = CoursesListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


# -------------------- COURSE DETAIL --------------------
class CourseDetailApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, meta):
        try:
            course = Course.objects.select_related("category").get(meta=meta)
        except Course.DoesNotExist:
            return response.Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        self.count_hit(request, course)
        serializer = CourseDetailSerializer(course)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    def count_hit(self, request, obj):
        ip = self.get_client_ip(request)
        content_type = ContentType.objects.get_for_model(obj.__class__)
        with transaction.atomic():
            hit_count, _ = CustomHitCount.objects.get_or_create(
                content_type=content_type, object_pk=obj.pk
            )
            if not hit_count.hit_set.filter(ip=ip).exists():
                hit_count.increase()
                hit_count.hit_set.create(ip=ip)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


# -------------------- LESSON DETAIL --------------------
class LessonDetailApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, guid):
        try:
            lesson = Lesson.objects.select_related("course", "course__category").get(guid=guid)
        except Lesson.DoesNotExist:
            return response.Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = LessonDetailSerializer(lesson)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


# -------------------- USER INTERACTIONS --------------------
class UserLikedCoursesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        if not request.user.is_authenticated:
            return response.Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        liked_courses = request.user.user_liked_courses.select_related("author", "category")
        paginator = CustomPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(liked_courses, request)
        serializer = CoursesListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserLikeCourseApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        if not request.user.is_authenticated:
            return response.Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        guid = request.data.get("guid")
        if not guid:
            return response.Response({"error": "GUID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(guid=guid)
        except Course.DoesNotExist:
            return response.Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        liked = False
        with transaction.atomic():
            if course.liked.filter(pk=request.user.pk).exists():
                course.liked.remove(request.user)
            else:
                course.liked.add(request.user)
                liked = True

        return response.Response({"liked": liked})


class UserSubedCoursesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        if not request.user.is_authenticated:
            return response.Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        subed_courses = request.user.user_subed_courses.select_related("author", "category")
        paginator = CustomPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(subed_courses, request)
        serializer = CoursesListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserSubCourseApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        if not request.user.is_authenticated:
            return response.Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        guid = request.data.get("guid")
        if not guid:
            return response.Response({"error": "GUID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(guid=guid)
        except Course.DoesNotExist:
            return response.Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        subed = False
        with transaction.atomic():
            if course.subscribed.filter(pk=request.user.pk).exists():
                course.subscribed.remove(request.user)
            else:
                course.subscribed.add(request.user)
                subed = True

        return response.Response({"subed": subed})


# -------------------- SEARCH --------------------
class WebsearchApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        # Categories
        category_qs = CategoryFilter(request.GET, queryset=Category.objects.all()).qs.order_by("created_at")
        category_paginator = CategoryLimitOffsetPagination()
        paginated_categories = category_paginator.paginate_queryset(category_qs, request, view=self)
        categories_serialized = SearchResultSerializer(paginated_categories, many=True).data

        # Courses
        course_qs = CourseFilter(request.GET, queryset=Course.objects.select_related("category")).qs
        course_paginator = CourseLimitOffsetPagination()
        paginated_courses = course_paginator.paginate_queryset(course_qs, request, view=self)
        courses_serialized = CoursesListSerializer(paginated_courses, many=True).data

        return response.Response(
            {
                "categories": {
                    "count": category_paginator.count,
                    "next": category_paginator.get_next_link(),
                    "previous": category_paginator.get_previous_link(),
                    "results": categories_serialized,
                },
                "courses": {
                    "count": course_paginator.count,
                    "next": course_paginator.get_next_link(),
                    "previous": course_paginator.get_previous_link(),
                    "results": courses_serialized,
                },
            },
            status=status.HTTP_200_OK,
        )


# -------------------- TOP COURSES --------------------
@method_decorator(cache_page(60 * 15), name='dispatch')
class TopCoursesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        queryset = Course.objects.select_related("category").order_by('-created_at')
        paginator = CustomPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = CoursesListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


# -------------------- NEW COURSES --------------------
class NewCoursesApiView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        queryset = Course.objects.select_related("category").order_by("-created_at")
        paginator = CustomPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = CoursesListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
