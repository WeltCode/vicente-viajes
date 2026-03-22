from django.urls import path
from .views import enviar_mensaje_contacto

urlpatterns = [
    path('enviar/', enviar_mensaje_contacto, name='enviar_mensaje_contacto'),
]
