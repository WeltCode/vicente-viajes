from django.contrib import admin
from .models import mensaje_contacto

@admin.register(mensaje_contacto)
class MensajeContactoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'asunto', 'fecha_creacion', 'leido']
    list_filter = ['fecha_creacion', 'leido', 'asunto']
    search_fields = ['nombre', 'email', 'asunto', 'mensaje']
    readonly_fields = ['fecha_creacion']
    ordering = ['-fecha_creacion']
