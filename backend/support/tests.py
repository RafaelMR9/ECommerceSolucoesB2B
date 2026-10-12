from django.test import TestCase
from rest_framework.test import APIClient

from core.models import User

from .models import Ticket


class SupportTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.test",
            username="admin",
            password="test-password",
            is_superuser=True,
        )
        self.buyer = User.objects.create_user(
            email="buyer@example.test", username="buyer", password="test-password"
        )
        self.other = User.objects.create_user(
            email="other@example.test", username="other", password="test-password"
        )
        self.ticket = Ticket.objects.create(
            sender=self.buyer,
            recipient=self.admin,
            subject="Help please",
            content="Question",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.buyer)

    def test_ticket_creation_uses_authenticated_sender(self):
        response = self.client.post(
            "/api/support/register/",
            {
                "sender": self.other.pk,
                "recipient": self.admin.pk,
                "subject": "  Help please  ",
                "content": "Question",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        ticket = Ticket.objects.get(pk=response.data["id"])
        self.assertEqual(ticket.sender_id, self.buyer.pk)
        self.assertEqual(ticket.subject, "Help please")

    def test_short_subject_and_non_administrator_recipient_are_rejected(self):
        for subject in (None, "", "Help", "Buyer: Hey"):
            response = self.client.post(
                "/api/support/register/",
                {
                    "recipient": self.admin.pk,
                    "subject": subject,
                    "content": "Question",
                },
                format="json",
            )
            self.assertEqual(response.status_code, 400)
        response = self.client.post(
            "/api/support/register/",
            {
                "recipient": self.other.pk,
                "subject": "Help please",
                "content": "Question",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_other_accounts_cannot_read_ticket_or_conversation(self):
        self.client.force_authenticate(self.other)
        for suffix in ("detail", "responses"):
            self.assertEqual(
                self.client.get(f"/api/support/{self.ticket.pk}/{suffix}/").status_code,
                404,
            )
        self.assertEqual(
            self.client.get(f"/api/support/filter/?user={self.buyer.pk}").data, []
        )
        self.assertEqual(self.client.get("/api/support/").data, [])

    def test_reply_uses_original_recipient_and_discards_subject(self):
        response = self.client.post(
            "/api/support/register/",
            {
                "answer": self.ticket.pk,
                "sender": self.admin.pk,
                "recipient": self.other.pk,
                "subject": "Forged subject",
                "content": "Reply",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        reply = Ticket.objects.get(pk=response.data["id"])
        self.assertEqual(reply.sender_id, self.buyer.pk)
        self.assertEqual(reply.recipient_id, self.admin.pk)
        self.assertIsNone(reply.subject)

    def test_replies_must_target_original_ticket_owned_by_user(self):
        reply = Ticket.objects.create(
            answer=self.ticket, sender=self.admin, recipient=self.buyer, content="Reply"
        )
        self.assertEqual(
            self.client.post(
                "/api/support/register/",
                {
                    "answer": reply.pk,
                    "recipient": self.admin.pk,
                    "content": "Reply",
                },
                format="json",
            ).status_code,
            400,
        )
        self.client.force_authenticate(self.other)
        self.assertEqual(
            self.client.post(
                "/api/support/register/",
                {
                    "answer": self.ticket.pk,
                    "recipient": self.admin.pk,
                    "content": "Reply",
                },
                format="json",
            ).status_code,
            400,
        )

    def test_second_administrator_can_answer_automatic_notification(self):
        automatic = Ticket.objects.create(
            sender=self.admin,
            recipient=self.buyer,
            subject="Order confirmed",
            content="Confirmation",
        )
        second = User.objects.create_user(
            email="second@example.test",
            username="second",
            password="test-password",
            is_superuser=True,
        )
        self.client.force_authenticate(second)
        response = self.client.post(
            "/api/support/register/",
            {
                "answer": automatic.pk,
                "recipient": self.admin.pk,
                "content": "Reply",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["recipient"], self.buyer.pk)

    def test_administrator_can_select_account_and_invalid_id_is_validation_error(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(
            len(self.client.get(f"/api/support/filter/?user={self.buyer.pk}").data), 1
        )
        self.assertEqual(
            self.client.get("/api/support/filter/?user=invalid").status_code, 400
        )
