# pyright: reportAttributeAccessIssue=false
from unittest.mock import patch

from django.conf import settings
from django.core import mail
from django.test import TestCase, override_settings

from .models import mensaje_contacto


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="info@vicenteviajes.com",
    CONTACT_EMAIL_LOGO_URL="https://example.com/logo-email.png",
    CONTACT_RECIPIENT_EMAIL="info@vicenteviajes.com",
)
class ContactoEmailTests(TestCase):
    def test_contact_message_is_saved_and_sent_to_configured_mailbox(self):
        payload = {
            "nombre": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "600123123",
            "asunto": "Reserva",
            "mensaje": "Quiero información sobre un viaje a Cancún.",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(mensaje_contacto.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

        sent_email = mail.outbox[0]
        self.assertEqual(sent_email.to, [settings.CONTACT_RECIPIENT_EMAIL])
        self.assertEqual(sent_email.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(sent_email.reply_to, [payload["email"]])
        self.assertIn("VicenteViajes.com | Nuevo mensaje web", sent_email.subject)
        self.assertIn(payload["mensaje"], sent_email.body)
        self.assertEqual(len(sent_email.alternatives), 1)
        self.assertIn("Nuevo mensaje web", sent_email.alternatives[0][0])

    def test_invalid_contact_payload_does_not_send_email(self):
        payload = {
            "nombre": "",
            "email": "correo-invalido",
            "telefono": "",
            "asunto": "",
            "mensaje": "",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(mensaje_contacto.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    @patch("contacto.views.EmailMultiAlternatives.send", side_effect=TimeoutError("timed out"))
    def test_email_timeout_still_returns_created_when_message_is_saved(self, _mock_send):
        payload = {
            "nombre": "Ana López",
            "email": "ana@example.com",
            "telefono": "600123456",
            "asunto": "Consulta",
            "mensaje": "Necesito más detalles sobre una excursión.",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(mensaje_contacto.objects.count(), 1)
        self.assertFalse(response.json()["email_sent"])
        self.assertIn("warning", response.json())

    def test_contact_email_html_highlights_selected_subject(self):
        payload = {
            "nombre": "Lucía Martín",
            "email": "lucia@example.com",
            "telefono": "",
            "asunto": "Presupuesto Luna de Miel",
            "mensaje": "Queremos una propuesta para viajar en septiembre.",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        sent_email = mail.outbox[0]
        html_body, mimetype = sent_email.alternatives[0]
        self.assertEqual(mimetype, "text/html")
        self.assertIn(payload["asunto"], html_body)
        self.assertIn("Recibido desde VicenteViajes.com", html_body)
        self.assertIn("https://example.com/logo-email.png", html_body)
        self.assertNotIn("data:image/png;base64", html_body)
