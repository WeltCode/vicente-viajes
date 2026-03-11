from django.contrib import admin
from .models import Playa

@admin.register(Playa)
class PlayaAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'rating', 'is_active', 'created_at')
    list_filter = ('is_active', 'location')
    search_fields = ('title', 'location')
    prepopulated_fields = {'slug': ('title',)}
