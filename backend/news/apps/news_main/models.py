from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from hitcount.models import MODEL_HITCOUNT, HitCountMixin

from apps.users.user_model import UserModel

from .base_model import BaseModel
from .managers import ModelManager
from .mixins import AutoSlugMixin
from .utils import get_filename


class Category(AutoSlugMixin, BaseModel):
    title = models.CharField(max_length=200, verbose_name="Nomi")
    meta = models.SlugField(max_length=150, unique=True, verbose_name="Slug", blank=True)

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self) -> str:
        return str(self.title)

    class Meta:  # type: ignore
        db_table = "news_app__categories"
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"


class NewsModel(AutoSlugMixin, BaseModel, HitCountMixin):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="category_news", verbose_name="Kategoriya")
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="user_upload_news", verbose_name="Muallif")

    thumbnail = models.ImageField(upload_to=get_filename, verbose_name="Rasm")
    title = models.CharField(max_length=200, verbose_name="Sarlavha")
    meta = models.SlugField(max_length=150, unique=True, verbose_name="Slug", blank=True)
    short_description = models.TextField(max_length=500, verbose_name="Qisqa izoh")
    description = models.TextField(verbose_name="To‘liq matn")

    hit_count_generic = GenericRelation(MODEL_HITCOUNT, object_id_field="object_pk", related_query_name="news_views")

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self) -> str:
        return str(self.title)

    class Meta:
        db_table = "news_app__news"
        verbose_name = "Yangilik"
        verbose_name_plural = "Yangiliklar"


class DocumentsModel(AutoSlugMixin, BaseModel):
    doc_type = models.CharField(
        max_length=32,
        choices=(
            ("legacy_documents", "Qonunchilik hujjatlari"),
            ("business_documents", "Kichik biznes loyihalari"),
        ),
        verbose_name="Hujjat turi",
    )
    title = models.CharField(max_length=200, verbose_name="Sarlavha")
    meta = models.SlugField(max_length=150, unique=True, verbose_name="Slug", blank=True)
    subtitle = models.CharField(max_length=300, verbose_name="Qo‘shimcha sarlavha")
    link = models.URLField(max_length=2000, null=True, blank=True, verbose_name="Havola")
    file = models.FileField(upload_to=get_filename, null=True, blank=True, verbose_name="Fayl")

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self) -> str:
        return str(self.title)

    class Meta:
        db_table = "news_app__documents"
        verbose_name = "Hujjat"
        verbose_name_plural = "Hujjatlar"
