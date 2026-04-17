from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

# Personalizar el sitio admin
admin.site.site_header = "Vicente Viajes - Administración"
admin.site.site_title = "Vicente Viajes Admin"
admin.site.index_title = "Panel de Administración"

# Agregar enlace a la galería en la página principal del admin
class GalleryAdminMixin:
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('gallery/', self.admin_site.admin_view(self.gallery_view), name='gallery'),
        ]
        return custom_urls + urls

    def gallery_view(self, request):
        from .gallery import image_gallery_view
        return image_gallery_view(request)

# Extender el admin site
class VicenteViajesAdminSite(admin.AdminSite):
    site_header = "Vicente Viajes - Administración"
    site_title = "Vicente Viajes Admin"
    index_title = "Panel de Administración"

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['gallery_url'] = reverse('admin:gallery')
        return super().index(request, extra_context)

# Crear instancia del admin site personalizado
admin_site = VicenteViajesAdminSite(name='vicente_viajes_admin')

# Registrar los modelos en el admin personalizado
from excursiones.admin import ExcursionAdmin
from playas.admin import PlayaAdmin
from ofertas.admin import OfertaAdmin
from estados.admin import EstadoAdmin, EstadoConfigAdmin
from contacto.admin import MensajeContactoAdmin
from excursiones.models import Excursion
from playas.models import Playa
from ofertas.models import Oferta
from estados.models import Estado, EstadoConfig
from contacto.models import mensaje_contacto

admin_site.register(Excursion, ExcursionAdmin)
admin_site.register(Playa, PlayaAdmin)
admin_site.register(Oferta, OfertaAdmin)
admin_site.register(Estado, EstadoAdmin)
admin_site.register(EstadoConfig, EstadoConfigAdmin)
admin_site.register(mensaje_contacto, MensajeContactoAdmin)