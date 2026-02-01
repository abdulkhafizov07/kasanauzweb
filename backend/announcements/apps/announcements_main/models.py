from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from hitcount.models import HitCountMixin
from hitcount.settings import MODEL_HITCOUNT

from apps.users.user_model import UserModel

from .base_model import BaseModel
from .managers import ModelManager
from .utils import unique_thumbnail_path
from .mixins import AutoSlugMixin
# Create your models here.


class Announcement(AutoSlugMixin, BaseModel, HitCountMixin):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="user_announcements_announcements")
    announcement_type = models.CharField(choices=(("service_announcement", "Xizmat e`loni"), ("work_announcement", "Ish e`loni")))
    title = models.CharField(max_length=256)
    meta = models.SlugField(max_length=256, unique=True)
    thumbnail = models.ImageField(upload_to=unique_thumbnail_path, max_length=255)

    price_min = models.PositiveBigIntegerField(null=True, blank=True)
    price_max = models.PositiveBigIntegerField(null=True, blank=True)
    dealed = models.BooleanField(default=False)

    region = models.CharField(max_length=256, blank=True, null=True)
    district = models.CharField(max_length=256, blank=True, null=True)

    address = models.CharField(max_length=512)

    experience = models.CharField(max_length=1024)
    work_time = models.CharField(
        choices=(
            ("full_time", "To'liq ish vaqti"),
            ("part_time", "Yarim ish vaqti"),
            ("flexable_time", "Moslashuvchan ish vaqti"),
        )
    )

    short_description = models.TextField(max_length=250)
    description = models.TextField()

    saved = models.ManyToManyField(UserModel, related_name="user_saved_announcements", blank=True)

    hit_count_generic = GenericRelation(
        MODEL_HITCOUNT, object_id_field="object_pk", related_query_name="hit_count_generic_relation"
    )

    objects = ModelManager()
    admin_objects = models.Manager()

    class Meta:
        db_table = "announcement_announcements"
        ordering = ["-created_at"]
