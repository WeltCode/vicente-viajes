from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from smtplib import SMTPException
from .serializers import MensajeContactoSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def enviar_mensaje_contacto(request):
    """
    Endpoint para recibir mensajes de contacto
    """
    serializer = MensajeContactoSerializer(data=request.data)
    
    if serializer.is_valid():
        # Guardar el mensaje en la base de datos
        serializer.save()
        
        # Enviar email
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
            """
            
            send_mail(
                asunto,
                mensaje_email,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_RECIPIENT_EMAIL],
                fail_silently=False,
            )
            
            return Response(
                {'message': 'Mensaje enviado correctamente'},
                status=status.HTTP_201_CREATED
            )
        except (SMTPException, OSError, ValueError) as e:
            return Response(
                {'error': f'Error al enviar el email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
