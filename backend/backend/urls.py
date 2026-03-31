from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Enrutador principal: centraliza todos los modulos API bajo /api/.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('excursiones.urls')),      # 👈 excursiones API
    path('api/', include('playas.urls')),           # 👈 playas API
    path('api/', include('ofertas.urls')),          # 👈 ofertas API
    path('api/', include('estados.urls')),          # 👈 estados API
    path('api/contacto/', include('contacto.urls')), # 👈 contacto API
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
