from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework_simplejwt.authentication import JWTAuthentication

# from loggs.clickhouse import log_to_clickhouse
from apps.courses_main.base_model import ModelStateChoices

from .mixins import ClickHouseLoggingMixin
from .permissions import HasPermission


class BaseAdminViewSet(ClickHouseLoggingMixin, ModelViewSet):
    permission_classes = [HasPermission]
    permissions_map = {}

    def get_required_permission(self):
        return self.permissions_map.get(self.action)

    @action(detail=True, methods=["patch"], url_path="change-state")
    def change_state(self, request, pk=None):
        obj = self.get_object()
        new_state = request.data.get("state")

        if new_state not in ModelStateChoices.values:
            return Response(
                {"error": f"Noto‘g‘ri holat: {new_state}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_state = obj.state
        obj.state = new_state
        obj.save(update_fields=["state"])

        model_name = obj.__class__._meta.verbose_name
        log_to_clickhouse(
            request.user,
            "state_change",
            obj.__class__.__name__,
            obj.pk,
            f"{model_name} holati: {old_state} → {new_state}",
        )

        return Response(
            {"message": f"{model_name} holati {old_state} dan {new_state} ga o‘zgartirildi"},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["delete"], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        if not ids or not isinstance(ids, list):
            return Response(
                {"error": "ids ro‘yxat bo‘lishi kerak"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(pk__in=ids)
        count = queryset.count()

        if count == 0:
            return Response(
                {"error": "Hech qanday obyekt topilmadi"},
                status=status.HTTP_404_NOT_FOUND,
            )

        model_cls = self.queryset.model
        model_name = model_cls._meta.verbose_name_plural

        queryset.delete()
        log_to_clickhouse(
            request.user.pk,
            "bulk_delete",
            model_cls.__name__,
            None,
            f"{count} ta {model_name} o‘chirildi",
            {"ids": ids},
        )

        return Response(
            {"message": f"{count} ta {model_name} o‘chirildi"},
            status=status.HTTP_200_OK,
        )
