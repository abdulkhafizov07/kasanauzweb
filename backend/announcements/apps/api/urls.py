from django.urls import include, path

from .views import (
    HomeAnnouncementsApiView,
    AnnouncementContentApiView,
    CreateAnnouncementApiView,
    HomeDataContentApiView,
    MessageAnnouncementContentApiView,
    UserAnnouncementsApiView,
    UserSaveAnnouncementApiView,
    UserSavedAnnouncementsApiView,
    WebsearchApiView,
    AnnouncementDataView
)

app_name = "api"

urlpatterns = [
    path("home-data/", HomeDataContentApiView.as_view()),
    path("home-announcements/", HomeAnnouncementsApiView.as_view()),
    path("announcement/<str:meta>/", AnnouncementContentApiView.as_view()),
    path("announcement-data/<uuid:guid>/", AnnouncementDataView.as_view()),
    path("mannouncement/<uuid:guid>/", MessageAnnouncementContentApiView.as_view()),
    path("user-announcements/", UserAnnouncementsApiView.as_view()),
    path("user-saved/", UserSavedAnnouncementsApiView.as_view()),
    path("save/", UserSaveAnnouncementApiView.as_view()),
    path("create/", CreateAnnouncementApiView.as_view()),
    path("search/", WebsearchApiView.as_view()),
    path("dashboard/", include("apps.dashboard.urls", "dashboard")),
]
