# Generated by Django 4.1.7 on 2023-04-01 18:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_template_card_type1_mvdown_template_card_type1_mvup_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='template',
            old_name='card_type1_mvdown',
            new_name='card_type2_mvdown',
        ),
    ]
