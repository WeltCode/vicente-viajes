import logging
from base64 import b64encode
from pathlib import Path
from smtplib import SMTPException

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
LOGO_PATH = Path(settings.BASE_DIR).parent / 'frontend' / 'src' / 'assets' / 'images' / 'vicentelogo.png'


def _get_logo_src():
    if not LOGO_PATH.exists():
        return ''

    logo_bytes = LOGO_PATH.read_bytes()
    encoded_logo = b64encode(logo_bytes).decode('ascii')
    return f'data:image/png;base64,{encoded_logo}'


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

@api_view(['POST'])
@permission_classes([AllowAny])
def enviar_mensaje_contacto(request):
    """Recibe contacto publico, persiste en DB y notifica por email."""
    serializer = MensajeContactoSerializer(data=request.data)
    
    if serializer.is_valid():
        # Primero se persiste el mensaje para no perder trazabilidad.
        serializer.save()
        payload = serializer.validated_data
        
        # Luego se intenta enviar notificacion al correo configurado.
        try:
            asunto = f"{BRAND_DOMAIN} | Nuevo mensaje web | {payload['asunto']}"
            context = _build_contact_email_context(payload)
            mensaje_email = render_to_string('contacto/contact_notification.txt', context).strip()
            mensaje_email_html = render_to_string('contacto/contact_notification.html', context)

            email = EmailMultiAlternatives(
                subject=asunto,
                body=mensaje_email,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_RECIPIENT_EMAIL],
                reply_to=[payload['email']],
            )
            email.attach_alternative(mensaje_email_html, 'text/html')
            email.send(fail_silently=False)
            
            return Response(
                {'message': 'Mensaje enviado correctamente', 'email_sent': True},
                status=status.HTTP_201_CREATED
            )
        except (SMTPException, OSError, ValueError, TimeoutError) as e:
            # El registro queda guardado aunque falle SMTP; se registra en logs para revisión.
            logger.warning("No se pudo enviar la notificación de contacto por email: %s", e)
            return Response(
                {
                    'message': 'Mensaje recibido correctamente',
                    'warning': 'No se pudo notificar por correo en este momento, pero tu mensaje ha quedado registrado.',
                    'email_sent': False,
                },
                status=status.HTTP_201_CREATED
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
