from rest_framework import serializers
from .models import Oferta


class OfertaSerializer(serializers.ModelSerializer):
    # Serializer full para CRUD de ofertas en API/admin.
    class Meta:
        model = Oferta
        fields = '__all__'
