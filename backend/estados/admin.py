from django.contrib import admin
from .models import Estado, EstadoConfig
from .forms import EstadoAdminForm


@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    form = EstadoAdminForm
    list_display = ('title', 'display_order', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)

    # Mostrar vista previa de imagen en el admin
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 200px; max-width: 300px;" />'
        return "No image"
    image_preview.short_description = 'Image Preview'
    image_preview.allow_tags = True


@admin.register(EstadoConfig)
class EstadoConfigAdmin(admin.ModelAdmin):
    list_display = ('autoplay_ms', 'updated_at')
