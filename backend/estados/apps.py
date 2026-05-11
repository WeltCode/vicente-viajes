from django.apps import AppConfig


class EstadosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'estados'

    def ready(self):
        import estados.signals  # noqa: F401
