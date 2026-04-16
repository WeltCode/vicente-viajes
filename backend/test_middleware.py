#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from estados.services import sync_expired_states
from estados.models import Estado

print("Testing sync_expired_states...")
try:
    sync_expired_states()
    print("✓ sync_expired_states executed successfully")
    print(f"Total Estados: {Estado.objects.count()}")
except Exception as e:
    print(f"✗ Error in sync_expired_states: {e}")
    import traceback
    traceback.print_exc()
