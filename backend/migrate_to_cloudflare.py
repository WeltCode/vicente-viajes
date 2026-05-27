"""
Script de migración: Cloudinary → Cloudflare Images

Ejecutar desde el directorio backend/:
    python migrate_to_cloudflare.py

Requiere las variables de entorno de AMBOS servicios en .env:
    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
    CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_IMAGES_ACCOUNT_HASH

Qué hace:
  - Lee todos los registros con imagen de cada modelo Django
  - Para cada imagen, descarga desde Cloudinary y sube a Cloudflare
    con el mismo custom ID (= misma estructura de carpetas)
  - Reporta éxitos y errores al final
"""

import os
import sys
import django
from pathlib import Path

# ── Setup Django ──────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from dotenv import load_dotenv
load_dotenv(BASE_DIR / ".env")
django.setup()

# ── Imports tras django.setup() ───────────────────────────────────────────────
import requests
from excursiones.models import Excursion, UserProfile
from estados.models import Estado
from playas.models import Playa
from ofertas.models import Oferta

# ── Configuración Cloudflare ──────────────────────────────────────────────────
CF_ACCOUNT_ID   = os.environ["CLOUDFLARE_ACCOUNT_ID"]
CF_API_TOKEN    = os.environ["CLOUDFLARE_API_TOKEN"]
CF_ACCOUNT_HASH = os.environ["CLOUDFLARE_IMAGES_ACCOUNT_HASH"]
CF_API_URL      = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/images/v1"
CF_HEADERS      = {"Authorization": f"Bearer {CF_API_TOKEN}"}

# ── Modelos y sus carpetas ────────────────────────────────────────────────────
MIGRATION_TARGETS = [
    (Excursion,   "image", "Vicente Viajes/excursiones"),
    (Estado,      "image", "Vicente Viajes/estados"),
    (Playa,       "image", "Vicente Viajes/playas"),
    (Oferta,      "image", "Vicente Viajes/ofertas"),
    (UserProfile, "profile_image", "Vicente Viajes/Usuarios"),
]


def get_cloudinary_url(obj, field_name):
    """Devuelve la URL pública de Cloudinary para el campo de imagen."""
    field = getattr(obj, field_name, None)
    if not field:
        return None, None
    try:
        url = field.url
        public_id = str(field)   # CloudinaryField.__str__() devuelve el public_id
        return url, public_id
    except Exception:
        return None, None


def upload_to_cloudflare_from_url(cloudinary_url, custom_id):
    """
    Sube una imagen a Cloudflare Images usando su URL pública de Cloudinary.
    Cloudflare la descarga directamente, sin pasar por el servidor.
    Retorna (éxito: bool, mensaje: str)

    IMPORTANTE: Cloudflare requiere multipart/form-data incluso para subidas por URL.
    Con requests, usar files={"campo": (None, valor)} fuerza multipart sin archivo adjunto.
    """
    resp = requests.post(
        CF_API_URL,
        headers=CF_HEADERS,
        files={
            "url": (None, cloudinary_url),
            "id":  (None, custom_id),
        },
        timeout=60,
    )

    try:
        result = resp.json()
    except Exception:
        return False, f"Respuesta no JSON: {resp.status_code} {resp.text[:200]}"

    if result.get("success"):
        cf_id = result["result"]["id"]
        cf_url = f"https://imagedelivery.net/{CF_ACCOUNT_HASH}/{cf_id}/public"
        return True, cf_url

    errors = result.get("errors", [])
    # Código 5409 = imagen ya existe con ese ID → no es error crítico
    if any(e.get("code") == 5409 for e in errors):
        cf_url = f"https://imagedelivery.net/{CF_ACCOUNT_HASH}/{custom_id}/public"
        return True, f"YA EXISTÍA → {cf_url}"

    return False, str(errors)


def run_migration():
    print("=" * 65)
    print("  MIGRACIÓN: Cloudinary → Cloudflare Images")
    print("=" * 65)

    total_ok    = 0
    total_skip  = 0
    total_error = 0
    errors_log  = []

    for Model, field_name, folder in MIGRATION_TARGETS:
        model_name = Model.__name__
        qs = Model.objects.exclude(**{field_name: ""}).exclude(**{field_name: None})
        count = qs.count()

        print(f"\n▶ {model_name} [{field_name}] — {count} registros en carpeta '{folder}'")

        for obj in qs:
            cloudinary_url, public_id = get_cloudinary_url(obj, field_name)

            if not cloudinary_url or not public_id:
                print(f"   SKIP  id={obj.pk} — sin imagen")
                total_skip += 1
                continue

            # Mantener el public_id de Cloudinary como custom ID en Cloudflare
            # Esto garantiza la misma estructura de carpetas
            custom_id = public_id.strip("/")

            ok, msg = upload_to_cloudflare_from_url(cloudinary_url, custom_id)

            label = f"id={obj.pk} | {custom_id}"
            if ok:
                print(f"   ✓  {label}")
                print(f"      → {msg}")
                total_ok += 1
            else:
                print(f"   ✗  {label}")
                print(f"      ERROR: {msg}")
                total_error += 1
                errors_log.append({"model": model_name, "pk": obj.pk, "id": custom_id, "error": msg})

    # ── Resumen ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 65)
    print(f"  RESULTADO FINAL")
    print(f"  ✓ Migradas con éxito : {total_ok}")
    print(f"  ~ Omitidas (sin img) : {total_skip}")
    print(f"  ✗ Errores            : {total_error}")
    print("=" * 65)

    if errors_log:
        print("\nDETALLE DE ERRORES:")
        for e in errors_log:
            print(f"  [{e['model']} pk={e['pk']}] {e['id']} → {e['error']}")

    return total_error == 0


if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
