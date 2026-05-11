import logging

import cloudinary.uploader
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Oferta

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


@receiver(post_delete, sender=Oferta)
def delete_oferta_image_on_delete(sender, instance, **kwargs):
    """Elimina la imagen de Cloudinary cuando se borra una oferta."""
    if instance.image:
        _destroy_cloudinary_image(instance.image.public_id)


@receiver(pre_save, sender=Oferta)
def delete_old_oferta_image_on_update(sender, instance, **kwargs):
    """Elimina la imagen anterior de Cloudinary cuando se reemplaza por una nueva."""
    if not instance.pk:
        return
    try:
        old = Oferta.objects.get(pk=instance.pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Oferta.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return

    old_public_id = old.image.public_id if old.image else None
    new_public_id = instance.image.public_id if instance.image else None

    if old_public_id and old_public_id != new_public_id:
        _destroy_cloudinary_image(old_public_id)
