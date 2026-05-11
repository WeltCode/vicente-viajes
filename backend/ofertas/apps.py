from django.apps import AppConfig


class OfertasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ofertas'

    def ready(self):
        import ofertas.signals  # noqa: F401
