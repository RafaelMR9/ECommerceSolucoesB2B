from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('products', '0002_alter_product_image')]
    operations = [
        migrations.AlterField(
            model_name='product', name='image',
            field=models.ImageField(max_length=255, upload_to=''),
        ),
    ]
