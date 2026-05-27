from django import forms
from .models import Excursion

class ExcursionAdminForm(forms.ModelForm):
    """Formulario para Excursion con subida de imagen via Django storage (Cloudflare Images)"""

    image = forms.ImageField(required=False)

    class Meta:
        model = Excursion
        fields = '__all__'