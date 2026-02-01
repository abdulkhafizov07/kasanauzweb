from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.api.urls", "api")),
    path("prometheus/", include("django_prometheus.urls")),
    path("health/", health),
]
