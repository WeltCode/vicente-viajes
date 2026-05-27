"""
Backend de almacenamiento Django para Cloudflare Images.
Reemplaza a django-cloudinary-storage + cloudinary SDK.

URL de entrega: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/public
API base:       https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1
"""

import os
import re
import uuid
import urllib.parse
import requests
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible

CF_API_V1 = "https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1"
CF_API_V2 = "https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v2"
CF_DELIVERY = "https://imagedelivery.net/{account_hash}"


@deconstructible
class CloudflareImagesStorage(Storage):
    """
    Storage backend que sube, sirve y elimina imágenes en Cloudflare Images.

    Usa custom IDs con estructura de carpetas para mantener la misma
    organización que tenía Cloudinary:
        Vicente Viajes/excursiones/nombre-imagen.jpg
        Vicente Viajes/estados/nombre-imagen.jpg
        Vicente Viajes/playas/nombre-imagen.jpg
        Vicente Viajes/ofertas/nombre-imagen.jpg
        Vicente Viajes/Usuarios/nombre-imagen.jpg
    """

    def __init__(self):
        self.account_id   = os.environ["CLOUDFLARE_ACCOUNT_ID"]
        self.api_token    = os.environ["CLOUDFLARE_API_TOKEN"]
        self.account_hash = os.environ["CLOUDFLARE_IMAGES_ACCOUNT_HASH"]
        self._api_v1      = CF_API_V1.format(account_id=self.account_id)
        self._api_v2      = CF_API_V2.format(account_id=self.account_id)
        self._headers     = {"Authorization": f"Bearer {self.api_token}"}

    # ──────────────────────────────────────────────────────────────────────────
    # NOMBRE ÚNICO — evita colisiones de custom ID en CF
    # ──────────────────────────────────────────────────────────────────────────
    def get_available_name(self, name, max_length=None):
        """
        Inyecta un sufijo UUID corto en el nombre de archivo para garantizar
        que el custom ID en Cloudflare Images sea siempre único.
        Ejemplo: 'Vicente Viajes/ofertas/playa.jpg'
               → 'Vicente Viajes/ofertas/playa_a3f9c2d1.jpg'
        """
        dir_name, file_name = os.path.split(name.replace("\\", "/"))
        file_root, file_ext = os.path.splitext(file_name)
        unique = uuid.uuid4().hex[:8]
        unique_name = f"{file_root}_{unique}{file_ext}"
        return f"{dir_name}/{unique_name}" if dir_name else unique_name

    # ──────────────────────────────────────────────────────────────────────────
    # SUBIDA
    # ──────────────────────────────────────────────────────────────────────────
    def _save(self, name, content):
        """
        Sube un archivo a Cloudflare Images usando name como custom ID.
        name = 'Vicente Viajes/excursiones/mi-imagen.jpg'
        Devuelve el custom ID que se guarda en la base de datos.
        """
        custom_id = name.replace("\\", "/").strip("/")

        resp = requests.post(
            self._api_v1,
            headers=self._headers,
            files={"file": (os.path.basename(name), content)},
            data={"id": custom_id},
            timeout=60,
        )
        resp.raise_for_status()
        result = resp.json()
        if not result.get("success"):
            raise Exception(
                f"Cloudflare Images: upload fallido — {result.get('errors')}"
            )
        return result["result"]["id"]

    # ──────────────────────────────────────────────────────────────────────────
    # URL DE SERVICIO
    # ──────────────────────────────────────────────────────────────────────────
    def url(self, name):
        """
        Construye la URL pública de entrega.
        https://imagedelivery.net/<HASH>/<IMAGE_ID>/public

        Maneja tres formatos de entrada:
          1. URL completa (http...): se devuelve tal cual
          2. Path Cloudinary (image/upload/v123/folder/name.jpg): extrae el public_id
          3. Public ID limpio (Vicente Viajes/excursiones/xyz): se usa directamente
        """
        if not name:
            return ""
        name_str = str(name)
        # Si ya es una URL completa, devolverla tal cual
        if name_str.startswith("http"):
            return name_str
        # Normalizar formato Cloudinary: "image/upload/v1234567/folder/name.jpg" → "folder/name"
        cloudinary_match = re.match(r'^image/upload/v\d+/(.+)$', name_str)
        if cloudinary_match:
            name_str = re.sub(r'\.[a-zA-Z]{2,4}$', '', cloudinary_match.group(1))
        encoded = urllib.parse.quote(name_str, safe="/")
        return f"{CF_DELIVERY.format(account_hash=self.account_hash)}/{encoded}/public"

    # ──────────────────────────────────────────────────────────────────────────
    # ELIMINACIÓN
    # ──────────────────────────────────────────────────────────────────────────
    def delete(self, name):
        """Elimina una imagen de Cloudflare Images por su ID."""
        if not name:
            return
        encoded_id = urllib.parse.quote(str(name), safe="")
        resp = requests.delete(
            f"{self._api_v1}/{encoded_id}",
            headers=self._headers,
            timeout=30,
        )
        # 404 = ya no existe → no es error crítico
        if resp.status_code not in (200, 404):
            resp.raise_for_status()

    # ──────────────────────────────────────────────────────────────────────────
    # LISTADO (para la galería del admin)
    # ──────────────────────────────────────────────────────────────────────────
    def list_images(self, folder_prefix=None, per_page=100, page=1):
        """
        Lista imágenes almacenadas en Cloudflare Images.
        Usa la API v2 que soporta filtrado por prefijo (carpeta).
        Devuelve lista de dicts con 'id', 'url', 'filename'.
        """
        params = {"per_page": per_page, "page": page}
        resp = requests.get(
            self._api_v2,
            headers=self._headers,
            params=params,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        images = data.get("result", {}).get("images", [])

        # Filtrar por prefijo de carpeta si se especifica
        if folder_prefix:
            images = [
                img for img in images
                if str(img.get("id", "")).startswith(folder_prefix)
            ]

        return [
            {
                "id":       img["id"],
                "url":      self.url(img["id"]),
                "filename": img.get("filename", os.path.basename(img["id"])),
                "uploaded": img.get("uploaded", ""),
            }
            for img in images
        ]

    # ──────────────────────────────────────────────────────────────────────────
    # MÍNIMOS REQUERIDOS POR DJANGO STORAGE
    # ──────────────────────────────────────────────────────────────────────────
    def exists(self, name):
        """
        Devuelve False para permitir que Django suba siempre.
        Cloudflare Images rechaza automáticamente duplicados con el mismo ID.
        """
        return False

    def _open(self, name, mode="rb"):
        raise NotImplementedError(
            "CloudflareImagesStorage no soporta apertura directa de archivos."
        )
