from django.db.models import Q

import django_filters

from apps.courses_main.models import Category, Course
from apps.users.models import UserModel


class CategoryFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")

    def search(self, queryset, name, value):
        return queryset.filter(Q(title__icontains=value))

    class Meta:
        model = Category
        fields = ["q", "title"]


class CourseFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="search")
    title = django_filters.CharFilter(lookup_expr="icontains")
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    author = django_filters.ModelChoiceFilter(field_name="author", queryset=UserModel.objects.all())
    short_description = django_filters.CharFilter(field_name="short_description", lookup_expr="icontains")
    description = django_filters.CharFilter(field_name="description", lookup_expr="icontains")

    def search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) | Q(short_description__icontains=value) | Q(description__icontains=value)
        )

    class Meta:
        model = Course
        fields = ["q", "title", "category", "author", "short_description", "description"]
