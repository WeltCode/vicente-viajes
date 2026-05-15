from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ofertas', '0006_remove_sample_offers'),
    ]

    operations = [
        migrations.AddField(
            model_name='oferta',
            name='price_child',
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True,
                help_text='Precio niños 2-10 años, mayores de 65 y personas con discapacidad'
            ),
        ),
        migrations.AddField(
            model_name='oferta',
            name='image_format',
            field=models.CharField(
                choices=[('A4', 'A4 (Retrato)'), ('1:1', 'Cuadrada 1:1')],
                default='A4', max_length=10,
                help_text='Formato de la imagen del cartel'
            ),
        ),
        migrations.AddField(
            model_name='oferta',
            name='month',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='oferta',
            name='return_time',
            field=models.CharField(blank=True, max_length=20, help_text='Hora de regreso, p.ej. 23:59'),
        ),
        migrations.AddField(
            model_name='oferta',
            name='hotel',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='oferta',
            name='departure_info',
            field=models.TextField(blank=True, help_text='Puntos de salida con horarios, uno por línea'),
        ),
        # Hacer city, nights y validity opcionales
        migrations.AlterField(
            model_name='oferta',
            name='city',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AlterField(
            model_name='oferta',
            name='nights',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='oferta',
            name='validity',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AlterField(
            model_name='oferta',
            name='original_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]

