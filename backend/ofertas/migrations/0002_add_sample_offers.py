from django.db import migrations


def add_offers(apps, schema_editor):
    Oferta = apps.get_model('ofertas', 'Oferta')
    if Oferta.objects.exists():
        return

    Oferta.objects.bulk_create([
        Oferta(
            title='Paquete Caribe Todo Incluido',
            city='Cancun, Mexico',
            destination='Cancun',
            nights='7 noches',
            discount='-32%',
            price='1299.00',
            original_price='1899.00',
            validity='Valido hasta 31 Mar',
            image='https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=True,
            is_active=True,
        ),
        Oferta(
            title='Escapada Romantica Paris',
            city='Paris, Francia',
            destination='Paris',
            nights='5 noches',
            discount='-25%',
            price='1199.00',
            original_price='1599.00',
            validity='Valido hasta 28 Feb',
            image='https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=False,
            is_active=True,
        ),
        Oferta(
            title='Aventura en Maldivas',
            city='Maldivas',
            destination='Maldivas',
            nights='6 noches',
            discount='-29%',
            price='2499.00',
            original_price='3499.00',
            validity='Ultimas plazas',
            image='https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=True,
            is_active=True,
        ),
        Oferta(
            title='Roma Clasica y Toscana',
            city='Roma, Italia',
            destination='Roma',
            nights='6 noches',
            discount='-18%',
            price='1049.00',
            original_price='1289.00',
            validity='Salida en abril',
            image='https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=False,
            is_active=True,
        ),
        Oferta(
            title='Resort Premium + Excursiones',
            city='Punta Cana',
            destination='Punta Cana',
            nights='8 noches',
            discount='-21%',
            price='1790.00',
            original_price='2290.00',
            validity='Cupos limitados',
            image='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=True,
            is_active=True,
        ),
        Oferta(
            title='Madrid Gourmet y Cultura',
            city='Madrid, Espana',
            destination='Madrid',
            nights='4 noches',
            discount='-15%',
            price='899.00',
            original_price='1059.00',
            validity='Compra anticipada',
            image='https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80',
            is_hot_deal=False,
            is_active=True,
        ),
    ])


def reverse_func(apps, schema_editor):
    Oferta = apps.get_model('ofertas', 'Oferta')
    Oferta.objects.filter(
        title__in=[
            'Paquete Caribe Todo Incluido',
            'Escapada Romantica Paris',
            'Aventura en Maldivas',
            'Roma Clasica y Toscana',
            'Resort Premium + Excursiones',
            'Madrid Gourmet y Cultura',
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('ofertas', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_offers, reverse_func),
    ]
