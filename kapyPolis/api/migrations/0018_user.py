# Generated by Django 4.1.7 on 2023-04-18 16:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_shopitem_price_max_template_number_of_rounds_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=100)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.template')),
            ],
        ),
    ]