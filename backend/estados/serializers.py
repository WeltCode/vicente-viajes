from rest_framework import serializers
from django.utils import timezone
from .models import Estado, EstadoConfig


MAX_IMAGE_SIZE = 3 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}


class EstadoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def validate_image(self, value):
        file_name = (getattr(value, 'name', '') or '').lower()
        file_size = int(getattr(value, 'size', 0) or 0)

        if file_size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError('La imagen no puede superar 3 MB.')

        if not any(file_name.endswith(extension) for extension in ALLOWED_IMAGE_EXTENSIONS):
            raise serializers.ValidationError('Formato no permitido. Usa JPG, PNG o WEBP.')

        return value

    def validate_excursion_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError('La fecha de la excursión no puede estar en el pasado.')
        return value

    def get_image_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url

    class Meta:
        model = Estado
        fields = '__all__'


class EstadoConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoConfig
        fields = '__all__'
