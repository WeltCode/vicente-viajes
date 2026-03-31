from django.contrib import admin
from .models import Estado, EstadoConfig


@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    list_display = ('title', 'display_order', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)


@admin.register(EstadoConfig)
class EstadoConfigAdmin(admin.ModelAdmin):
    list_display = ('autoplay_ms', 'updated_at')
