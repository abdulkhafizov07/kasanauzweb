from django.urls import include, path

app_name = "api"

urlpatterns = [
    path("", include("apps.news_main.urls", "news_main"), name="news-main"),
    path("dashboard/", include("apps.dashboard.urls")),
]
