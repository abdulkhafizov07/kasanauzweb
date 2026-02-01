from django.db import models

from hitcount.models import HitCountBase as HitCount


class CustomHitCount(HitCount):
    object_pk = models.CharField(max_length=36, unique=True)
    hits = models.BigIntegerField(default=0)

    class Meta:
        db_table = "hitcount_custom_hit_count"
