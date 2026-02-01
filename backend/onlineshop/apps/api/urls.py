from django.urls import include, path

from .views import (
    CategoriesApiView, CategoryContentApiView, TopProductsApiView, ProductContentApiView, ProductDataView,
    MessageProductContentApiView, ProductCommentCreateAPIView, ProductCommentReplyAPIView, ProductCommentListAPIView,
    UserProductsApiView, UserUploadProductApiView, UserLikedProductsApiView, UserLikeProductApiView,
    UserIsProductLikedApiView, WebsearchApiView, FilterApiView
)

app_name = "api"

urlpatterns = [
    path("categories/", CategoriesApiView.as_view(), name="category-list"),
    path("category/<str:category>/", CategoryContentApiView.as_view(), name="category-detail"),
    path("top-products/", TopProductsApiView.as_view(), name="top-products"),
    path("product/<str:meta>/", ProductContentApiView.as_view(), name="product-detail"),
    path("product-data/<uuid:guid>/", ProductDataView.as_view(), name="product-detail"),
    path("message-product/<uuid:guid>/", MessageProductContentApiView.as_view(), name="message-product-detail"),
    path("comments/", ProductCommentCreateAPIView.as_view(), name="product-comment-create"),
    path("comments/reply/", ProductCommentReplyAPIView.as_view(), name="product-comment-reply"),
    path("comments/<uuid:guid>/", ProductCommentListAPIView.as_view(), name="product-comments-list"),
    path("profile/products/", UserProductsApiView.as_view(), name="profile-products"),
    path("profile/products/upload/", UserUploadProductApiView.as_view(), name="profile-product-upload"),
    path("profile/liked-products/", UserLikedProductsApiView.as_view(), name="profile-liked-products"),
    path("profile/like-product/", UserLikeProductApiView.as_view(), name="profile-product-like"),
    path("profile/is-product-liked/", UserIsProductLikedApiView.as_view(), name="profile-is-product-liked"),
    path("filter/", FilterApiView.as_view(), name='filter-products'),
    path("search/", WebsearchApiView.as_view(), name="websearch"),
    path("dashboard/", include("apps.dashboard.urls", namespace="dashboard")),
]
