from django.urls import path
from .views import playas_list, playas_detail

urlpatterns = [
    # CRUD playas.
    path('playas/', playas_list),
    path('playas/<int:pk>/', playas_detail),
]
