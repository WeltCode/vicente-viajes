from django.db import models

class Excursion(models.Model):
    # Información básica
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=255)
    description = models.TextField()

    # Imagen principal (por ahora URL)
    image = models.URLField()

    # Datos de la experiencia
    location = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)  # Ej: "5 horas"
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=10, default="€")

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

    def __str__(self):
        return self.title
