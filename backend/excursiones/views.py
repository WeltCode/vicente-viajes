from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Excursion
from .serializers import ExcursionSerializer

@api_view(['GET'])
def excursiones_list(request):
    excursiones = Excursion.objects.all()
    serializer = ExcursionSerializer(excursiones, many=True)
    return Response(serializer.data)
