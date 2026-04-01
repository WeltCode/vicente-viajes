import logging
from threading import Thread

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.conf import settings
from smtplib import SMTPException
from .serializers import MensajeContactoSerializer

logger = logging.getLogger(__name__)


def _build_contact_email(validated_data):
    asunto = f"Nuevo mensaje de contacto: {validated_data['asunto']}"
    mensaje_email = f"""
Nuevo mensaje de contacto recibido:

Nombre: {validated_data['nombre']}
Email: {validated_data['email']}
Teléfono: {validated_data['telefono'] or 'No proporcionado'}
Asunto: {validated_data['asunto']}

Mensaje:
{validated_data['mensaje']}
    """.strip()

    return EmailMessage(
        subject=asunto,
        body=mensaje_email,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT_EMAIL],
        reply_to=[validated_data['email']],
    )


def _send_contact_notification(validated_data):
    try:
        email = _build_contact_email(validated_data)
        email.send(fail_silently=False)
        logger.info("Notificación de contacto enviada a %s", settings.CONTACT_RECIPIENT_EMAIL)
    except (SMTPException, OSError, ValueError, TimeoutError) as e:
        logger.warning("No se pudo enviar la notificación de contacto por email: %s", e)

@api_view(['POST'])
@permission_classes([AllowAny])
def enviar_mensaje_contacto(request):
    """Recibe contacto publico, persiste en DB y notifica por email."""
    serializer = MensajeContactoSerializer(data=request.data)
    
    if serializer.is_valid():
        # Primero se persiste el mensaje para no perder trazabilidad.
        serializer.save()
        
        # El email se intenta enviar en segundo plano para evitar timeouts en la respuesta.
        validated_data = dict(serializer.validated_data)

        try:
            Thread(target=_send_contact_notification, args=(validated_data,), daemon=True).start()
            email_queued = True
        except RuntimeError as e:
            logger.warning("No se pudo iniciar el envío asíncrono del email de contacto: %s", e)
            email_queued = False

        return Response(
            {
                'message': 'Mensaje recibido correctamente. Te responderemos pronto.',
                'email_queued': email_queued,
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
