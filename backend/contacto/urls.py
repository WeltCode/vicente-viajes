from django.urls import path
from .views import enviar_mensaje_contacto

urlpatterns = [
    # Endpoint publico del formulario de contacto.
    path('enviar/', enviar_mensaje_contacto, name='enviar_mensaje_contacto'),
]
