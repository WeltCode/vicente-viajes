# pylint: disable=no-member
from django.utils import timezone
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Estado, EstadoConfig
from .serializers import EstadoSerializer, EstadoConfigSerializer
from .services import sync_expired_states


def can_manage_content(user):
    return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def estados_list(request):
    sync_expired_states()
    today = timezone.localdate()

    if request.method == 'GET':
        if request.user and request.user.is_authenticated:
            estados = Estado.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            estados = Estado.objects.filter(  # pyright: ignore[reportAttributeAccessIssue]
                is_active=True,
                excursion_date__gt=today,
            )
        serializer = EstadoSerializer(estados, many=True, context={'request': request})
        return Response(serializer.data)

    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    # Si image es una URL, pásala como image_url explícitamente
    if 'image' in request.data and isinstance(request.data['image'], str) and request.data['image'].startswith('http'):
        data['image_url'] = request.data['image']
    serializer = EstadoSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def estados_detail(request, pk):
    sync_expired_states()

    try:
        estado = Estado.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Estado.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EstadoSerializer(estado, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        # Si image es una URL, pásala como image_url explícitamente
        if 'image' in request.data and isinstance(request.data['image'], str) and request.data['image'].startswith('http'):
            data['image_url'] = request.data['image']
        serializer = EstadoSerializer(
            estado,
            data=data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(EstadoSerializer(serializer.instance, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        estado.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def estados_reorder(request):
    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    payload = request.data if isinstance(request.data, list) else []
    if not payload:
        return Response({'detail': 'Payload invalido'}, status=status.HTTP_400_BAD_REQUEST)

    for item in payload:
        estado_id = item.get('id')
        order = item.get('display_order')
        if not estado_id or order is None:
            continue
        try:
            estado = Estado.objects.get(pk=estado_id)  # pyright: ignore[reportAttributeAccessIssue]
        except Estado.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
            continue
        estado.display_order = int(order)
        estado.save()

    return Response({'detail': 'Orden actualizado'})


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def estados_config(request):
    config, _ = EstadoConfig.objects.get_or_create(pk=1)  # pyright: ignore[reportAttributeAccessIssue]

    if request.method == 'GET':
        serializer = EstadoConfigSerializer(config)
        return Response(serializer.data)

    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    serializer = EstadoConfigSerializer(config, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
