from rest_framework import serializers
from .models import Playa



class PlayaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Playa
        fields = '__all__'
        extra_fields = ['image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url

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
