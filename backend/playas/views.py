# pylint: disable=no-member
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from backend.authentication import AdminTokenAuthentication

from .models import Playa
from .serializers import PlayaSerializer


def can_manage_content(user):
    return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))


@api_view(['GET', 'POST'])
@authentication_classes([AdminTokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def playas_list(request):
    if request.method == 'GET':
        # Publico: solo activas. Admin autenticado: listado completo.
        if request.user and request.user.is_authenticated:
            playas = Playa.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            playas = Playa.objects.filter(is_active=True)  # pyright: ignore[reportAttributeAccessIssue]
        serializer = PlayaSerializer(playas, many=True)
        return Response(serializer.data)

    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    serializer = PlayaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([AdminTokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def playas_detail(request, pk):
    # Endpoint detalle: lectura puntual, edicion y borrado por id.
    try:
        playa = Playa.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Playa.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PlayaSerializer(playa)
        return Response(serializer.data)

    if request.method == 'PUT':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PlayaSerializer(playa, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        playa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
