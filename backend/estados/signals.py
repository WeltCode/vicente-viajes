import logging

import cloudinary.uploader
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Estado

logger = logging.getLogger(__name__)


def _destroy_cloudinary_image(public_id):
    """Elimina una imagen de Cloudinary por su public_id. Silencia errores."""
    if not public_id:
        return
    try:
        cloudinary.uploader.destroy(public_id)
        logger.info("Cloudinary: imagen eliminada → %s", public_id)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Cloudinary: no se pudo eliminar %s — %s", public_id, exc)


@receiver(post_delete, sender=Estado)
def delete_estado_image_on_delete(sender, instance, **kwargs):
    """Elimina la imagen de Cloudinary cuando se borra un estado."""
    if instance.image:
        _destroy_cloudinary_image(getattr(instance.image, 'public_id', None))


@receiver(pre_save, sender=Estado)
def delete_old_estado_image_on_update(sender, instance, **kwargs):
    """Elimina la imagen anterior de Cloudinary cuando se reemplaza por una nueva."""
    if not instance.pk:
        return
    try:
        old = Estado.objects.get(pk=instance.pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Estado.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return

    # getattr seguro: si image es un string (URL asignada directamente) no tiene .public_id
    old_public_id = getattr(old.image, 'public_id', None) if old.image else None
    new_public_id = getattr(instance.image, 'public_id', None) if instance.image else None

    if old_public_id and old_public_id != new_public_id:
        _destroy_cloudinary_image(old_public_id)
