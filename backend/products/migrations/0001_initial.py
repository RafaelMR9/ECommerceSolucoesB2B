# Generated by Django 4.2.1 on 2023-08-24 21:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(error_messages={'unique': 'Já existe uma Categoria com este Nome.'}, max_length=255, unique=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subcategory', to='products.category')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(error_messages={'unique': 'Já existe um Produto com este Nome.'}, max_length=255, unique=True)),
                ('currentStockQuantity', models.IntegerField(blank=True, null=True)),
                ('costPrice', models.FloatField()),
                ('salePrice', models.FloatField()),
                ('description', models.TextField()),
                ('image', models.ImageField(upload_to='')),
                ('packaging', models.IntegerField(default=1)),
                ('visible', models.BooleanField(default=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.category')),
            ],
        ),
    ]