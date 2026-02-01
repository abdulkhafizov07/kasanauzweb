from django.utils.text import slugify


class AutoSlugMixin:
    slug_field = "meta"
    slug_from = "title"

    def generate_unique_slug(self):
        base_slug = slugify(getattr(self, self.slug_from))
        slug = base_slug
        counter = 1
        Model = self.__class__
        while Model.objects.filter(**{self.slug_field: slug}).exclude(pk=self.pk).exists():  # type: ignore
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def save(self, *args, **kwargs):
        if not getattr(self, self.slug_field):
            setattr(self, self.slug_field, self.generate_unique_slug())
        super().save(*args, **kwargs)  # type: ignore
