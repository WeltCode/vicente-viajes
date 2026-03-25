from django.contrib import admin
from django.urls import path, include

# Enrutador principal: centraliza todos los modulos API bajo /api/.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('excursiones.urls')),      # 👈 excursiones API
    path('api/', include('playas.urls')),           # 👈 playas API
    path('api/', include('ofertas.urls')),          # 👈 ofertas API
    path('api/contacto/', include('contacto.urls')), # 👈 contacto API
]
