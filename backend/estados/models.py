# pyright: reportAttributeAccessIssue=false
# pylint: disable=protected-access
from django.db import models
from django.db.models import Max
from django.utils import timezone


class Estado(models.Model):
    title = models.CharField(max_length=120, blank=True, default='')
    subtitle = models.CharField(max_length=160, blank=True, default='')
    image = models.FileField(upload_to='estados/')
    excursion_date = models.DateField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['excursion_date', 'display_order', '-created_at']

    @property
    def is_expired(self):
        return bool(self.excursion_date and self.excursion_date <= timezone.localdate())

    def save(self, *args, **kwargs):
        if self.pk is None and not self.display_order:
            manager = self.__class__._default_manager
            max_order = manager.aggregate(max_value=Max('display_order')).get('max_value') or 0
            self.display_order = max_order + 1

        if self.is_expired:
            self.is_active = False

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.title or f'Estado {self.pk}')


class EstadoConfig(models.Model):
    autoplay_ms = models.PositiveIntegerField(default=3200)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        self.autoplay_ms = max(1200, int(self.autoplay_ms or 3200))
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return 'Configuracion de Estados'
