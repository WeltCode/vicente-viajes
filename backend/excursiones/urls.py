from django.urls import path
from .views import (
    excursiones_list,
    excursiones_detail,
    login_view,
    logout_view,
    me_view,
    users_list,
    users_detail,
    users_reset_password,
)
from .cloudinary_gallery import CloudinaryExcursionGalleryView

urlpatterns = [
    # Login token para panel admin frontend.
    path('login/', login_view),
    path('logout/', logout_view),
    path('me/', me_view),
    path('users/', users_list),
    path('users/<int:pk>/', users_detail),
    path('users/<int:pk>/reset-password/', users_reset_password),
    # CRUD excursiones.
    path('excursiones/', excursiones_list),
    path('excursiones/<int:pk>/', excursiones_detail),
    # Galería de imágenes de Cloudinary para excursiones
    path('excursiones/gallery/', CloudinaryExcursionGalleryView.as_view()),
]
