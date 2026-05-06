from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


class AdminTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        max_age_seconds = int(getattr(settings, 'ADMIN_TOKEN_MAX_AGE_SECONDS', 600) or 600)
        token_age = (timezone.now() - token.created).total_seconds()

        if token_age >= max_age_seconds:
            token.delete()
            raise AuthenticationFailed('La sesion ha expirado. Inicia sesion de nuevo.')

        # Ventana deslizante: renovar el token en cada uso para que el timeout
        # sea de inactividad y no absoluto desde el login.
        # Solo escribir en BD si han pasado más de 30s para no saturar.
        if token_age > 30:
            token.created = timezone.now()
            token.save(update_fields=['created'])

        return user, token