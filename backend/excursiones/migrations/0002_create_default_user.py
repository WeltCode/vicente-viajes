from django.db import migrations


def create_default_user(apps, _schema_editor):
    User = apps.get_model('auth', 'User')
    Token = apps.get_model('authtoken', 'Token')
    if not User.objects.filter(username='dedsec').exists():
        user = User.objects.create_user('dedsec', password='dedsec')
        # ensure token exists
        Token.objects.get_or_create(user=user)

    # sample data for excursions/playas so admin has something to edit
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
            currency="€")
        Excursion.objects.create(
            title="Safari en África",
            slug="safari-africa",
            short_description="Vive la aventura de ver a los ""big five""",
            description="7 días explorando los parques más famosos de Kenia.",
            image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
            location="Kenia",
            duration="7 días",
            price="2499.00",
            currency="€")

    Playa = None
    try:
        Playa = apps.get_model('playas', 'Playa')
    except LookupError:
        pass
    if Playa and not Playa.objects.exists():
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


def reverse_func(apps, _schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username='dedsec').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('excursiones', '0001_initial'),
        ('authtoken', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_user, reverse_func),
    ]
