import logging
import json
from smtplib import SMTPException
from threading import Thread
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .serializers import MensajeContactoSerializer

logger = logging.getLogger(__name__)


class ContactoAnonThrottle(AnonRateThrottle):
    # Limita los envíos por IP del formulario público. El rate se toma de
    # REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['contacto'] en settings.py.
    scope = 'contacto'


# Nombre del campo señuelo (honeypot). Debe coincidir con el input oculto del
# frontend (Contacto.jsx). Los humanos no lo ven ni lo llenan; los bots sí.
HONEYPOT_FIELD = 'website'

BRAND_NAME = 'Vicente Viajes'
BRAND_DOMAIN = 'VicenteViajes.com'
RESEND_API_URL = 'https://api.resend.com/emails'
TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'


def _verify_turnstile(token):
    """Verifica el token de Cloudflare Turnstile contra su API.

    - Si no hay secret configurada -> no bloquea (fail-open), para no romper el
      formulario mientras no estén las claves.
    - Si hay secret pero falta el token -> bloquea.
    - Si Cloudflare no responde -> no bloquea (fail-open), para no perder mensajes
      legítimos durante una caída del servicio.
    """
    secret = str(getattr(settings, 'TURNSTILE_SECRET_KEY', '') or '').strip()
    if not secret:
        return True
    if not str(token or '').strip():
        return False
    body = json.dumps({'secret': secret, 'response': token}).encode('utf-8')
    request = Request(
        TURNSTILE_VERIFY_URL,
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            if not result.get('success'):
                # error-codes típicos: invalid-input-response (token inválido o de
                # otro site key), timeout-or-duplicate (token reusado/expirado),
                # invalid-input-secret (secret no coincide con el site key).
                logger.warning("Turnstile rechazó el token. error-codes=%s", result.get('error-codes'))
            return bool(result.get('success'))
    except (HTTPError, URLError, OSError, ValueError, TimeoutError) as e:
        logger.warning("No se pudo verificar Turnstile (se deja pasar): %s", e)
        return True


def _get_logo_src():
    return str(getattr(settings, 'CONTACT_EMAIL_LOGO_URL', '') or '').strip()


def _build_contact_email_context(data):
    asunto = data['asunto']
    telefono = data.get('telefono') or 'No proporcionado'
    return {
        'brand_name': BRAND_NAME,
        'brand_domain': BRAND_DOMAIN,
        'headline': 'Nuevo mensaje web',
        'subject_label': asunto,
        'nombre': data['nombre'],
        'email': data['email'],
        'telefono': telefono,
        'mensaje': data['mensaje'],
        'logo_src': _get_logo_src(),
    }


def _send_via_django(asunto, mensaje_email, mensaje_email_html, payload):
    email = EmailMultiAlternatives(
        subject=asunto,
        body=mensaje_email,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT_EMAIL],
        reply_to=[payload['email']],
    )
    email.attach_alternative(mensaje_email_html, 'text/html')
    email.send(fail_silently=False)


def _send_via_resend(asunto, mensaje_email, mensaje_email_html, payload):
    api_key = str(getattr(settings, 'RESEND_API_KEY', '') or '').strip()
    from_email = str(getattr(settings, 'RESEND_FROM_EMAIL', '') or '').strip()
    if not api_key or not from_email:
        raise ValueError('Falta configurar RESEND_API_KEY o RESEND_FROM_EMAIL para CONTACT_EMAIL_PROVIDER=resend.')

    body = json.dumps({
        'from': from_email,
        'to': [settings.CONTACT_RECIPIENT_EMAIL],
        'subject': asunto,
        'text': mensaje_email,
        'html': mensaje_email_html,
        'reply_to': payload['email'],
    }).encode('utf-8')
    request = Request(
        RESEND_API_URL,
        data=body,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    with urlopen(request, timeout=settings.EMAIL_TIMEOUT) as response:
        status_code = getattr(response, 'status', None) or response.getcode()
        if status_code >= 400:
            raise ValueError(f'Resend devolvió estado HTTP {status_code}.')


def _send_contact_email(asunto, mensaje_email, mensaje_email_html, payload):
    provider = str(getattr(settings, 'CONTACT_EMAIL_PROVIDER', 'django') or 'django').strip().lower()
    if provider == 'resend':
        _send_via_resend(asunto, mensaje_email, mensaje_email_html, payload)
        return
    _send_via_django(asunto, mensaje_email, mensaje_email_html, payload)

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ContactoAnonThrottle])
def enviar_mensaje_contacto(request):
    """Recibe contacto publico, persiste en DB y notifica por email."""
    # Honeypot anti-spam: campo señuelo invisible para humanos. Si llega con
    # contenido, es un bot: respondemos "ok" falso (para que no reintente ni se
    # adapte) y descartamos sin guardar en DB ni enviar email.
    if str(request.data.get(HONEYPOT_FIELD, '')).strip():
        logger.info("Contacto descartado por honeypot (posible bot).")
        return Response(
            {'message': 'Mensaje recibido correctamente', 'email_queued': True},
            status=status.HTTP_201_CREATED,
        )

    # Cloudflare Turnstile (CAPTCHA invisible). Si la secret no está configurada,
    # _verify_turnstile devuelve True y no bloquea.
    if not _verify_turnstile(request.data.get('cf_turnstile_response')):
        logger.info("Contacto rechazado: verificación Turnstile fallida.")
        return Response(
            {'error': 'No se pudo verificar que eres una persona. Recarga la página e inténtalo de nuevo.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = MensajeContactoSerializer(data=request.data)

    if serializer.is_valid():
        # Primero se persiste el mensaje para no perder trazabilidad.
        serializer.save()
        payload = serializer.validated_data

        # Renderiza el cuerpo del email en el hilo principal (necesita acceso a templates).
        asunto = f"{BRAND_DOMAIN} | Nuevo mensaje web | {payload['asunto']}"
        context = _build_contact_email_context(payload)
        mensaje_email = render_to_string('contacto/contact_notification.txt', context).strip()
        mensaje_email_html = render_to_string('contacto/contact_notification.html', context)

        def _send():
            try:
                _send_contact_email(asunto, mensaje_email, mensaje_email_html, payload)
            except (SMTPException, OSError, ValueError, TimeoutError, HTTPError, URLError) as e:
                logger.warning("No se pudo enviar la notificación de contacto por email con provider %s: %s", getattr(settings, 'CONTACT_EMAIL_PROVIDER', 'django'), e)

        if getattr(settings, 'CONTACT_EMAIL_ASYNC', True):
            Thread(target=_send, daemon=True).start()
        else:
            _send()

        return Response(
            {'message': 'Mensaje recibido correctamente', 'email_queued': True},
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
