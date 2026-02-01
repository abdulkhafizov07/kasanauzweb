from rest_framework import serializers
from .models import ChatModel


class ChatListSerializer(serializers.ModelSerializer):
    pfp = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatModel
        fields = ["guid", "pfp", "title", "last_message"]

    def get_other_user(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user:
            return None
        return obj.user2 if obj.user1 == user else obj.user1

    def get_pfp(self, obj):
        other = self.get_other_user(obj)
        if hasattr(other,  "pfp") and other.pfp:
            return other.pfp.url
        return None

    def get_title(self, obj):
        other = self.get_other_user(obj)
        if not other:
            return None
        return f"{other.first_name} {other.last_name}".strip()

    def get_last_message(self, obj):
        if not obj.last_message:
            return None
        return {
            "type": obj.last_message.type,
            "content": obj.last_message.content,
        }
