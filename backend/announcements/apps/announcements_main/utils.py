import uuid


def unique_thumbnail_path(instance, filename):
    ext = filename.split(".")[-1]
    return f"thumbnails/{uuid.uuid4().hex}.{ext}"
