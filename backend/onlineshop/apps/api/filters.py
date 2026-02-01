from django.db.models import Q

import django_filters

from apps.onlineshop_main.models import Category, Product


class CategoryFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")

    def search(self, queryset, name, value):
        return queryset.filter(Q(title__icontains=value) | Q(meta__icontains=value))

    title = django_filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Category
        fields = ["q", "title", "meta"]


class ProductFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")

    def search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) | Q(short_description__icontains=value) | Q(description__icontains=value)
        )

    title = django_filters.CharFilter(lookup_expr="icontains")
    category = django_filters.CharFilter(field_name="category__title", lookup_expr="icontains")
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    short_description = django_filters.CharFilter(lookup_expr="icontains")
    description = django_filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Product
        fields = ["q", "title", "category", "price_min", "price_max", "short_description", "description"]
