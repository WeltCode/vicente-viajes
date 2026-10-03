# pyright: reportAttributeAccessIssue=false
import json
from unittest.mock import patch

from django.conf import settings
from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings

from .models import mensaje_contacto


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="info@vicenteviajes.com",
    CONTACT_EMAIL_LOGO_URL="https://example.com/logo-email.png",
    CONTACT_RECIPIENT_EMAIL="info@vicenteviajes.com",
    CONTACT_EMAIL_PROVIDER="django",
    CONTACT_EMAIL_ASYNC=True,
    # Turnstile desactivado por defecto en los tests (fail-open); los tests que lo
    # prueban activan su propia secret con @override_settings.
    TURNSTILE_SECRET_KEY="",
)
class ContactoEmailTests(TestCase):
    def setUp(self):
        # Evita que el rate limiting (throttle) arrastre estado entre tests.
        cache.clear()

    @override_settings(TURNSTILE_SECRET_KEY="0xsecret")
    @patch("contacto.views.Thread")
    def test_turnstile_bloquea_envio_sin_token(self, mock_thread):
        """Con Turnstile activo, un envío sin token se rechaza (400), sin guardar ni email."""
        payload = {
            "nombre": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "600123123",
            "asunto": "reserva",
            "mensaje": "Quiero información sobre un viaje.",
            # sin cf_turnstile_response
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(mensaje_contacto.objects.count(), 0)
        mock_thread.assert_not_called()

    @override_settings(TURNSTILE_SECRET_KEY="0xsecret")
    @patch("contacto.views.urlopen")
    @patch("contacto.views.Thread")
    def test_turnstile_acepta_token_valido(self, mock_thread, mock_urlopen):
        """Con Turnstile activo y token válido (Cloudflare responde success), el envío pasa."""
        mock_urlopen.return_value.__enter__.return_value.read.return_value = b'{"success": true}'
        payload = {
            "nombre": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "",
            "asunto": "reserva",
            "mensaje": "Quiero información sobre un viaje.",
            "cf_turnstile_response": "token-valido-123",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(mensaje_contacto.objects.count(), 1)
        mock_thread.assert_called_once()

    @patch("contacto.views.Thread")
    def test_honeypot_descarta_spam_en_silencio(self, mock_thread):
        """Un envío con el honeypot lleno se descarta: 'ok' falso, sin guardar ni enviar email."""
        payload = {
            "nombre": "AqqVtkEAeyLsbtoqB",
            "email": "bot@example.com",
            "telefono": "5772934615",
            "asunto": "reserva",
            "mensaje": "GcmXnlUUzTOYPTCu",
            "website": "http://spam.example.com",  # honeypot lleno = bot
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)            # respuesta "ok" falsa
        self.assertEqual(mensaje_contacto.objects.count(), 0)  # NO se guarda
        mock_thread.assert_not_called()                        # NO se envía email

    @patch("contacto.views.Thread")
    def test_contact_message_is_saved_and_email_queued(self, mock_thread):
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
        self.assertTrue(response.json()["email_queued"])
        mock_thread.assert_called_once()
        mock_thread.return_value.start.assert_called_once()

    @patch("contacto.views.Thread")
    def test_email_thread_sends_correctly_when_called(self, mock_thread):
        """Ejecuta manualmente la función del hilo para verificar que el email se construye bien."""
        payload = {
            "nombre": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "600123123",
            "asunto": "Reserva",
            "mensaje": "Quiero información sobre un viaje a Cancún.",
        }

        self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        # Extraer y ejecutar la función _send que se pasó al Thread.
        send_fn = mock_thread.call_args.kwargs["target"]
        send_fn()

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

    @patch("contacto.views.Thread")
    def test_contact_email_html_highlights_selected_subject(self, mock_thread):
        payload = {
            "nombre": "Lucía Martín",
            "email": "lucia@example.com",
            "telefono": "",
            "asunto": "Presupuesto Luna de Miel",
            "mensaje": "Queremos una propuesta para viajar en septiembre.",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)

        # Ejecutar el hilo manualmente para verificar el HTML.
        send_fn = mock_thread.call_args.kwargs["target"]
        send_fn()

        sent_email = mail.outbox[0]
        html_body, mimetype = sent_email.alternatives[0]
        self.assertEqual(mimetype, "text/html")
        self.assertIn(payload["asunto"], html_body)
        self.assertIn("Recibido desde VicenteViajes.com", html_body)
        self.assertIn("https://example.com/logo-email.png", html_body)
        self.assertNotIn("data:image/png;base64", html_body)

    @override_settings(CONTACT_EMAIL_PROVIDER="resend", CONTACT_EMAIL_ASYNC=False, RESEND_API_KEY="re_test", RESEND_FROM_EMAIL="Vicente Viajes <info@vicenteviajes.com>")
    @patch("contacto.views.urlopen")
    def test_contact_message_can_send_via_resend(self, mock_urlopen):
        mock_response = mock_urlopen.return_value.__enter__.return_value
        mock_response.status = 200

        payload = {
            "nombre": "Ana López",
            "email": "ana@example.com",
            "telefono": "600000000",
            "asunto": "informacion",
            "mensaje": "Necesito detalles de un paquete.",
        }

        response = self.client.post("/api/contacto/enviar/", data=payload, content_type="application/json")

        self.assertEqual(response.status_code, 201)
        request = mock_urlopen.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_test")
        sent_payload = json.loads(request.data.decode("utf-8"))
        self.assertEqual(sent_payload["to"], [settings.CONTACT_RECIPIENT_EMAIL])
        self.assertEqual(sent_payload["reply_to"], payload["email"])
        self.assertEqual(sent_payload["from"], "Vicente Viajes <info@vicenteviajes.com>")
