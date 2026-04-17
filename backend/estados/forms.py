from django import forms
from .models import Estado
from cloudinary.forms import CloudinaryFileField

class EstadoAdminForm(forms.ModelForm):
    """Formulario personalizado para Estado con widget Cloudinary"""

    image = CloudinaryFileField(
        options={
            'folder': 'Vicente Viajes/estados',
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
        model = Estado
        fields = '__all__'

    class Media:
        css = {
            'all': ('https://widget.cloudinary.com/v2.0/global/all.js',)
        }
        js = ('https://widget.cloudinary.com/v2.0/global/all.js',)