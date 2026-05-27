"""
Sube imágenes estáticas (equipo + logo) a Cloudflare Images con custom IDs.
Ejecutar una sola vez desde la carpeta backend/:
    python upload_static_images.py
"""
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

ACCOUNT_ID  = os.environ["CLOUDFLARE_ACCOUNT_ID"]
API_TOKEN   = os.environ["CLOUDFLARE_API_TOKEN"]
ACCOUNT_HASH = os.environ["CLOUDFLARE_IMAGES_ACCOUNT_HASH"]
API_V1 = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/images/v1"
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# Imágenes a subir: (URL origen, custom ID en Cloudflare)
IMAGES = [
    (
        "https://res.cloudinary.com/djtgfq4ec/image/upload/v1777417406/maria_yyeb4x.png",
        "Vicente Viajes/Usuarios/maria",
    ),
    (
        "https://res.cloudinary.com/djtgfq4ec/image/upload/v1777417406/jonathan_dw28tw.png",
        "Vicente Viajes/Usuarios/jonathan",
    ),
    (
        "https://res.cloudinary.com/djtgfq4ec/image/upload/v1777417406/ray_pvsnpa.png",
        "Vicente Viajes/Usuarios/ray",
    ),
    (
        "https://res.cloudinary.com/da6ggvegj/image/upload/v1760310551/solo_logo_nv0q0b.png",
        "WeltBrave/logo",
    ),
]


def upload(url: str, custom_id: str) -> bool:
    resp = requests.post(
        API_V1,
        headers=HEADERS,
        files={"url": (None, url), "id": (None, custom_id)},
        timeout=60,
    )
    data = resp.json()
    if data.get("success"):
        cf_url = f"https://imagedelivery.net/{ACCOUNT_HASH}/{custom_id.replace(' ', '%20')}/public"
        print(f"  ✓  {custom_id}")
        print(f"     → {cf_url}")
        return True
    else:
        errors = data.get("errors", [])
        # ID duplicado → ya existe, no es error
        if any("already exists" in str(e).lower() or "10007" in str(e) for e in errors):
            print(f"  ~  {custom_id}  (ya existía)")
            return True
        print(f"  ✗  {custom_id}  — {errors}")
        return False


if __name__ == "__main__":
    print("Subiendo imágenes estáticas a Cloudflare Images...\n")
    ok = sum(upload(url, cid) for url, cid in IMAGES)
    print(f"\nResultado: {ok}/{len(IMAGES)} subidas correctamente")
