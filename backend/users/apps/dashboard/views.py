from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
from apps.users.models import UserModel
from .serializers import UserModelDataSerializer
from .viewset import BaseAdminViewSet
from .permissions import HasPermission

class AdminUsersViewSet(BaseAdminViewSet):
    def get_queryset(self):
        role = self.request.GET.get('role')
        if role:
            return UserModel.objects.filter(role=role)
        return UserModel.objects.all()

    serializer_class = UserModelDataSerializer

    permissions_map = {
        "retrieve": ("users", "read_users"),
        "create": ("users", "create_user"),
        "update": ("users", "update_user"),
        "partial_update": ("users", "partial_update_user"),
        "destroy": ("users", "delete_user"),
        "bulk_delete": ("users", "bulk_delete_user"),
        "change_state": ("users", "change_user_state"),
    }


class UserStatisticsView(APIView):
    permission_classes = [HasPermission]

    def get(self, request, *args, **kwargs):
        today = date.today()

        all_users_count = UserModel.objects.count()
        
        def born_between(min_age=None, max_age=None):
            q = Q()
            if min_age is not None:
                q &= Q(birthday__lte=today.replace(year=today.year - min_age))
            if max_age is not None:
                q &= Q(birthday__gt=today.replace(year=today.year - max_age))
            return q

        age_groups = {
            "under_18": UserModel.objects.filter(born_between(max_age=18)).count(),
            "18_25": UserModel.objects.filter(born_between(min_age=18, max_age=25)).count(),
            "25_35": UserModel.objects.filter(born_between(min_age=25, max_age=35)).count(),
            "35_50": UserModel.objects.filter(born_between(min_age=35, max_age=50)).count(),
            "over_50": UserModel.objects.filter(born_between(min_age=50)).count(),
        }

        by_purposes = {}
        
        for row in UserModel.objects.values("purposes", "gender").annotate(count=Count("guid")):
            purpose = row["purposes"]
            gender = "male" if row["gender"] == '0' else "female"
            count = row["count"]

            if purpose not in by_purposes:
                by_purposes[purpose] = {"male": 0, "female": 0}

            by_purposes[purpose][gender] = count

        by_regions = {}

        for row in UserModel.objects.values("region", "gender").annotate(count=Count("guid")):
            region = row["region"]
            gender = "male" if row["gender"] == '0' else "female"
            count = row["count"]

            if region not in by_regions:
                by_purposes[region] = {"male": 0, "female": 0}

            by_purposes[region][gender] = count

        data = {
            'all_count': all_users_count,
            'age_groups_count': age_groups,
            'by_purposes_count': by_purposes,
            'by_region_count': by_regions
        }

        return Response(data)
