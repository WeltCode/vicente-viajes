from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from excursiones.models import Excursion
from playas.models import Playa
from ofertas.models import Oferta
from estados.models import Estado

@staff_member_required
def image_gallery_view(request):
    """Vista de galería para ver todas las imágenes subidas a Cloudinary"""

    # Obtener todas las imágenes de cada modelo
    excursions = Excursion.objects.exclude(image='').select_related()
    playas = Playa.objects.exclude(image='').select_related()
    ofertas = Oferta.objects.exclude(image='').select_related()
    estados = Estado.objects.exclude(image='').select_related()

    # Organizar por tipo
    images = {
        'excursiones': [
            {
                'url': obj.image.url,
                'title': obj.title,
                'type': 'Excursión',
                'id': obj.id,
                'model': 'excursion'
            } for obj in excursions if obj.image
        ],
        'playas': [
            {
                'url': obj.image.url,
                'title': obj.title,
                'type': 'Playa',
                'id': obj.id,
                'model': 'playa'
            } for obj in playas if obj.image
        ],
        'ofertas': [
            {
                'url': obj.image.url,
                'title': obj.title,
                'type': 'Oferta',
                'id': obj.id,
                'model': 'oferta'
            } for obj in ofertas if obj.image
        ],
        'estados': [
            {
                'url': obj.image.url,
                'title': obj.title or f'Estado {obj.id}',
                'type': 'Estado',
                'id': obj.id,
                'model': 'estado'
            } for obj in estados if obj.image
        ],
    }

    # Estadísticas
    total_images = sum(len(img_list) for img_list in images.values())

    context = {
        'images': images,
        'total_images': total_images,
        'title': 'Galería de Imágenes - Vicente Viajes'
    }

    return render(request, 'admin/image_gallery.html', context)