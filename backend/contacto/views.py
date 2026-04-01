import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.conf import settings
from smtplib import SMTPException
from .serializers import MensajeContactoSerializer

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def enviar_mensaje_contacto(request):
    """Recibe contacto publico, persiste en DB y notifica por email."""
    serializer = MensajeContactoSerializer(data=request.data)
    
    if serializer.is_valid():
        # Primero se persiste el mensaje para no perder trazabilidad.
        serializer.save()
        
        # Luego se intenta enviar notificacion al correo configurado.
        try:
            asunto = f"Nuevo mensaje de contacto: {serializer.validated_data['asunto']}"
            
            mensaje_email = f"""
Nuevo mensaje de contacto recibido:

Nombre: {serializer.validated_data['nombre']}
Email: {serializer.validated_data['email']}
Teléfono: {serializer.validated_data['telefono'] or 'No proporcionado'}
Asunto: {serializer.validated_data['asunto']}

Mensaje:
{serializer.validated_data['mensaje']}
            """.strip()

            email = EmailMessage(
                subject=asunto,
                body=mensaje_email,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_RECIPIENT_EMAIL],
                reply_to=[serializer.validated_data['email']],
            )
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
