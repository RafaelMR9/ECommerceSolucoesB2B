# Generated by Django 4.2.5 on 2023-10-30 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(error_messages={'unique': 'Já existe um Fornecedor com este E-Mail.'}, max_length=254, unique=True)),
                ('name', models.CharField(error_messages={'unique': 'Já existe um Fornecedor com este Nome.'}, max_length=255, unique=True)),
                ('cnpj', models.CharField(error_messages={'unique': 'Já existe um Fornecedor com este CNPJ.'}, max_length=18, unique=True)),
            ],
        ),
    ]
