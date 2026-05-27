from django import forms
from .models import Playa

class PlayaAdminForm(forms.ModelForm):
    """Formulario para Playa con subida de imagen via Django storage (Cloudflare Images)"""

    image = forms.ImageField(required=False)

    class Meta:
        model = Playa
        fields = '__all__'