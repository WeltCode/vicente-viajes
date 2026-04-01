from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth.models import User

class Excursion(models.Model):
    # Información básica
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=255)
    description = models.TextField()

    # Imagen principal (por ahora URL)
    image = models.URLField()

    # Datos de la experiencia
    location = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)  # Ej: "5 horas"
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=10, default="€")

    # Planificación
    month = models.CharField(max_length=20, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    group_size = models.CharField(max_length=100, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    itinerary = models.JSONField(null=True, blank=True)
    not_includes = models.TextField(blank=True)

    # Extras
    includes = models.TextField(
        help_text="Qué incluye la excursión (separado por líneas)"
    )

    # Control
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # SEO básico
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=255, blank=True)

    # Fechas
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        # Slug de respaldo para URLs amigables si no llega desde admin.
        if not self.slug:
            self.slug = slugify(self.title)
        if self.departure_date and self.departure_date <= timezone.localdate():
            self.is_active = False
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.FileField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Perfil de {self.user}'
