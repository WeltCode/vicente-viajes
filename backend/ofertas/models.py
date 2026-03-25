# pyright: reportAttributeAccessIssue=false
# pylint: disable=protected-access
from django.db import models
from django.db.models import Max


class Oferta(models.Model):
    title = models.CharField(max_length=150)
    city = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    nights = models.CharField(max_length=50)
    discount = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    validity = models.CharField(max_length=120)
    image = models.URLField()
    display_order = models.PositiveIntegerField(default=0)

    is_hot_deal = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def save(self, *args, **kwargs):
        current = float(self.price or 0)
        original = float(self.original_price or 0)

        if original > 0:
            percent = ((original - current) / original) * 100
            percent = max(0.0, percent)
            self.discount = f"-{round(percent)}%"
        else:
            self.discount = "0%"

        if self.pk is None and not self.display_order:
            manager = self.__class__._default_manager
            max_order = manager.aggregate(max_value=Max('display_order')).get('max_value') or 0
            self.display_order = max_order + 1

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.title)
