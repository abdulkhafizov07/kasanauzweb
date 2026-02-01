from django.urls import include, path

from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    LoginAPIView,
    ProfileAPIView,
    RegisterAPIView,
    RegisterWithOneIdAPIView,
    ResendVerificationCodeAPIView,
    VerifyCodeAPIView,
    LogoutView,
    UpdateProfilePhoto
)

app_name = "api"

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/verify/", VerifyCodeAPIView.as_view(), name="verify"),
    path("auth/resend-code/", ResendVerificationCodeAPIView.as_view(), name="resend-code"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/verify-token/", TokenVerifyView.as_view(), name="verify-token"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="verify-token"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/oneid/", RegisterWithOneIdAPIView.as_view(), name="one-id"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("pfp-update/", UpdateProfilePhoto.as_view(), name="pfp-update"),
    path("dashboard/", include("apps.dashboard.urls", namespace="dashboard")),
]
