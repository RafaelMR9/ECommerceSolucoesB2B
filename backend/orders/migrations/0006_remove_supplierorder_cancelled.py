# Generated by Django 4.2.5 on 2023-11-21 17:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_alter_salesorder_recieved_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supplierorder',
            name='cancelled',
        ),
    ]
