from django.db import migrations


def add_playa(apps, schema_editor):
    Playa = apps.get_model('playas', 'Playa')
    if not Playa.objects.exists():
        Playa.objects.create(
            title="Playa del Carmen",
            slug="playa-del-carmen",
            short_description="Una de las playas más hermosas de México",
            description="Arena blanca y aguas turquesas.",
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            location="México",
            duration="7 días",
            price="799.00",
            rating="4.9",
            group_size="Grupos desde 2 personas",
        )


def reverse_func(apps, schema_editor):
    Playa = apps.get_model('playas', 'Playa')
    Playa.objects.filter(slug="playa-del-carmen").delete()


class Migration(migrations.Migration):

    dependencies = [
        ('playas', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_playa, reverse_func),
    ]
