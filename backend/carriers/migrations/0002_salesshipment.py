# Generated by Django 4.2.5 on 2023-11-22 11:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0007_delete_salesshipment'),
        ('carriers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalesShipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateHour', models.DateTimeField()),
                ('carrier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='carriers.carrier')),
                ('salesOrder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orders.salesorder')),
            ],
        ),
    ]
