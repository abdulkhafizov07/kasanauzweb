from django.db import models
from apps.users.models import UserModel
from .base_model import BaseModel

class ChatModel(BaseModel):
    user1 = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="chats_as_user1"
    )
    user2 = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="chats_as_user2"
    )

    last_message = models.ForeignKey(
        "MessageModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="last_in_chat",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user1", "user2"], name="unique_chat_pair")
        ]

    def __str__(self):
        return f"Chat between {self.user1} and {self.user2}"

    def participants(self):
        return [self.user1, self.user2]


class MessageModel(BaseModel):
    MESSAGE_TYPES = (
        ("text", "Text"),
        ("product", "Product"),
        ("announcement", "Announcement"),
        ("document", "Document"),
    )

    STATUS_CHOICES = (
        ("sent", "Sent"),
        ("delivered", "Delivered"),
        ("read", "Read"),
    )

    chat = models.ForeignKey(
        ChatModel,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default="text")
    content = models.TextField(blank=True, null=True)

    target = models.ForeignKey(
        "TargetObjectModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="target_messages"
    )
    document = models.ForeignKey(
        "DocumentModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="messages"
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="sent")

    def __str__(self):
        return f"{self.sender} -> {self.chat}: {self.type}"

    class Meta:
        indexes = [
            models.Index(fields=["chat", "created_at"]),
            models.Index(fields=["sender", "created_at"]),
        ]


class TargetObjectModel(BaseModel):
    target_url = models.CharField(max_length=500)


class DocumentModel(BaseModel):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("signed", "Signed"),
        ("rejected", "Rejected"),
    )

    creator = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="created_documents"
    )

    target_url = models.CharField(max_length=500)

    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    signed_by = models.ManyToManyField(
        UserModel,
        through="DocumentSigningStatus",
        related_name="signed_documents"
    )

    def __str__(self):
        return f"Document {self.guid} ({self.status})"


class DocumentSigningStatus(BaseModel):
    SIGN_CHOICES = (
        ("pending", "Pending"),
        ("signed", "Signed"),
        ("rejected", "Rejected"),
    )

    document = models.ForeignKey(
        DocumentModel,
        on_delete=models.CASCADE,
        related_name="signing_statuses"
    )
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="document_signatures"
    )
    status = models.CharField(max_length=10, choices=SIGN_CHOICES, default="pending")

    def __str__(self):
        return f"{self.user} - {self.document.guid} ({self.status})"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["document", "user"], name="unique_document_signing")
        ]
        indexes = [
            models.Index(fields=["document"]),
            models.Index(fields=["user"]),
        ]
