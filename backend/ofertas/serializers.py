from rest_framework import serializers
from .models import Oferta


class OfertaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Oferta
        fields = '__all__'
        extra_fields = ['image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url
