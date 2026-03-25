from rest_framework import serializers
from .models import mensaje_contacto

class MensajeContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = mensaje_contacto
        # Se exponen solo campos de captura; flags internos quedan fuera del POST publico.
        fields = ['nombre', 'email', 'telefono', 'asunto', 'mensaje']
