import random
import string

from rest_framework_simplejwt.tokens import RefreshToken

from .notify import notify


def random_code_generate():
    """Generate a random 5-digit numeric code."""
    return random.randint(10000, 99999)


def random_username_generate(length=15):
    """Generate a random alphanumeric username."""
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def format_phone(phone):
    """Remove +998 prefix from phone numbers."""
    return str(phone).replace("+998", "")


def send_verification_code(phone, code):
    """Send SMS verification code."""
    notify.send_message(
        f"+998{phone}", f"kasana.mehnat.uz saytiga ro‘yxatdan o‘tish uchun tasdiqlash kodi: {code}", "localhost:3000"
    )


def generate_tokens(user):
    """Generate JWT access and refresh tokens for a user with extra claims."""
    refresh = RefreshToken.for_user(user)

    # ✅ Add custom claims to the access token
    refresh["user_id"] = str(user.pk)        # or user.pk
    refresh["role"] = getattr(user, "role", None)  # ensure your User model has a 'role' field

    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }
