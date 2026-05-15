from django.contrib import admin
from .models import Playa
from .forms import PlayaAdminForm

@admin.register(Playa)
class PlayaAdmin(admin.ModelAdmin):
    form = PlayaAdminForm
    list_display = ('title', 'location', 'price', 'price_child', 'departure_date', 'is_active', 'created_at')
    list_filter = ('is_active', 'location')
    search_fields = ('title', 'location')
    # slug se genera automáticamente en el save() del modelo para permitir títulos duplicados
    readonly_fields = ('image_preview', 'slug')

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 200px; max-width: 300px;" />'
        return "No image"
    image_preview.short_description = 'Image Preview'
    image_preview.allow_tags = True
