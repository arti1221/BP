# Generated by Django 4.1.7 on 2023-05-14 14:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_player_balance_player_diff_items_amt_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_code', models.CharField(default='', max_length=8)),
                ('logged_at', models.DateTimeField(default=datetime.datetime.now)),
                ('text', models.CharField(default='', max_length=500)),
            ],
        ),
    ]
