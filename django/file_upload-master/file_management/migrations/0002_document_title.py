# Generated by Django 5.1.1 on 2024-09-25 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='title',
            field=models.CharField(default='', max_length=100),
        ),
    ]