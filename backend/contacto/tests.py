from django.conf import settings
from django.core import mail
from django.test import TestCase, override_settings

from .models import mensaje_contacto


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="info@vicenteviajes.com",
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
        self.assertEqual(mensaje_contacto._default_manager.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

        sent_email = mail.outbox[0]
        self.assertEqual(sent_email.to, [settings.CONTACT_RECIPIENT_EMAIL])
        self.assertEqual(sent_email.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(sent_email.reply_to, [payload["email"]])
        self.assertIn(payload["mensaje"], sent_email.body)

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
        self.assertEqual(mensaje_contacto._default_manager.count(), 0)
        self.assertEqual(len(mail.outbox), 0)
