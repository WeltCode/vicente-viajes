from django import forms
from .models import Playa
from cloudinary.forms import CloudinaryFileField

class PlayaAdminForm(forms.ModelForm):
    """Formulario personalizado para Playa con widget Cloudinary"""

    image = CloudinaryFileField(
        options={
            'folder': 'Vicente Viajes/playas',
            'resource_type': 'image',
            'allowed_formats': ['jpg', 'jpeg', 'png', 'webp'],
            'max_file_size': 5000000,  # 5MB
            'transformation': [
                {'width': 800, 'height': 600, 'crop': 'limit'},
                {'quality': 'auto'}
            ]
        },
        required=False
    )

    class Meta:
        model = Playa
        fields = '__all__'

    class Media:
        css = {
            'all': ('https://widget.cloudinary.com/v2.0/global/all.js',)
        }
        js = ('https://widget.cloudinary.com/v2.0/global/all.js',)