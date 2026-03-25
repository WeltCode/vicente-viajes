from django.db import migrations, models


def set_initial_order(apps, schema_editor):
    Oferta = apps.get_model('ofertas', 'Oferta')
    offers = list(Oferta.objects.all().order_by('-created_at'))
    for index, offer in enumerate(offers, start=1):
        offer.display_order = index
        offer.save(update_fields=['display_order'])


class Migration(migrations.Migration):

    dependencies = [
        ('ofertas', '0002_add_sample_offers'),
    ]

    operations = [
        migrations.AddField(
            model_name='oferta',
            name='display_order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.RunPython(set_initial_order, migrations.RunPython.noop),
    ]
