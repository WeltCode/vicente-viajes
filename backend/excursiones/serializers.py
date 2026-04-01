from rest_framework import serializers
from django.utils import timezone
from .models import Excursion
from decimal import Decimal


class ExcursionSerializer(serializers.ModelSerializer):
    # Serializer full para CRUD de excursiones con adaptaciones de formato.
    class Meta:
        model = Excursion
        fields = '__all__'
    
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
        return ret
