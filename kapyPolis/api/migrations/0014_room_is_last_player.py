# Generated by Django 4.1.7 on 2023-04-11 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_room_game_started'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_last_player',
            field=models.BooleanField(default=True),
        ),
    ]