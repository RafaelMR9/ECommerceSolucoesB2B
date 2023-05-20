from django.db import models

# Create your models here.
class Categoria(models.Model):
  nome = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe uma Categoria com este Nome.'})
  categoria = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategoria')

  def __str__(self):
    return self.nome
  
class Produto(models.Model):
  nome = models.CharField(max_length=255, unique=True, error_messages={'unique': 'Já existe um Produto com este Nome.'})
  quantidadeAtualEstoque = models.IntegerField()
  precoCusto = models.FloatField()
  precoVenda = models.FloatField()
  descricao = models.TextField()
  imagem = models.ImageField(upload_to='produtos/')
  disponivel = models.BooleanField(default=True)
  categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

  def __str__(self):
      return self.nome