from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from cloudinary.models import CloudinaryField


class Playa(models.Model):
    # Entidad principal de playas para listado publico y gestion admin.
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=255)
    description = models.TextField()

    image = CloudinaryField('image', folder='Vicente Viajes/playas')

    # Localización
    location = models.CharField(max_length=100)

    # Precios
    price = models.DecimalField(max_digits=8, decimal_places=2)
    price_child = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
        help_text="Precio niños/as 2-11 años, mayores de 65 y personas con discapacidad"
    )

    # Fechas de salida
    departure_date = models.DateField(null=True, blank=True)
    month = models.CharField(max_length=20, blank=True)
    return_time = models.CharField(
        max_length=20, blank=True,
        help_text="Hora de regreso, p.ej. 23:59"
    )

    # Puntos de recogida y horarios
    departure_info = models.TextField(
        blank=True,
        help_text="Puntos de salida con horarios, uno por línea"
    )

    # Qué incluye / no incluye
    includes = models.TextField(blank=True, help_text="Qué incluye (separado por líneas)")
    not_includes = models.TextField(blank=True)

    # Otros datos
    group_size = models.CharField(max_length=100, blank=True)
    characteristics = models.TextField(blank=True, default='')

    # Control
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-departure_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            qs = Playa.objects.exclude(pk=self.pk)  # pyright: ignore[reportAttributeAccessIssue]
            counter = 1
            while qs.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        if self.departure_date and self.departure_date < timezone.localdate():
            self.is_active = False
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.title)
