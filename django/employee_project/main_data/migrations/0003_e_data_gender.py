# Generated by Django 5.1 on 2024-09-14 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_data', '0002_alter_e_data_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='e_data',
            name='gender',
            field=models.CharField(blank=True, choices=[('male', 'Male'), ('female', 'Female')], max_length=20),
        ),
    ]
