from rest_framework import serializers
from .models import Playa


class PlayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playa
        fields = '__all__'
    
    def validate_slug(self, value):
        # Permitir slug vacío para auto-generación en frontend
        return value


class PlayaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playa
        fields = '__all__'
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }
