# Generated by Django 4.2.5 on 2023-11-22 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0006_remove_supplierorder_cancelled'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SalesShipment',
        ),
    ]
