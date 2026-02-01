
import re
from typing import Any, Optional, Type
from rest_framework import serializers
# from logging.clickhouse import log_to_clickhouse
from django.db.models import Model, QuerySet


def diff_fields(old_values, new_values, ignore=None):
    ignore = ignore or []
    changes = {}
    for field, old_val in old_values.items():
        if field in ignore:
            continue
        new_val = new_values[field]
        if old_val != new_val:
            changes[field] = {"old": old_val, "new": new_val}
    return changes


class ClickHouseLoggingMixin:
    log_ignore_fields = ["updated_at", "created_at"]

    def _verbose_name(self, obj):
        return str(obj._meta.verbose_name)

    def perform_create(self, serializer):
        obj = serializer.save()
        return obj
        log_to_clickhouse(
            self.request.user.pk,
            "create",
            obj.__class__.__name__,
            obj.pk,
            f"Yangi {self._verbose_name(obj)} yaratildi: {obj}",
        )
        return obj

    def perform_update(self, serializer):
        instance = self.get_object()
        old_values = {f.name: getattr(instance, f.name) for f in instance._meta.fields}

        obj = serializer.save()
        return obj
        new_values = {f.name: getattr(obj, f.name) for f in obj._meta.fields}

        changes = diff_fields(old_values, new_values, ignore=self.log_ignore_fields)

        if changes:
            log_to_clickhouse(
                self.request.user.pk,
                "update",
                obj.__class__.__name__,
                obj.pk,
                f"{self._verbose_name(obj)} yangilandi: {obj}",
                {"changes": changes},
            )
        return obj

    def perform_destroy(self, instance):
        # log_to_clickhouse(
        #     self.request.user.pk,
        #     "delete",
        #     instance.__class__.__name__,
        #     instance.pk,
        #     f"{self._verbose_name(instance)} o‘chirildi: {instance}",
        # )
        return super().perform_destroy(instance)


class SlugMetaValidationMixin:
    """
    Mixin to validate a slug-like value in serializer's `meta` field.
    Checks format with regex and enforces uniqueness in DB.
    """

    slug_regex = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

    def validate_meta(self, value: str) -> str:
        if not isinstance(value, str):
            raise serializers.ValidationError("Slug matn (string) bo‘lishi kerak."
            )

        if not self.slug_regex.match(value):
            raise serializers.ValidationError("Slug faqat kichik harflar, raqamlar va chiziqchadan iborat bo‘lishi kerak.")

        model: Optional[Type[Model]] = getattr(self.Meta, "model", None)
        if model is None:
            raise RuntimeError("Serializer using SlugMetaValidationMixin must define Meta.model")

        qs = model.admin_objects.filter(**{"meta": value})
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(f"'{value}' allaqachon ishlatilinmoqda")

        return value
