import os


def get_filename(instance, filename):
    ext = filename.split(".")[-1]
    return f"uploads/{os.urandom(16).hex()}.{ext}"
