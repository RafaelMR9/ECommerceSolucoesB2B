from rest_framework import serializers

class CustomValidators:
  
  @staticmethod
  def validate_subject(value):
    partes = value.split(": ")
    subject = partes[1]
    if len(subject) < 5:
        raise serializers.ValidationError({'subject': ['O assunto deve ter pelo menos 5 caracteres.']})