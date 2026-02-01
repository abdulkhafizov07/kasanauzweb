from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from rest_framework import response, status, views, permissions
from rest_framework.pagination import LimitOffsetPagination

from apps.announcements_main.models import Announcement
from .filters import AnnouncementFilter
from .serializers import (
    AnnouncementFullContentSerializer,
    AnnouncementSerializer,
    CreateAnnouncementSerializer,
    FullLoadContentSerializer,
    LeastAnnouncementSerializer,
    SearchResultAnnouncementSerializer,
    AnnouncementDataSerializer,
)


# -------------------- PAGINATION --------------------

class AnnouncementLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "announcement_limit"
    offset_query_param = "announcement_offset"


# -------------------- HOME --------------------

class HomeDataContentApiView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self, announcement_type):
        return (
            Announcement.objects.filter(announcement_type=announcement_type)
            .select_related("user")
            .only(
                "guid", "user__guid", "user__pfp", "user__first_name", "user__last_name",
                "thumbnail", "title", "meta", "experience", "work_time",
                "price_min", "price_max", "dealed", "address",
                "short_description", "created_at",
            )
            .order_by("-created_at")[:6]
        )

    def get(self, request):
        service_announcements = self.get_queryset("service_announcement")
        work_announcements = self.get_queryset("work_announcement")

        serializer = FullLoadContentSerializer(
            {"service_announcement": service_announcements, "work_announcement": work_announcements}
        )
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class HomeAnnouncementsApiView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        type_map = {"work": "work_announcement", "service": "service_announcement"}
        db_type = type_map.get(request.GET.get("announcement_type"))

        queryset = Announcement.objects.all()
        if db_type:
            queryset = queryset.filter(announcement_type=db_type)

        serializer = AnnouncementSerializer(queryset, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


# -------------------- ANNOUNCEMENT DETAIL --------------------

class AnnouncementContentApiView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, meta):
        announcement = get_object_or_404(Announcement.objects.select_related("user"), meta=meta)
        related_announcements = (
            Announcement.objects.filter(announcement_type=announcement.announcement_type)
            .exclude(pk=announcement.pk)
            .only("guid", "title", "thumbnail", "meta")[:9]
        )

        serializer = AnnouncementFullContentSerializer(
            {"announcement": announcement, "announcements": related_announcements}
        )
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class MessageAnnouncementContentApiView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, guid):
        announcement = get_object_or_404(Announcement, guid=guid)
        serializer = LeastAnnouncementSerializer(announcement)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


# -------------------- CREATE ANNOUNCEMENT --------------------

class CreateAnnouncementApiView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def generate_unique_slug(self, title: str) -> str:
        base_slug = slugify(title)
        existing_slugs = set(
            Announcement.admin_objects.filter(meta__startswith=base_slug).values_list("meta", flat=True)
        )

        if base_slug not in existing_slugs:
            return base_slug

        counter = 1
        while True:
            candidate = f"{base_slug}-{counter}"
            if candidate not in existing_slugs:
                return candidate
            counter += 1

    def post(self, request):
        title = request.data.get("title", "").strip()
        if not title:
            return response.Response({"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()

        data.setdefault("price_min", 0)
        data.setdefault("price_max", 0)

        data["user"] = request.user.guid
        data["meta"] = self.generate_unique_slug(title)
        data["announcement_type"] = request.data.get("announcement_type", "service_announcement")

        serializer = CreateAnnouncementSerializer(data=data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return response.Response({"detail": "Announcement created"}, status=status.HTTP_201_CREATED)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------- USER ANNOUNCEMENTS --------------------

class BaseUserAnnouncementApiView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    announcement_relation: str

    def get(self, request):
        qs = Announcement.admin_objects.filter(user=request.user).select_related('user')
        serializer = AnnouncementSerializer(qs, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


class UserAnnouncementsApiView(BaseUserAnnouncementApiView):
    announcement_relation = "user_announcements_announcements"


class UserSavedAnnouncementsApiView(BaseUserAnnouncementApiView):
    announcement_relation = "user_saved_announcements"


class UserSaveAnnouncementApiView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        guid = request.data.get("guid")
        if not guid:
            return response.Response({"error": "GUID is required"}, status=status.HTTP_400_BAD_REQUEST)

        announcement = get_object_or_404(Announcement, guid=guid)

        if announcement.saved.filter(pk=request.user.pk).exists():
            announcement.saved.remove(request.user)
            saved = False
        else:
            announcement.saved.add(request.user)
            saved = True

        return response.Response({"saved": saved}, status=status.HTTP_200_OK)


# -------------------- WEB SEARCH --------------------

class WebsearchApiView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        filtered_qs = AnnouncementFilter(
            request.GET, queryset=Announcement.objects.select_related("user")
        ).qs

        paginator = AnnouncementLimitOffsetPagination()
        paginated_qs = paginator.paginate_queryset(filtered_qs, request, view=self)

        results = SearchResultAnnouncementSerializer(paginated_qs, many=True).data

        return response.Response(
            {
                "announcements": {
                    "count": paginator.count,
                    "next": paginator.get_next_link(),
                    "previous": paginator.get_previous_link(),
                    "results": results,
                }
            },
            status=status.HTTP_200_OK,
        )


# -------------------- ANNOUNCEMENT DATA (for microservice) --------------------

class AnnouncementDataView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, guid, *args, **kwargs):
        announcement = get_object_or_404(Announcement, guid=guid)
        serializer = AnnouncementDataSerializer(announcement)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
