# pyright: reportAttributeAccessIssue=false
# pylint: disable=no-member
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .models import Excursion, UserProfile
from .serializers import ExcursionSerializer


def user_role(user):
    if user.is_superuser:
        return 'superuser'
    if user.is_staff:
        return 'editor'
    return 'viewer'


def get_or_create_profile(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile


def user_payload(user, request=None):
    profile = get_or_create_profile(user)
    profile_image_url = ''
    if profile.profile_image:
        raw_url = profile.profile_image.url
        profile_image_url = request.build_absolute_uri(raw_url) if request else raw_url

    return {
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name or '',
        'last_name': user.last_name or '',
        'email': user.email or '',
        'is_active': bool(user.is_active),
        'is_superuser': bool(user.is_superuser),
        'is_staff': bool(user.is_staff),
        'role': user_role(user),
        'profile_image_url': profile_image_url,
    }


def apply_role(user, role):
    role_value = str(role or 'editor').lower().strip()
    if role_value == 'superuser':
        user.is_superuser = True
        user.is_staff = True
    elif role_value == 'viewer':
        user.is_superuser = False
        user.is_staff = False
    else:
        user.is_superuser = False
        user.is_staff = True


def can_manage_content(user):
    return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))


def parse_bool(value, default=False):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ['true', '1', 'yes', 'on']


@api_view(['POST'])
@permission_classes([])
def login_view(request):
    """Autentica usuario admin y devuelve token reutilizable por el frontend."""
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

    if not user.is_active:
        return Response(
            {'error': 'User inactive'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    token, _ = Token.objects.get_or_create(user=user)  # pyright: ignore[reportAttributeAccessIssue]
    return Response({'token': token.key, 'user': user_payload(user, request=request)})


@api_view(['GET', 'PATCH'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def me_view(request):
    if not request.user or not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        return Response(user_payload(request.user, request=request))

    profile = get_or_create_profile(request.user)

    if 'first_name' in request.data:
        request.user.first_name = str(request.data.get('first_name') or '').strip()
    if 'last_name' in request.data:
        request.user.last_name = str(request.data.get('last_name') or '').strip()
    if 'email' in request.data:
        request.user.email = str(request.data.get('email') or '').strip()

    password = str(request.data.get('password') or '').strip()
    if password:
        request.user.set_password(password)

    if parse_bool(request.data.get('remove_profile_image')):
        if profile.profile_image:
            profile.profile_image.delete(save=False)
        profile.profile_image = None

    incoming_image = request.FILES.get('profile_image') or request.data.get('profile_image')
    if incoming_image:
        profile.profile_image = incoming_image

    request.user.save()
    profile.save()
    return Response(user_payload(request.user, request=request))


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def users_list(request):
    if not request.user or not request.user.is_authenticated or not request.user.is_superuser:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        users = User.objects.all().order_by('username')
        return Response([user_payload(item, request=request) for item in users])

    username = str(request.data.get('username') or '').strip()
    password = str(request.data.get('password') or '').strip()
    role = request.data.get('role') or 'editor'

    if not username or not password:
        return Response({'detail': 'Username y password son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

    user = User(
        username=username,
        first_name=str(request.data.get('first_name') or '').strip(),
        last_name=str(request.data.get('last_name') or '').strip(),
        email=str(request.data.get('email') or '').strip(),
        is_active=parse_bool(request.data.get('is_active'), default=True),
    )
    apply_role(user, role)
    user.set_password(password)
    user.save()
    profile = get_or_create_profile(user)
    incoming_image = request.FILES.get('profile_image') or request.data.get('profile_image')
    if incoming_image:
        profile.profile_image = incoming_image
        profile.save()
    Token.objects.get_or_create(user=user)  # pyright: ignore[reportAttributeAccessIssue]
    return Response(user_payload(user, request=request), status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def users_detail(request, pk):
    if not request.user or not request.user.is_authenticated or not request.user.is_superuser:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        username = request.data.get('username')
        if username:
            normalized = str(username).strip()
            if normalized and User.objects.exclude(pk=user.pk).filter(username=normalized).exists():
                return Response({'detail': 'El username ya existe'}, status=status.HTTP_400_BAD_REQUEST)
            user.username = normalized

        if 'first_name' in request.data:
            user.first_name = str(request.data.get('first_name') or '').strip()
        if 'last_name' in request.data:
            user.last_name = str(request.data.get('last_name') or '').strip()
        if 'email' in request.data:
            user.email = str(request.data.get('email') or '').strip()
        if 'is_active' in request.data:
            user.is_active = parse_bool(request.data.get('is_active'))
        if 'role' in request.data:
            apply_role(user, request.data.get('role'))
        password = str(request.data.get('password') or '').strip()
        if password:
            user.set_password(password)

        profile = get_or_create_profile(user)
        if parse_bool(request.data.get('remove_profile_image')):
            if profile.profile_image:
                profile.profile_image.delete(save=False)
            profile.profile_image = None

        incoming_image = request.FILES.get('profile_image') or request.data.get('profile_image')
        if incoming_image:
            profile.profile_image = incoming_image

        user.save()
        profile.save()
        return Response(user_payload(user, request=request))

    if user.pk == request.user.pk:
        return Response({'detail': 'No puedes eliminar tu propio usuario'}, status=status.HTTP_400_BAD_REQUEST)

    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def users_reset_password(request, pk):
    if not request.user or not request.user.is_authenticated or not request.user.is_superuser:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    new_password = str(request.data.get('password') or '').strip()
    if not new_password:
        return Response({'detail': 'Password requerido'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save(update_fields=['password'])
    Token.objects.get_or_create(user=user)  # pyright: ignore[reportAttributeAccessIssue]
    return Response({'detail': 'Password actualizado'})


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def excursiones_list(request):
    if request.method == 'GET':
        # Publico: solo activas. Admin autenticado: listado completo.
        if request.user and request.user.is_authenticated:
            excursiones = Excursion.objects.all()  # pyright: ignore[reportAttributeAccessIssue]
        else:
            excursiones = Excursion.objects.filter(is_active=True)  # pyright: ignore[reportAttributeAccessIssue]
        serializer = ExcursionSerializer(excursiones, many=True)
        return Response(serializer.data)

    if not can_manage_content(request.user):
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    serializer = ExcursionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def excursiones_detail(request, pk):
    # Endpoint detalle: lectura puntual, edicion y borrado por id.
    try:
        excursion = Excursion.objects.get(pk=pk)  # pyright: ignore[reportAttributeAccessIssue]
    except Excursion.DoesNotExist:  # pyright: ignore[reportAttributeAccessIssue]
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExcursionSerializer(excursion)
        return Response(serializer.data)

    if request.method == 'PUT':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ExcursionSerializer(excursion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if not can_manage_content(request.user):
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        excursion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
