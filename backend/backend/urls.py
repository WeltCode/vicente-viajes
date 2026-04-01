from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

# Enrutador principal: centraliza todos los modulos API bajo /api/.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('excursiones.urls')),      # 👈 excursiones API
    path('api/', include('playas.urls')),           # 👈 playas API
    path('api/', include('ofertas.urls')),          # 👈 ofertas API
    path('api/', include('estados.urls')),          # 👈 estados API
    path('api/contacto/', include('contacto.urls')), # 👈 contacto API
]

# Render needs uploaded files to remain reachable under /media even with DEBUG=False.
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
