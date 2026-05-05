from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('excursiones', '0008_alter_userprofile_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='must_change_password',
            field=models.BooleanField(default=False),
        ),
    ]