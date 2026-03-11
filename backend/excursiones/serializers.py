from rest_framework import serializers
from .models import Excursion
from decimal import Decimal


class ExcursionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Excursion
        fields = '__all__'
    
    def validate_price(self, value):
        """Ensure price is a valid Decimal"""
        if value is None:
            raise serializers.ValidationError("Price is required")
        try:
            return Decimal(str(value))
        except:
            raise serializers.ValidationError("Price must be a valid number")
    
    def validate_rating(self, value):
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
        """Accept either string or list of strings."""
        if isinstance(value, list):
            return "\n".join(value)
        return value

    def validate_not_includes(self, value):
        if isinstance(value, list):
            return "\n".join(value)
        return value

    def to_representation(self, instance):
        # convert text fields into lists for the frontend
        ret = super().to_representation(instance)
        for key in ['includes', 'not_includes']:
            val = ret.get(key)
            if isinstance(val, str):
                ret[key] = [line for line in val.splitlines() if line.strip()]
        # ensure itinerary is an array
        if ret.get('itinerary') is None:
            ret['itinerary'] = []
        return ret
