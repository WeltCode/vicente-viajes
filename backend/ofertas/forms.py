from django import forms
from .models import Oferta

class OfertaAdminForm(forms.ModelForm):
    """Formulario para Oferta con subida de imagen via Django storage (Cloudflare Images)"""

    image = forms.ImageField(required=False)

    class Meta:
        model = Oferta
        fields = '__all__'