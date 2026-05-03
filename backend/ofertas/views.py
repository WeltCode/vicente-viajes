# pylint: disable=no-member
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Oferta
from .serializers import OfertaSerializer


def can_manage_content(user):
    return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def ofertas_list(request):
    if request.method == 'GET':
        # Publico: solo ofertas activas. Admin autenticado: todas.
        if request.user and request.user.is_authenticated:
            ofertas = Oferta.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            ofertas = Oferta.objects.filter(is_active=True)  # pyright: ignore[reportAttributeAccessIssue]
        serializer = OfertaSerializer(ofertas, many=True)
        return Response(serializer.data)

    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    # Si image_url viene en el form-data, asegúrate de que se pase al serializer
    if 'image_url' in request.data:
        data['image_url'] = request.data['image_url']
    serializer = OfertaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def ofertas_detail(request, pk):
    # Endpoint detalle: lectura puntual, edicion y borrado por id.
    try:
        oferta = Oferta.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Oferta.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OfertaSerializer(oferta)
        return Response(serializer.data)

    if request.method == 'PUT':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        if 'image_url' in request.data:
            data['image_url'] = request.data['image_url']
        serializer = OfertaSerializer(oferta, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        oferta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def ofertas_reorder(request):
    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    # Espera lista: [{"id": <int>, "display_order": <int>}, ...].
    payload = request.data if isinstance(request.data, list) else []
    if not payload:
        return Response({'detail': 'Payload inválido'}, status=status.HTTP_400_BAD_REQUEST)

    for item in payload:
        oferta_id = item.get('id')
        order = item.get('display_order')
        if not oferta_id or order is None:
            continue
        try:
            oferta = Oferta.objects.get(pk=oferta_id)  # pyright: ignore[reportAttributeAccessIssue]
        except Oferta.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
            continue
        oferta.display_order = int(order)
        oferta.save()

    return Response({'detail': 'Orden actualizado'})
