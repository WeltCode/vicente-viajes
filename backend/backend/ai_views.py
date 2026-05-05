import base64
import json
import re

import anthropic
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.authentication import AdminTokenAuthentication

# ---------------------------------------------------------------------------
# Prompt principal enviado a Claude
# ---------------------------------------------------------------------------
EXTRACT_PROMPT = """Analiza esta imagen de un cartel, folleto o poster turístico y extrae toda la información visible.

Devuelve ÚNICAMENTE un objeto JSON válido (sin texto adicional, sin bloques markdown) con la estructura correspondiente al tipo de contenido detectado:

--- EXCURSIÓN o TOUR ---
{
  "detected_type": "excursion",
  "title": "nombre del tour",
  "short_description": "resumen de 1-2 frases",
  "description": "descripción completa",
  "location": "destino o país",
  "price": "solo el número, sin símbolo",
  "currency": "€ o $ o la moneda que aparezca",
  "departure_date": "YYYY-MM-DD si hay fecha concreta, vacío si no",
  "return_date": "YYYY-MM-DD si aparece, vacío si no",
  "month": "nombre del mes en español si aparece sin fecha exacta, vacío si no",
  "group_size": "número o texto máximo personas, vacío si no aparece",
  "rating": "número 1.0-5.0 si aparece, vacío si no",
  "includes": "elemento1\nelemento2\nelemento3",
  "not_includes": "elemento1\nelemento2",
  "itinerary": [{"day": 1, "title": "Título día", "description": "descripción", "highlights": "punto1, punto2"}],
  "seo_title": "título SEO sugerido basado en el contenido",
  "seo_description": "meta descripción SEO de 150-160 caracteres",
  "warnings": ["advertencia si algo es ambiguo o ilegible"]
}

--- OFERTA de viaje / paquete turístico ---
{
  "detected_type": "oferta",
  "title": "nombre de la oferta",
  "city": "ciudad de salida si aparece",
  "destination": "destino",
  "nights": "solo el número de noches",
  "price": "solo el número",
  "original_price": "precio original tachado si aparece, vacío si no",
  "validity": "texto de validez p.ej. Hasta 31/12/2025",
  "is_hot_deal": false,
  "warnings": []
}

--- PLAYA o destino costero ---
{
  "detected_type": "playa",
  "title": "nombre de la playa o destino",
  "short_description": "resumen breve",
  "description": "descripción completa",
  "location": "ubicación",
  "price": "solo el número",
  "duration": "solo el número de días",
  "group_size": "número o vacío",
  "rating": "número o vacío",
  "characteristics": "característica1\ncaracterística2",
  "warnings": []
}

--- ESTADO / destino general de país o región ---
{
  "detected_type": "estado",
  "title": "nombre del destino",
  "subtitle": "subtítulo si aparece",
  "description": "descripción completa",
  "location": "país o región",
  "price": "solo el número o vacío",
  "excursion_date": "YYYY-MM-DD si aparece, vacío si no",
  "warnings": []
}

Reglas estrictas:
- Responde SOLO con el JSON. Sin markdown, sin texto extra antes ni después.
- Los precios son solo el número (p.ej. "1250" no "1.250 €").
- Si no puedes leer un campo déjalo como cadena vacía "".
- No inventes información que no esté en la imagen.
- Si hay ambigüedad sobre el tipo, elige el más probable.
"""


@api_view(["POST"])
@authentication_classes([AdminTokenAuthentication])
@permission_classes([IsAuthenticated])
def extract_poster(request):
    """
    POST /api/ai/extract-poster/
    Campos multipart: image (archivo), content_type (opcional: excursion|oferta|playa|estado)
    Devuelve los datos extraídos del cartel por Claude.
    """
    api_key = getattr(settings, "ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        return Response(
            {"error": "ANTHROPIC_API_KEY no está configurada en el servidor."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    image_file = request.FILES.get("image")
    if not image_file:
        return Response(
            {"error": 'Se requiere un archivo de imagen en el campo "image".'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validar tipo MIME
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    mime_type = (image_file.content_type or "image/jpeg").split(";")[0].strip().lower()
    if mime_type not in allowed_types:
        return Response(
            {"error": f"Tipo de imagen no soportado: {mime_type}. Usa JPEG, PNG, GIF o WEBP."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validar tamaño máximo 5 MB
    if image_file.size > 5 * 1024 * 1024:
        return Response(
            {"error": "La imagen no puede superar los 5 MB."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    image_data = base64.standard_b64encode(image_file.read()).decode("utf-8")

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": mime_type,
                                "data": image_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": EXTRACT_PROMPT,
                        },
                    ],
                }
            ],
        )
    except anthropic.AuthenticationError:
        return Response(
            {"error": "Clave de API de Anthropic inválida o expirada."},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except anthropic.RateLimitError:
        return Response(
            {"error": "Límite de peticiones a Claude alcanzado. Inténtalo en unos minutos."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )
    except anthropic.APIError as exc:
        return Response(
            {"error": f"Error de la API de Claude: {exc}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    raw_text = message.content[0].text.strip()

    # Extraer el primer bloque JSON de la respuesta
    json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if not json_match:
        return Response(
            {"error": "Claude no devolvió un JSON válido.", "raw": raw_text},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    try:
        extracted = json.loads(json_match.group())
    except json.JSONDecodeError:
        return Response(
            {"error": "No se pudo parsear la respuesta de Claude.", "raw": raw_text},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(extracted, status=status.HTTP_200_OK)
