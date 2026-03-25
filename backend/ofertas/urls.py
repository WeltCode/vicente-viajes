from django.urls import path
from .views import ofertas_list, ofertas_detail, ofertas_reorder

urlpatterns = [
    path('ofertas/', ofertas_list),
    path('ofertas/reorder/', ofertas_reorder),
    path('ofertas/<int:pk>/', ofertas_detail),
]
