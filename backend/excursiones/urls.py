from django.urls import path
from .views import excursiones_list, excursiones_detail, login_view

urlpatterns = [
    path('login/', login_view),
    path('excursiones/', excursiones_list),
    path('excursiones/<int:pk>/', excursiones_detail),
]
