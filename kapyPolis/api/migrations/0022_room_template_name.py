# Generated by Django 4.1.7 on 2023-04-21 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_template_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='template_name',
            field=models.CharField(default='', max_length=20),
        ),
    ]
