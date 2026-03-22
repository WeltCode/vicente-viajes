from rest_framework import serializers
from .models import mensaje_contacto

class MensajeContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = mensaje_contacto
        fields = ['nombre', 'email', 'telefono', 'asunto', 'mensaje']
