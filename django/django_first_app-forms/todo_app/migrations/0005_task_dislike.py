# Generated by Django 5.1 on 2024-08-31 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo_app', '0004_task_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='dislike',
            field=models.IntegerField(default=0),
        ),
    ]
