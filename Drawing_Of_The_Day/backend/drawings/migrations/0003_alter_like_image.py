# Generated by Django 5.0 on 2024-02-18 06:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drawings', '0002_alter_like_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='image',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='drawings.image'),
        ),
    ]
