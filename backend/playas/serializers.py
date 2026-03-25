from rest_framework import serializers
from .models import Playa


class PlayaSerializer(serializers.ModelSerializer):
    # Serializer principal usado en listados, detalle y actualizaciones.
    class Meta:
        model = Playa
        fields = '__all__'
    
    def validate_slug(self, value):
        # Se acepta slug vacio para no bloquear altas/ediciones desde UI.
        return value


class PlayaCreateSerializer(serializers.ModelSerializer):
    # Variante de alta que deja slug opcional de forma explicita.
    class Meta:
        model = Playa
        fields = '__all__'
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }
