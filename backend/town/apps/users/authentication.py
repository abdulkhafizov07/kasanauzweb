from rest_framework_simplejwt.authentication import JWTAuthentication as MJWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.core.cache import cache

class JWTAuthentication(MJWTAuthentication):
    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        jti = token.get("jti")
        if cache.get(f"blacklist_{jti}"):
            raise InvalidToken("Token has been blacklisted")
        return token
