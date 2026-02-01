from django.db.models import Q

import django_filters

from apps.announcements_main.models import Announcement


class AnnouncementFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")
    short_description = django_filters.CharFilter(lookup_expr="icontains")
    description = django_filters.CharFilter(lookup_expr="icontains")
    region = django_filters.CharFilter(lookup_expr="icontains")
    district = django_filters.CharFilter(lookup_expr="icontains")
    price_min = django_filters.NumberFilter(field_name="price_min", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price_max", lookup_expr="lte")
    announcement_type = django_filters.CharFilter()

    def search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value)
            | Q(short_description__icontains=value)
            | Q(description__icontains=value)
            | Q(region__icontains=value)
            | Q(district__icontains=value)
        )

    class Meta:
        model = Announcement
        fields = [
            "q",
            "title",
            "announcement_type",
            "short_description",
            "description",
            "region",
            "district",
            "price_min",
            "price_max",
        ]
