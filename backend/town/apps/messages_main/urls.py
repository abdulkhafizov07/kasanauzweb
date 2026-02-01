from django.urls import path
from .views import ListChatsView, CreateChatView

urlpatterns = [
    path("chats/", ListChatsView.as_view(), name="list-chats"),
    path("chats/create/", CreateChatView.as_view(), name="create-chat"),
]
