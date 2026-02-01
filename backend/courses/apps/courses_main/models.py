from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from hitcount.models import MODEL_HITCOUNT, HitCountMixin
from hitcount.utils import get_hitcount_model

from apps.users.user_model import UserModel

from .base_model import BaseModel
from .managers import ModelManager
from .mixins import AutoSlugMixin

# Create your models here.


class Category(AutoSlugMixin, BaseModel):
    title = models.CharField(max_length=256)
    meta = models.SlugField(max_length=256, unique=True)

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self):
        return f"{self.title} {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        db_table = "courses_app__category"
        ordering = ("-created_at",)


class Course(AutoSlugMixin, BaseModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="course_user_courses")

    thumbnail = models.ImageField(upload_to="thumbnails/")
    title = models.CharField(max_length=256)
    meta = models.SlugField(max_length=256, unique=True)
    short_description = models.TextField(max_length=250)
    description = models.TextField()
    subscribed = models.ManyToManyField(UserModel, related_name="user_subed_courses", blank=True)
    liked = models.ManyToManyField(UserModel, related_name="user_liked_courses", blank=True)

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self):
        return self.title

    @property
    def hits(self):
        lessons = self.course_lessons_courses.all()
        if lessons:
            lessons = list(map(lambda x: get_hitcount_model().objects.get_for_object(x), lessons))
            return max(lessons, key=lambda a: a.hits).hits
        return None

    class Meta:
        verbose_name = "Kurs"
        verbose_name_plural = "Kurslar"
        db_table = "courses_app__course"


class Lesson(BaseModel, HitCountMixin):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_lessons_courses")
    order = models.PositiveIntegerField(default=1)
    video = models.CharField(max_length=256)

    hit_count_generic = GenericRelation(MODEL_HITCOUNT, object_id_field="object_pk", related_query_name="news_views")

    def __str__(self):
        return f"#Dars {self.order}"

    class Meta:
        verbose_name = "Dars"
        verbose_name_plural = "Darslar"
        db_table = "courses_app__lesson"
