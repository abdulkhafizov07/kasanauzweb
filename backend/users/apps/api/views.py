from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

import requests
import os

from apps.users.models import UserModel

from .models import VerificationCodeModel
from .serializers import UserProfileSerializer, UserRegisterSerializer
from .utils import format_phone, generate_tokens, random_code_generate, send_verification_code

# ===== Registration =====


class RegisterAPIView(generics.CreateAPIView):
    """Handles user registration and resending verification codes."""

    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        request_data = dict(request.data)
        phone = "+998" + format_phone(request_data.get("phone", ""))
        request_data["phone"] = phone

        try:
            existing_user = UserModel.objects.get(phone=phone)
            if existing_user.is_active:
                return Response({"error": "Phone already registered."}, status=400)

            serializer = self.get_serializer(existing_user, data=request_data, partial=True)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            user.set_password(serializer.validated_data["password"])
            user.save()

            code = random_code_generate()
            VerificationCodeModel.objects.create(user=user, code=code)
            send_verification_code(phone, code)

            return Response({"message": "Code resent", "user_guid": user.guid}, status=200)

        except UserModel.DoesNotExist:
            serializer = self.get_serializer(data=request_data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save(is_active=False)
            user.set_password(serializer.validated_data["password"])
            user.save()

            code = random_code_generate()
            VerificationCodeModel.objects.create(user=user, code=code)
            send_verification_code(phone, code)

            return Response({"user_guid": user.guid}, status=201)


# ===== Code Verification =====


class VerifyCodeAPIView(generics.GenericAPIView):
    """Verifies phone number using a code and activates account."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        phone = "+998" + format_phone(request.data.get("phone", ""))
        code = request.data.get("code")

        try:
            user = UserModel.objects.get(phone=phone, is_active=False)
        except UserModel.DoesNotExist:
            return Response({"error": "Foydalanuvchi topilmadi yoki  allaqachon ro'yhatdan o'tgan"}, status=404)

        try:
            vcode = VerificationCodeModel.objects.get(user=user, code=code, created_at__gte=timezone.now() - timedelta(minutes=5))
        except VerificationCodeModel.DoesNotExist:
            return Response({"error": "Noto'g'ri yoki kechiktirilgan ko'd"}, status=400)

        user.is_active = True
        user.is_verified = True
        user.save()
        vcode.delete()

        return Response({"message": "Tasdiqlandi", **generate_tokens(user)}, status=200)


class ResendVerificationCodeAPIView(generics.GenericAPIView):
    """Resend verification code if 5 minutes have passed since last send."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        phone = format_phone(request.data.get("phone", ""))

        if not phone:
            return Response({"error": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserModel.objects.get(phone=phone, is_active=False)
        except UserModel.DoesNotExist:
            return Response({"error": "User not found or already active."}, status=status.HTTP_404_NOT_FOUND)

        latest_code = VerificationCodeModel.objects.filter(user=user).order_by("-created_at").first()

        if latest_code and timezone.now() - latest_code.created_at < timedelta(minutes=5):
            remaining_seconds = int((timedelta(minutes=5) - (timezone.now() - latest_code.created_at)).total_seconds())
            return Response(
                {"error": f"Please wait {remaining_seconds} seconds before requesting a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # Generate and send new code
        code = random_code_generate()
        VerificationCodeModel.objects.create(user=user, code=code)
        print(code)
        send_verification_code(phone, code)

        return Response({"message": "New verification code sent."}, status=status.HTTP_200_OK)


# ===== Login =====
class LoginAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        phone = request.data.get("phone", "")
        password = request.data.get("password", "")
        # captcha_token = request.data.get("captcha")

        if not phone or not password:
            return Response(
                {"error": "Telefon raqam va parolni kiritish majburiy!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # if not captcha_token:
        #     return Response({"error": "Captcha is required"}, status=status.HTTP_400_BAD_REQUEST)

        # verify_url = "https://www.google.com/recaptcha/api/siteverify"
        # secret_key = os.environ['RECAPTCHA_SITE_SECRET_KEY']
        # captcha_response = requests.post(verify_url, data={
        #     "secret": secret_key,
        #     "response": captcha_token
        # }).json()

        # if not captcha_response.get("success"):
        #     return Response({"error": "Invalid Captcha"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _phone = "+" + ''.join([i for i in phone if i.isdigit()])
            user = UserModel.objects.get(phone=_phone, is_active=True)
        except UserModel.DoesNotExist:
            return Response({"error": "Telefon raqam yoki parol noto'g'ri!"}, status=status.HTTP_403_FORBIDDEN)

        if not user.check_password(password):
            return Response({"error": "Telefon raqam yoki parol noto'g'ri!"}, status=status.HTTP_403_FORBIDDEN)

        return Response(generate_tokens(user), status=status.HTTP_200_OK)

# ===== Profile =====
class ProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):  # type: ignore
        guid = self.kwargs.get("guid")
        if guid:
            return UserModel.objects.get(guid=guid)
        return self.request.user


class UpdateProfilePhoto(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("pfp")

        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            return Response(
                {"error": "Only JPG, JPEG, and PNG images are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user.pfp = file
        user.save()

        return Response(
            {"message": "Profile photo updated successfully", "pfp": user.pfp.url},
            status=status.HTTP_200_OK
        )

# ===== OneID Registration =====


class RegisterWithOneIdAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        code = request.data.get("code")
        if not code:
            return Response({"message": "Missing authorization code."}, status=400)

        client_secrets = {
            "client_id": settings.ONE_ID_CLIENT["client_id"],
            "client_secret": settings.ONE_ID_CLIENT["client_secret"],
        }

        with requests.Session() as session:
            auth_response = self._post_to_one_id(
                session, {"grant_type": "one_authorization_code", "code": code, **client_secrets}
            )

            if not auth_response.ok:
                return Response({"message": "Failed to obtain token"}, status=400)

            access_token = auth_response.json().get("access_token")
            if not access_token:
                return Response({"message": "Access token missing"}, status=400)

            identify_response = self._post_to_one_id(
                session,
                {"grant_type": "one_access_token_identify", "access_token": access_token, "scope": "myportal", **client_secrets},
            )

            if not identify_response.ok:
                return Response({"message": "Failed to identify"}, status=400)

            user = self._get_or_create_user(identify_response.json())
            token = generate_tokens(user)

            self._post_to_one_id(
                session, {"grant_type": "one_log_out", "access_token": access_token, "scope": "myportal", **client_secrets}
            )

            return Response(token)

    def _post_to_one_id(self, session, data):
        return session.post("https://sso.egov.uz/sso/oauth/Authorization.do", data=data)

    def _get_or_create_user(self, data):
        phone = data.get("pport_no")
        if not phone:
            raise ValueError("Missing phone/passport number.")

        user, created = UserModel.objects.get_or_create(
            phone=f"+923{data['pport_no']}",
            username=f"{data['user_id']}_{phone}",
            is_oneid=True,
            defaults={
                "first_name": data.get("first_name", "").title(),
                "middle_name": data.get("mid_name", "").title(),
                "last_name": data.get("sur_name", "").title(),
                "role": "user",
                "permissions": {}
            },
        )
        if created:
            user.set_unusable_password()
            user.save()
        return user


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            access_token = request.data["access"]

            refresh = RefreshToken(refresh_token)
            refresh.blacklist()

            access = AccessToken(access_token)
            jti = access["jti"]
            exp = access["exp"]

            cache.set(f"blacklist_{jti}", True, timeout=int(exp - access["iat"]))

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except (KeyError, TokenError, InvalidToken):
            return Response(status=status.HTTP_400_BAD_REQUEST)
