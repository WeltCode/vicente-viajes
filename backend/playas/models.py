from django.db import models


class Playa(models.Model):
    # Entidad principal de playas para listado publico y gestion admin.
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=255)
    description = models.TextField()

    image = models.URLField()
    location = models.CharField(max_length=100)
    duration = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    group_size = models.CharField(max_length=100, blank=True)

    characteristics = models.TextField(blank=True, default='')

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Muestra primero los registros mas recientes.
        ordering = ['-created_at']

    def __str__(self) -> str:
        # Etiqueta legible en admin y logs.
        return str(self.title)
