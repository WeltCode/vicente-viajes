from rest_framework import serializers
from .models import Oferta


class OfertaSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(write_only=True, required=False)
    image_url_out = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Oferta
        fields = '__all__'
        extra_fields = ['image_url', 'image_url_out']

    def get_image_url_out(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        image_url = obj.image.url
        return request.build_absolute_uri(image_url) if request else image_url

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Para compatibilidad con frontend: image_url como salida
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
