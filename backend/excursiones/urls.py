from django.urls import path
from .views import excursiones_list, excursiones_detail, login_view

urlpatterns = [
    # Login token para panel admin frontend.
    path('login/', login_view),
    # CRUD excursiones.
    path('excursiones/', excursiones_list),
    path('excursiones/<int:pk>/', excursiones_detail),
]
