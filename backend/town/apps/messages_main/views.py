from django.db import models
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

import requests

from .models import ChatModel, MessageModel
from .serializers import ChatListSerializer
from apps.users.models import UserModel


class ListChatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        chats = (
            ChatModel.objects.filter(Q(user1=request.user) | Q(user2=request.user))
            .select_related("user1", "user2", "last_message")
        )

        serializer = ChatListSerializer(chats, many=True, context={"request": request})
        return Response(serializer.data)


class CreateChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        msg_type = request.data.get("type")
        guid = request.data.get("content")

        if msg_type not in ["product", "announcement"] or not guid:
            return Response({"error": "Invalid payload"}, status=status.HTTP_400_BAD_REQUEST)

        if msg_type == "product":
            service_url = f"http://onlineshop-service:8000/api/product-data/{guid}"
            content_url = f"https://api.kasanabozor.uz/onlineshop/api/message-product/{guid}/"
        else:
            service_url = f"http://announcements-service:8000/api/announcement-data/{guid}"
            content_url = f"https://api.kasanabozor.uz/annoucements/api/announcement-data/{guid}/"

        try:
            resp = requests.get(service_url, timeout=5)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            return Response({"error": f"Failed to fetch data: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

        target_user_guid = data.get("user") or data.get("user_guid") or data.get("user_id")
        if not target_user_guid:
            return Response({"error": "No user guid in response"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = UserModel.objects.get(guid=target_user_guid)
        except UserModel.DoesNotExist:
            return Response({"error": "Target user not found"}, status=status.HTTP_404_NOT_FOUND)

        user_a = request.user
        user_b = target_user

        if user_a.guid == user_b.guid:
            return Response({"error": "Cannot create chat with yourself"}, status=status.HTTP_400_BAD_REQUEST)

        chat = (
            ChatModel.objects.filter(
                Q(user1=user_a, user2=user_b) | Q(user1=user_b, user2=user_a)
            ).first()
        )
        if not chat:
            chat = ChatModel.objects.create(user1=user_a, user2=user_b)

        message = MessageModel.objects.create(
            chat=chat,
            sender=user_a,
            type=msg_type,
            content=content_url,
        )
        chat.last_message = message
        chat.save(update_fields=["last_message"])

        return Response(
            {
                "chat_guid": str(chat.guid),
                "message": {
                    "guid": str(message.guid),
                    "type": message.type,
                    "content": message.content,
                    "created_at": message.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )
