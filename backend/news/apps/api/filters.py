from django.db.models import Q

import django_filters

from apps.news_main.models import Category, DocumentsModel, NewsModel


class NewsCategoryFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")
    meta = django_filters.CharFilter(lookup_expr="icontains")

    def search(self, queryset, name, value):
        return queryset.filter(Q(title__icontains=value) | Q(meta__icontains=value))

    class Meta:
        model = Category
        fields = ["q", "title", "meta"]


class NewsModelFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")
    short_description = django_filters.CharFilter(lookup_expr="icontains")
    description = django_filters.CharFilter(lookup_expr="icontains")
    category = django_filters.CharFilter(field_name="category__title", lookup_expr="icontains")

    def search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value)
            | Q(short_description__icontains=value)
            | Q(description__icontains=value)
            | Q(category__title__icontains=value)
        )

    class Meta:
        model = NewsModel
        fields = ["q", "title", "short_description", "description", "category"]


class DocumentFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")
    subtitle = django_filters.CharFilter(lookup_expr="icontains")
    doc_type = django_filters.CharFilter(lookup_expr="exact")

    def search(self, queryset, name, value):
        return queryset.filter(Q(title__icontains=value) | Q(subtitle__icontains=value))

    class Meta:
        model = DocumentsModel
        fields = ["q", "title", "subtitle", "doc_type"]
