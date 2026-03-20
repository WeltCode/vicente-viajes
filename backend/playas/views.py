# pylint: disable=no-member
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Playa
from .serializers import PlayaSerializer


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def playas_list(request):
    if request.method == 'GET':
        if request.user and request.user.is_authenticated:
            playas = Playa.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            playas = Playa.objects.filter(is_active=True)  # pyright: ignore[reportAttributeAccessIssue]
        serializer = PlayaSerializer(playas, many=True)
        return Response(serializer.data)

    # POST: create new
    serializer = PlayaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def playas_detail(request, pk):
    try:
        playa = Playa.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Playa.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PlayaSerializer(playa)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = PlayaSerializer(playa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        playa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
