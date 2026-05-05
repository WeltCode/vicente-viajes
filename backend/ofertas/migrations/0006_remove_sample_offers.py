from django.db import migrations


SAMPLE_OFFER_TITLES = [
    'Paquete Caribe Todo Incluido',
    'Escapada Romantica Paris',
    'Aventura en Maldivas',
    'Roma Clasica y Toscana',
    'Resort Premium + Excursiones',
    'Madrid Gourmet y Cultura',
    'asdf',
]


def remove_sample_offers(apps, schema_editor):
    Oferta = apps.get_model('ofertas', 'Oferta')
    Oferta.objects.filter(title__in=SAMPLE_OFFER_TITLES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('ofertas', '0005_merge_0004_alter_oferta_options_0004_alter_oferta_options_alter_oferta_image'),
    ]

    operations = [
        migrations.RunPython(remove_sample_offers, migrations.RunPython.noop),
    ]