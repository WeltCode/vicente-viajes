from rest_framework import serializers
from django.utils import timezone
from .models import Estado, EstadoConfig


MAX_IMAGE_SIZE = 3 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}



class EstadoSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(write_only=True, required=False)
    image_url_out = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Estado
        fields = '__all__'
        extra_fields = ['image_url', 'image_url_out']

    def to_internal_value(self, data):
        mutable_data = data.copy()
        image_value = mutable_data.get('image')

        if isinstance(image_value, str) and image_value.startswith('http'):
            mutable_data['image_url'] = image_value
            mutable_data.pop('image', None)

        return super().to_internal_value(mutable_data)

    def _resolve_image_url(self, image_value):
        if not image_value:
            return ''

        if isinstance(image_value, str):
            return image_value

        return getattr(image_value, 'url', '') or ''

    def get_image_url_out(self, obj):
        request = self.context.get('request')
        image_url = self._resolve_image_url(obj.image)
        if not image_url:
            return ''
        if image_url.startswith('http'):
            return image_url
        return request.build_absolute_uri(image_url) if request else image_url

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image_url'] = self.get_image_url_out(instance)
        return rep

    def update(self, instance, validated_data):
        image_url = validated_data.pop('image_url', None)
        if image_url:
            instance.image = image_url
        return super().update(instance, validated_data)

    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)
        instance = super().create(validated_data)
        if image_url:
            instance.image = image_url
            instance.save()
        return instance

    def validate_image(self, value):
        # Si es una URL (galería), permitirla directamente sin validar extensión ni tamaño
        if isinstance(value, str) and value.startswith('http'):
            return value

        # Solo validar archivos subidos
        file_name = (getattr(value, 'name', '') or '').lower()
        file_size = int(getattr(value, 'size', 0) or 0)

        if file_size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError('La imagen no puede superar 3 MB.')

        # Si es archivo subido, sí valida extensión
        if not any(file_name.endswith(extension) for extension in ALLOWED_IMAGE_EXTENSIONS):
            raise serializers.ValidationError('Formato no permitido. Usa JPG, PNG o WEBP.')

        return value

    def validate_excursion_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError('La fecha de la excursión no puede estar en el pasado.')
        return value


class EstadoConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoConfig
        fields = '__all__'
