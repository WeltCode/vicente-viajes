from django.urls import path
from .views import estados_list, estados_detail, estados_reorder, estados_config

urlpatterns = [
    path('estados/', estados_list),
    path('estados/config/', estados_config),
    path('estados/reorder/', estados_reorder),
    path('estados/<int:pk>/', estados_detail),
]
