# Generated by Django 4.1.7 on 2023-03-25 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_template'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='card_type1_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='template',
            name='card_type2_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='template',
            name='card_type3_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='template',
            name='card_type4_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='template',
            name='shop_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]