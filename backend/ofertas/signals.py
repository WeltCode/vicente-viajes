import logging

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Oferta

logger = logging.getLogger(__name__)


def _destroy_cf_image(image_id):
    """Elimina una imagen de Cloudflare Images por su ID. Silencia errores."""
    if not image_id:
        return
    try:
        from backend.cloudflare_storage import CloudflareImagesStorage
        CloudflareImagesStorage().delete(str(image_id))
        logger.info("Cloudflare: imagen eliminada → %s", image_id)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Cloudflare: no se pudo eliminar %s — %s", image_id, exc)


@receiver(post_delete, sender=Oferta)
def delete_oferta_image_on_delete(sender, instance, **kwargs):
    """Elimina la imagen de Cloudflare cuando se borra una oferta."""
    if instance.image:
        _destroy_cf_image(str(instance.image))


@receiver(pre_save, sender=Oferta)
def delete_old_oferta_image_on_update(sender, instance, **kwargs):
    """Elimina la imagen anterior de Cloudflare cuando se reemplaza por una nueva."""
    if not instance.pk:
        return
    try:
        old = Oferta.objects.get(pk=instance.pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Oferta.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return

    old_id = str(old.image) if old.image else None
    new_id = str(instance.image) if instance.image else None

    if old_id and old_id != new_id:
        _destroy_cf_image(old_id)
