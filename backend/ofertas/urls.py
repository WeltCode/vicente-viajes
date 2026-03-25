from django.urls import path
from .views import ofertas_list, ofertas_detail, ofertas_reorder

urlpatterns = [
    # CRUD ofertas.
    path('ofertas/', ofertas_list),
    # Persistencia del orden visual (drag and drop admin).
    path('ofertas/reorder/', ofertas_reorder),
    path('ofertas/<int:pk>/', ofertas_detail),
]
