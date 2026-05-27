from django import forms
from .models import Estado

class EstadoAdminForm(forms.ModelForm):
    """Formulario para Estado con subida de imagen via Django storage (Cloudflare Images)"""

    image = forms.ImageField(required=False)

    class Meta:
        model = Estado
        fields = '__all__'