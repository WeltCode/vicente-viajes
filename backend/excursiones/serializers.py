import re
from rest_framework import serializers
from django.utils import timezone
from .models import Excursion
from decimal import Decimal


def _cloudinary_public_id_from_url(url):
    """
    Extrae el public_id de una URL completa de Cloudinary.
    Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234/folder/file.jpg
             → 'folder/file'
    """
    match = re.search(r'/upload/(?:v\d+/)?(.+?)(?:\.[a-zA-Z0-9]+)?$', str(url))
    return match.group(1) if match else None


class ExcursionSerializer(serializers.ModelSerializer):
    # Serializer full para CRUD de excursiones con adaptaciones de formato.
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Excursion
        fields = '__all__'
        # image_url se añade dinámicamente
        extra_fields = ['image_url']

    def get_image_url(self, obj):
        if hasattr(obj, 'image') and obj.image:
            # CloudinaryField puede tener .url o .build_url()
            try:
                return obj.image.url
            except Exception:
                return str(obj.image)
        return None
    
    def validate_price(self, value):
        # Normaliza y valida precio numerico antes de persistir.
        """Ensure price is a valid Decimal"""
        if value is None:
            raise serializers.ValidationError("Price is required")
        try:
            return Decimal(str(value))
        except:
            raise serializers.ValidationError("Price must be a valid number")
    
    def validate_rating(self, value):
        # Restringe rating al rango permitido por negocio.
        """Ensure rating is a valid Decimal between 0-5"""
        if value is None:
            return Decimal('0')
        try:
            val = Decimal(str(value))
            if val < 0 or val > 5:
                raise serializers.ValidationError("Rating must be between 0 and 5")
            return val
        except:
            raise serializers.ValidationError("Rating must be a valid number")

    def validate_includes(self, value):
        # Permite recibir lista en frontend y persistirla como texto multilinea.
        """Accept either string or list of strings."""
        if isinstance(value, list):
            return "\n".join(value)
        return value

    def validate_not_includes(self, value):
        # Alinea formato de entrada con el almacenado interno multilinea.
        if isinstance(value, list):
            return "\n".join(value)
        return value

    def validate_image(self, value):
        # Si el frontend envía la URL completa de Cloudinary (desde galería),
        # extrae el public_id para que CloudinaryField lo almacene correctamente.
        if isinstance(value, str) and 'res.cloudinary.com' in value:
            public_id = _cloudinary_public_id_from_url(value)
            if public_id:
                return public_id
        return value

    def to_representation(self, instance):
        # Convierte multilinea -> lista para simplificar el render en React.
        ret = super().to_representation(instance)
        for key in ['includes', 'not_includes']:
            val = ret.get(key)
            if isinstance(val, str):
                ret[key] = [line for line in val.splitlines() if line.strip()]
        if instance.departure_date and instance.departure_date <= timezone.localdate():
            ret['is_active'] = False
        # Garantiza estructura estable para el frontend.
        if ret.get('itinerary') is None:
            ret['itinerary'] = []
        # Añade image_url explícitamente
        ret['image_url'] = self.get_image_url(instance)
        return ret
