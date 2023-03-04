# Generated by Django 4.1.7 on 2023-02-26 17:32

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_max_plaers_room_max_players'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default=api.models.generate_random_code, max_length=8, unique=True),
        ),
    ]