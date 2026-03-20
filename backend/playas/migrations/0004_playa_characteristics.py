from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playas', '0003_alter_playa_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='playa',
            name='characteristics',
            field=models.TextField(blank=True, default=''),
        ),
    ]
