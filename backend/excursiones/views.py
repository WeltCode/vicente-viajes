# pyright: reportAttributeAccessIssue=false
# pylint: disable=no-member
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .models import Excursion
from .serializers import ExcursionSerializer


@api_view(['POST'])
@permission_classes([])
def login_view(request):
    """Custom login endpoint that returns token"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token, _ = Token.objects.get_or_create(user=user)  # pyright: ignore[reportAttributeAccessIssue]
    return Response({'token': token.key})


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def excursiones_list(request):
    if request.method == 'GET':
        # Public listing only exposes active excursions.
        if request.user and request.user.is_authenticated:
            excursiones = Excursion.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            excursiones = Excursion.objects.filter(is_active=True)  # pyright: ignore[reportAttributeAccessIssue]
        serializer = ExcursionSerializer(excursiones, many=True)
        return Response(serializer.data)

    # POST
    serializer = ExcursionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def excursiones_detail(request, pk):
    try:
        excursion = Excursion.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Excursion.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExcursionSerializer(excursion)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ExcursionSerializer(excursion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        excursion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
