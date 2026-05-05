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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import MensajeContactoSerializer

logger = logging.getLogger(__name__)

BRAND_NAME = 'Vicente Viajes'
BRAND_DOMAIN = 'VicenteViajes.com'
RESEND_API_URL = 'https://api.resend.com/emails'


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
def enviar_mensaje_contacto(request):
    """Recibe contacto publico, persiste en DB y notifica por email."""
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
