from django.urls import include, path

from .views import *

app_name = "api"

urlpatterns = [
    path("home-data/", HomeDataContentApiView.as_view(), name="home-data"),
    path("categories/", CategoriesApiView.as_view()),
    path("category/<str:meta>/", CategoryContentApiView.as_view(), name="category_details"),
    path("course/<str:meta>/", CourseDetailApiView.as_view(), name="course_details"),
    path("lesson/<uuid:guid>/", LessonDetailApiView.as_view(), name="lesson_details"),
    path("like/", UserLikeCourseApiView.as_view()),
    path("user-liked-courses/", UserLikedCoursesApiView.as_view()),
    path("sub/", UserSubCourseApiView.as_view()),
    path("user-subed-courses/", UserSubedCoursesApiView.as_view()),
    path("search/", WebsearchApiView.as_view()),
    path("top/", TopCoursesApiView.as_view(), name="top-courses"),
    path("new/", NewCoursesApiView.as_view(), name="new-courses"),
    path("dashboard/", include("apps.dashboard.urls", "dashboard")),
]
