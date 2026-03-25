from django.contrib import admin
from .models import Oferta


@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'price', 'is_hot_deal', 'is_active', 'created_at')
    list_filter = ('is_hot_deal', 'is_active', 'city')
    search_fields = ('title', 'city', 'destination')
