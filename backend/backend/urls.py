from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('excursiones.urls')),  # 👈 excursiones API
    path('api/', include('playas.urls')),       # 👈 playas API
]
