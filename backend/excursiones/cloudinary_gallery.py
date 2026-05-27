from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from backend.authentication import AdminTokenAuthentication
from backend.cloudflare_storage import CloudflareImagesStorage


class CloudinaryExcursionGalleryView(APIView):
    """
    Devuelve la lista de imágenes almacenadas en Cloudflare Images,
    filtradas por carpeta (excursiones, playas, ofertas, estados).
    """
    authentication_classes = [AdminTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            folder_param = request.query_params.get('folder', 'excursiones').strip().lower()
            folder_map = {
                'excursiones': 'Vicente Viajes/excursiones',
                'playas': 'Vicente Viajes/playas',
                'ofertas': 'Vicente Viajes/ofertas',
                'estados': 'Vicente Viajes/estados',
            }
            folder_prefix = folder_map.get(folder_param, 'Vicente Viajes/excursiones')
            storage = CloudflareImagesStorage()
            cf_images = storage.list_images(folder_prefix=folder_prefix, per_page=200)
            images = [
                {
                    'url': img['url'],
                    'public_id': img['id'],
                    'format': '',
                    'bytes': 0,
                    'width': 0,
                    'height': 0,
                }
                for img in cf_images
            ]
            return Response({'images': images})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
