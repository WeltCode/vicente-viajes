from django.db import migrations


def add_samples(apps, _schema_editor):
    Excursion = apps.get_model('excursiones', 'Excursion')
    if not Excursion.objects.exists():
        Excursion.objects.create(
            title="Tour Machu Picchu",
            slug="tour-machu-picchu",
            short_description="Descubre la maravilla del mundo antiguo",
            description="Un recorrido de 5 días por los sitios incas más importantes.",
            image="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
            location="Perú",
            duration="5 días",
            price="1299.00",
            currency="€",
        )
        Excursion.objects.create(
            title="Safari en África",
            slug="safari-africa",
            short_description="Vive la aventura de ver a los big five",
            description="7 días explorando los parques más famosos de Kenia.",
            image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
            location="Kenia",
            duration="7 días",
            price="2499.00",
            currency="€",
        )


def reverse_func(apps, _schema_editor):
    Excursion = apps.get_model('excursiones', 'Excursion')
    Excursion.objects.filter(slug__in=["tour-machu-picchu", "safari-africa"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('excursiones', '0002_create_default_user'),
    ]

    operations = [
        migrations.RunPython(add_samples, reverse_func),
    ]
