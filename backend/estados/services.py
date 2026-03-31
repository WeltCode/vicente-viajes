# pyright: reportAttributeAccessIssue=false
# pylint: disable=protected-access
from django.utils import timezone

from .models import Estado


def sync_expired_states():
    Estado._default_manager.filter(
        is_active=True,
        excursion_date__lte=timezone.localdate(),
    ).update(is_active=False)
