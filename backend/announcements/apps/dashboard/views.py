from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.announcements_main.models import Announcement
from apps.announcements_main.serializers import AnnouncementStatisticsSerializer

from .serializers import AdminManageAnnouncementModelSerializer
from .viewset import BaseAdminViewSet
from .permissions import HasPermission


class AdminAnnouncementsViewSet(BaseAdminViewSet):
    def get_queryset(self):
        announcement_type = self.request.GET.get('announcement_type')
        if announcement_type:
            return Announcement.admin_objects.filter(announcement_type=announcement_type)
        return Announcement.admin_objects.all()

    serializer_class = AdminManageAnnouncementModelSerializer

    permissions_map = {
        "list": ("announcements", "read_announcements"),
        "retrieve": ("announcements", "read_announcements"),
        "create": ("announcements", "create_announcement"),
        "update": ("announcements", "update_announcement"),
        "partial_update": ("announcements", "partial_update_announcement"),
        "destroy": ("announcements", "delete_announcement"),
        "bulk_delete": ("announcements", "bulk_delete_announcement"),
        "change_state": ("announcements", "change_announcement_state"),
    }



class AnnouncementStatisticsView(APIView):
    permission_classes = [HasPermission]

    def post(self, request, *args, **kwargs):
        total_announcements = Announcement.objects.count()
        total_views = sum(
            ann.hit_count_generic.count() for ann in Announcement.objects.all()
        )

        type_qs = (
            Announcement.objects.values("announcement_type")
            .annotate(count=Count("guid"))
            .order_by()
        )
        announcements_by_type = {row["announcement_type"]: row["count"] for row in type_qs}

        region_qs = (
            Announcement.objects.values("region")
            .annotate(count=Count("guid"))
            .order_by()
        )
        announcements_by_region = {
            row["region"] or "Unknown": row["count"] for row in region_qs
        }

        data = {
            "total_announcements": total_announcements,
            "total_views": total_views,
            "announcements_by_type": announcements_by_type,
            "announcements_by_region": announcements_by_region,
        }

        serializer = AnnouncementStatisticsSerializer(data)
        return Response(serializer.data)
