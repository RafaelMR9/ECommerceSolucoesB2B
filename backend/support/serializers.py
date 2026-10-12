from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = (
            "id",
            "answer",
            "originalTicket",
            "sender",
            "recipient",
            "subject",
            "content",
            "dateHour",
        )
        read_only_fields = ("sender", "originalTicket", "dateHour")

    def validate(self, data):
        user = self.context["request"].user
        answer = data.get("answer")
        if answer:
            if answer.answer_id is not None:
                raise serializers.ValidationError(
                    {"answer": "Responda à solicitação original."}
                )
            if not user.is_superuser and user.pk not in (
                answer.sender_id,
                answer.recipient_id,
            ):
                raise serializers.ValidationError(
                    {"answer": "Esta solicitação não pertence à sua conta."}
                )
            if user.is_superuser:
                recipient = (
                    answer.sender if answer.recipient.is_superuser else answer.recipient
                )
            else:
                recipient = (
                    answer.recipient if answer.sender_id == user.pk else answer.sender
                )
            data["recipient"] = recipient
            data["subject"] = None
        else:
            subject = (data.get("subject") or "").strip()
            _, separator, description = subject.partition(": ")
            if len(description if separator else subject) < 5:
                raise serializers.ValidationError(
                    {"subject": "O assunto deve ter pelo menos 5 caracteres."}
                )
            data["subject"] = subject
            if not user.is_superuser and not data["recipient"].is_superuser:
                raise serializers.ValidationError(
                    {"recipient": "Envie a solicitação à equipe de atendimento."}
                )
        return data
