from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import KasanaUzHomePageDataApiView, NewsHomeViewSet, NewsWeeklyViewSet, DocumentsHomeAPIView, NewsDetailsAPIView, CategoriesAPIView

app_name = "news_main"

router = DefaultRouter()
router.register(r"home", NewsHomeViewSet, basename="home")
router.register(r"weekly", NewsWeeklyViewSet, basename="weekly")
router.register(r"categories", CategoriesAPIView, basename="categories")

urlpatterns = [
    path("main-home/", KasanaUzHomePageDataApiView.as_view(), name="main-home"),
    path("documents/", DocumentsHomeAPIView.as_view()),
    path("news/<str:meta>/", NewsDetailsAPIView.as_view()),
    path("", include(router.urls))
]
