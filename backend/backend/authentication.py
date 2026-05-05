from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


class AdminTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        max_age_seconds = int(getattr(settings, 'ADMIN_TOKEN_MAX_AGE_SECONDS', 28800) or 28800)
        token_age = (timezone.now() - token.created).total_seconds()

        if token_age >= max_age_seconds:
            token.delete()
            raise AuthenticationFailed('La sesion ha expirado. Inicia sesion de nuevo.')

        return user, token