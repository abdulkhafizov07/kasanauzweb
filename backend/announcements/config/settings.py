import os
from datetime import timedelta
from pathlib import Path

import dotenv
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# -------------------------------------------------------------------
# Load .env
# -------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv.load_dotenv(BASE_DIR / ".env")

# -------------------------------------------------------------------
# SECURITY
# -------------------------------------------------------------------
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]  # must be set

DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"

if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = ["api.kasana.uz"]

ALLOWED_HOSTS.extend([
    "onlineshop-service",
    "announcements-service",
])

# -------------------------------------------------------------------
# APPS
# -------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "minio_storage",
    "rest_framework",
    "rest_framework_simplejwt",
    'rest_framework_simplejwt.token_blacklist',
    "hitcount",
    "django_cleanup.apps.CleanupConfig",
    "django_filters",
    "django_prometheus",
    # Local apps
    "apps.tracking",
]

extra_apps = os.environ.get("DJANGO_INSTALLED_APPS", "")
if extra_apps:
    INSTALLED_APPS.extend(extra_apps.split(","))

if DEBUG:
    INSTALLED_APPS.append("corsheaders")

# -------------------------------------------------------------------
# MIDDLEWARE
# -------------------------------------------------------------------
MIDDLEWARE = [
    "django_prometheus.middleware.PrometheusBeforeMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
]

if DEBUG:
    MIDDLEWARE.append("corsheaders.middleware.CorsMiddleware")

MIDDLEWARE.extend([
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django_prometheus.middleware.PrometheusAfterMiddleware",
])

ROOT_URLCONF = "config.urls"

# -------------------------------------------------------------------
# Templates
# -------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# -------------------------------------------------------------------
# Database
# -------------------------------------------------------------------
if os.environ.get("DJANGO_SQLITE3", "false").lower() == "true":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["POSTGRES_DB"],
            "USER": os.environ["POSTGRES_USER"],
            "PASSWORD": os.environ["POSTGRES_PASSWORD"],
            "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
            "PORT": os.environ.get("POSTGRES_PORT", 5432),
        }
    }

# -------------------------------------------------------------------
# Cache (Redis)
# -------------------------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ["REDIS_URL"],
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}

# -------------------------------------------------------------------
# Password validators
# -------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = (
    []
    if DEBUG
    else [
        {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
        {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
        {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
        {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
    ]
)

# -------------------------------------------------------------------
# i18n
# -------------------------------------------------------------------
LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------------
# Static & Media
# -------------------------------------------------------------------
STATIC_URL = "/assets/"
STATIC_ROOT = BASE_DIR / "static"

MEDIA_URL = "/uploads/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.UserModel"

# -------------------------------------------------------------------
# Django REST Framework
# -------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("apps.users.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

# -------------------------------------------------------------------
# JWT settings
# -------------------------------------------------------------------
SIMPLE_JWT = {
    "USER_ID_FIELD": "guid",
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}
if "apps.users_main" in INSTALLED_APPS:
    SIMPLE_JWT["TOKEN_OBTAIN_SERIALIZER"] = "apps.users_main.serializers.CustomTokenObtainPairSerializer"
    SIMPLE_JWT["TOKEN_REFRESH_SERIALIZER"] = "apps.users_main.serializers.SafeTokenRefreshSerializer"

if "apps.messages_main" in INSTALLED_APPS:
    INSTALLED_APPS += ["channels"]
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("redis", 6379)],
            },
        },
    }

# -------------------------------------------------------------------
# CORS (only in DEBUG)
# -------------------------------------------------------------------
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_HEADERS = [
        "accept",
        "accept-encoding",
        "authorization",
        "content-type",
        "dnt",
        "origin",
        "user-agent",
        "x-csrftoken",
        "x-requested-with",
    ]
    CORS_ALLOW_METHODS = [
        "DELETE",
        "GET",
        "OPTIONS",
        "PATCH",
        "POST",
        "PUT",
    ]

# -------------------------------------------------------------------
# HitCount
# -------------------------------------------------------------------
HITCOUNT_HITCOUNT_MODEL = "tracking.CustomHitCount"

# -------------------------------------------------------------------
# Sentry
# -------------------------------------------------------------------
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    environment=os.environ.get("SENTRY_ENVIRONMENT", "development"),
    release=os.environ.get("SENTRY_RELEASE", "unknown"),
    integrations=[DjangoIntegration()],
    send_default_pii=True,
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "sentry": {
            "level": "ERROR",
            "class": "sentry_sdk.integrations.logging.EventHandler",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "sentry"],
    },
}

# -------------------------------------------------------------------
# OneID
# -------------------------------------------------------------------
ONE_ID_CLIENT = {
    "client_id": os.environ.get("ONE_ID_CLIENT_ID"),
    "client_secret": os.environ.get("ONE_ID_CLIENT_SECRET"),
}

# -------------------------------------------------------------------
# File storage (MinIO / S3)
# -------------------------------------------------------------------
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL")
AWS_S3_USE_SSL = os.environ.get("AWS_S3_USE_SSL", "false").lower() == "true"
AWS_QUERYSTRING_AUTH = True

MINIO_STORAGE_ENDPOINT = os.environ.get("MINIO_STORAGE_ENDPOINT", "localhost:9000")
MINIO_STORAGE_ACCESS_KEY = os.environ.get("MINIO_STORAGE_ACCESS_KEY")
MINIO_STORAGE_SECRET_KEY = os.environ.get("MINIO_STORAGE_SECRET_KEY")
MINIO_STORAGE_USE_HTTPS = os.environ.get("MINIO_STORAGE_USE_HTTPS", "false").lower() == "true"
MINIO_STORAGE_MEDIA_BUCKET_NAME = os.environ.get("MINIO_STORAGE_MEDIA_BUCKET_NAME", "local-media")
MINIO_STORAGE_STATIC_BUCKET_NAME = os.environ.get("MINIO_STORAGE_STATIC_BUCKET_NAME", "local-static")
MINIO_STORAGE_AUTO_CREATE_MEDIA_BUCKET = True
MINIO_STORAGE_AUTO_CREATE_STATIC_BUCKET = True
MINIO_STORAGE_MEDIA_URL = os.environ.get("MINIO_STORAGE_MEDIA_URL", "/media/")

STORAGES = {
    "default": {"BACKEND": "minio_storage.storage.MinioMediaStorage"},
    "staticfiles": {"BACKEND": "minio_storage.storage.MinioStaticStorage"},
}

# -------------------------------------------------------------------
# Security settings (prod only)
# -------------------------------------------------------------------
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

    SECURE_SSL_REDIRECT = False
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    X_FRAME_OPTIONS = "DENY"

    APPEND_SLASH = True
