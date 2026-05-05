import os
import cloudinary
from cloudinary import api
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from backend.authentication import AdminTokenAuthentication

class CloudinaryExcursionGalleryView(APIView):
    """
    Devuelve la lista de imágenes de la carpeta de excursiones en Cloudinary.
    """
    authentication_classes = [AdminTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            folder_param = request.query_params.get('folder', 'excursiones').strip().lower()
            # Mapear a las carpetas reales de Cloudinary
            folder_map = {
                'excursiones': 'Vicente Viajes/excursiones',
                'playas': 'Vicente Viajes/playas',
                'ofertas': 'Vicente Viajes/ofertas',
                'estados': 'Vicente Viajes/estados',
            }
            folder = folder_map.get(folder_param, 'Vicente Viajes/excursiones')
            resources = api.resources(type='upload', prefix=folder, max_results=100)
            images = [
                {
                    'url': r['secure_url'],
                    'public_id': r['public_id'],
                    'format': r['format'],
                    'bytes': r['bytes'],
                    'width': r['width'],
                    'height': r['height'],
                }
                for r in resources.get('resources', [])
            ]
            return Response({'images': images})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
