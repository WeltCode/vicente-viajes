"""
Fix legacy columns that exist in the DB but not in the model.
These columns (group_size, return_date, rating, seo_title, seo_description)
were created by earlier un-migrated model changes and are NOT NULL without defaults,
causing IntegrityError on INSERT. This migration makes them all nullable.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ofertas', '0007_oferta_new_fields'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE ofertas_oferta
                    ALTER COLUMN group_size     DROP NOT NULL,
                    ALTER COLUMN return_date    DROP NOT NULL,
                    ALTER COLUMN rating         DROP NOT NULL,
                    ALTER COLUMN seo_title      DROP NOT NULL,
                    ALTER COLUMN seo_description DROP NOT NULL;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
