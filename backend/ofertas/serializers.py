from rest_framework import serializers
from .models import Oferta


class OfertaSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(write_only=True, required=False)
    image_url_out = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Oferta
        fields = '__all__'
        extra_kwargs = {
            'city': {'required': False, 'allow_blank': True},
            'nights': {'required': False, 'allow_blank': True},
            'validity': {'required': False, 'allow_blank': True},
            'original_price': {'required': False},
            'price_child': {'required': False},
            'departure_date': {'required': False},
            'month': {'required': False, 'allow_blank': True},
            'return_time': {'required': False, 'allow_blank': True},
            'hotel': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'departure_info': {'required': False, 'allow_blank': True},
            'includes': {'required': False, 'allow_blank': True},
            'not_includes': {'required': False, 'allow_blank': True},
            'image_format': {'required': False},
        }

    def get_image_url_out(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        image_url = obj.image.url
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

