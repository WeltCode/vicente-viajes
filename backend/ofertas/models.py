# pyright: reportAttributeAccessIssue=false
# pylint: disable=protected-access
from django.db import models
from django.db.models import Max
from django.utils import timezone

IMAGE_FORMAT_CHOICES = [
    ('A4', 'A4 (Retrato)'),
    ('1:1', 'Cuadrada 1:1'),
]


class Oferta(models.Model):
    title = models.CharField(max_length=150)
    city = models.CharField(max_length=120, blank=True)
    destination = models.CharField(max_length=120)
    nights = models.CharField(max_length=50, blank=True)
    discount = models.CharField(max_length=20, default='0%')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_child = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Precio niños 2-10 años, mayores de 65 y personas con discapacidad"
    )
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    validity = models.CharField(max_length=120, blank=True)

    # Imagen y formato
    image = models.ImageField(upload_to='Vicente Viajes/ofertas/', blank=True, null=True)
    image_format = models.CharField(
        max_length=10, choices=IMAGE_FORMAT_CHOICES, default='A4',
        help_text="Formato de la imagen del cartel"
    )

    # Detalles del viaje
    description = models.TextField(blank=True)
    departure_date = models.DateField(null=True, blank=True)
    month = models.CharField(max_length=20, blank=True)
    return_time = models.CharField(max_length=20, blank=True, help_text="Hora de regreso, p.ej. 23:59")
    hotel = models.CharField(max_length=200, blank=True)
    departure_info = models.TextField(blank=True, help_text="Puntos de salida con horarios, uno por línea")
    includes = models.TextField(blank=True)
    not_includes = models.TextField(blank=True)

    display_order = models.PositiveIntegerField(default=0)
    is_hot_deal = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def save(self, *args, **kwargs):
        # Calcula descuento automáticamente
        current = float(self.price or 0)
        original = float(self.original_price or 0)
        if original > 0:
            percent = max(0.0, ((original - current) / original) * 100)
            self.discount = f"-{round(percent)}%"
        else:
            self.discount = "0%"

        # Auto-desactiva si la fecha de salida ya pasó
        if self.departure_date and self.departure_date < timezone.localdate():
            self.is_active = False

        if self.pk is None and not self.display_order:
            manager = self.__class__._default_manager
            max_order = manager.aggregate(max_value=Max('display_order')).get('max_value') or 0
            self.display_order = max_order + 1

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.title)
