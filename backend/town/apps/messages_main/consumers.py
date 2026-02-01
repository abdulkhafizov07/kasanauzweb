
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.utils.dateparse import parse_datetime

from apps.users.models import UserModel
from .models import (
    ChatModel,
    MessageModel,
    DocumentModel,
    DocumentSigningStatus,
)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = None
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.chat_group_name = f"chat_{self.chat_id}"
        await self.accept()

    async def disconnect(self, code):
        print("LAYER", self.channel_layer)
        if hasattr(self, "chat_group_name") and self.channel_layer:
            await self.channel_layer.group_discard(
                self.chat_group_name, self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        event = data.get("event")

        if event == "auth":
            try:
                await self.authenticate(data.get("token"))
            except Exception as err:
                await self.send_json({"error": "Authentication failed"})
                await self.send_json({"error": str(err)})
                await self.close()
            return

        if not self.user:
            await self.send_json({"error": "Authentication required"})
            await self.close()
            return

        if event == "fetch":
            await self.fetch_messages(data)
        elif event == "message":
            await self.handle_message(data)
        elif event == "update":
            await self.handle_update(data)

    async def authenticate(self, token):
        user = await self.get_user_from_token(token)
        chat = await self.get_chat(self.chat_id)

        if not user or not chat or not await self.is_participant(chat, user):
            await self.send_json({"event": "auth", "status": "failed"})
            await self.close()
            return

        self.user = user
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.send_json({"event": "auth", "status": "ok"})

    async def fetch_messages(self, data):
        size = int(data.get("size", 50))
        offset = int(data.get("offset", 0))
        direction = data.get("direction", "before")
        time_str = data.get("time")

        messages, has_more = await self.query_messages(
            self.chat_id, size, offset, time_str, direction
        )

        my_id = str(self.user.guid)

        payload = [
            {
                "id": str(m.guid),
                "sender": str(m.sender.guid),
                "type": m.type,
                "content": m.content,
                "status": m.status,
                "is_self": my_id == str(m.sender.guid),
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ]

        await self.send_json({"event": "fetch", "messages": payload, "has_more": has_more})

    async def handle_message(self, data):
        content = data.get("content", "")
        msg_type = data.get("type", "text")
        
        if isinstance(content, str) and content.strip():
            if not isinstance(msg_type, str) or msg_type not in ["text", "product", "announcement", "document"]:
                await self.send_json({"error": "type is not valid string"})
                return

            message = await self.create_message(
                chat_id=self.chat_id,
                sender=self.user,
                msg_type=msg_type,
                content=content,
            )

            response = {
                "event": "message",
                "id": str(message.guid),
                "sender": str(self.user.guid),
                "type": msg_type,
                "content": content,
                "status": message.status,
                "created_at": message.created_at.isoformat(),
            }

            # ✅ Broadcast without is_self
            await self.channel_layer.group_send(
                self.chat_group_name,
                {"type": "chat_message", "message": response},
            )
        else:
            await self.send_json({"error": "content as string"})

    async def handle_update(self, data):
        if data.get("type") == "sign":
            doc_guid = data.get("content")
            success = await self.sign_document(doc_guid, self.user)
            await self.send_json(
                {"event": "update", "status": "ok" if success else "failed"}
            )


    async def chat_message(self, event):
        message = event["message"]

        message["is_self"] = (message["sender"] == str(self.user.guid))

        await self.send_json(message)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            access = AccessToken(token)
            return UserModel.objects.get(guid=access["user_id"])
        except Exception:
            return None

    @database_sync_to_async
    def get_chat(self, chat_id):
        try:
            return ChatModel.objects.get(guid=chat_id)
        except ChatModel.DoesNotExist:
            return None

    @database_sync_to_async
    def is_participant(self, chat, user):
        return chat.user1 == user or chat.user2 == user

    @database_sync_to_async
    def query_messages(self, chat_id, size, offset, time_str, direction):
        qs = MessageModel.objects.filter(chat_id=chat_id).select_related("sender")

        if time_str:
            dt = parse_datetime(time_str)
            if dt:
                if direction == "before":
                    qs = qs.filter(created_at__lt=dt)
                elif direction == "after":
                    qs = qs.filter(created_at__gt=dt)

        total_count = qs.count()

        if direction == "before":
            qs = qs.order_by("-created_at")
        else:
            qs = qs.order_by("created_at")

        results = list(qs[offset : offset + size])
        has_more = offset + size < total_count
        return results, has_more

    @database_sync_to_async
    def create_message(self, chat_id, sender, msg_type, content):
        chat = ChatModel.objects.get(guid=chat_id)
        message = MessageModel.objects.create(
            chat=chat, sender=sender, type=msg_type, content=content
        )
        chat.last_message = message
        chat.save(update_fields=["last_message"])
        return message

    @database_sync_to_async
    def sign_document(self, guid, user):
        try:
            doc = DocumentModel.objects.get(guid=guid)
            signing, _ = DocumentSigningStatus.objects.get_or_create(
                document=doc, user=user
            )
            signing.status = "signed"
            signing.save(update_fields=["status"])
            return True
        except DocumentModel.DoesNotExist:
            return False

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

"""
{"event": "auth", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4NzE3MzgxLCJpYXQiOjE3NTg2NjMzODEsImp0aSI6IjNhNWUyY2MwMTE0YjQwNDlhNzM3MThiOWQ1OGM5NTNmIiwidXNlcl9pZCI6IjY0ODJiYjQ4LTAyZmEtNDU1Mi04OWFkLTBjMWMzZmZjNzZkNiJ9.7NQhuQYt2QSKfTGQxExyZr67yDi-_28xlypKNaJG4Qo"}
"""
