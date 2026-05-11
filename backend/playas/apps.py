from django.apps import AppConfig


class PlayasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'playas'

    def ready(self):
        import playas.signals  # noqa: F401
