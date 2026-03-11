from django.urls import path
from .views import excursiones_list

urlpatterns = [
    path('excursiones/', excursiones_list),
]
