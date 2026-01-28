from django.contrib import admin
from .models import Excursion

@admin.register(Excursion)
class ExcursionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "location",
        "price",
        "is_active",
        "is_featured",
        "created_at",
    )
    list_filter = ("is_active", "is_featured", "location")
    search_fields = ("title", "location")
    prepopulated_fields = {"slug": ("title",)}
