from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Excursion


class ExcursionExpiryTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def make_excursion(self, title, departure_date, is_active=True):
        return Excursion.objects.create(
            title=title,
            short_description=f"Resumen de {title}",
            description=f"Descripción de {title}",
            image="https://example.com/excursion.jpg",
            location="Madrid",
            duration="3 días",
            price=Decimal("199.99"),
            includes="Transporte\nGuía",
            month="Abril",
            departure_date=departure_date,
            return_date=departure_date + timedelta(days=2),
            group_size="Máx. 20 personas",
            rating=Decimal("4.5"),
            itinerary=[],
            not_includes="Seguro",
            is_featured=False,
            is_active=is_active,
        )

    def test_public_list_deactivates_and_hides_expired_excursions(self):
        expired = self.make_excursion(
            "Excursión vencida",
            timezone.localdate() - timedelta(days=1),
        )
        upcoming = self.make_excursion(
            "Excursión activa",
            timezone.localdate() + timedelta(days=4),
        )

        response = self.client.get("/api/excursiones/")

        self.assertEqual(response.status_code, 200)
        expired.refresh_from_db()
        self.assertFalse(expired.is_active)

        titles = [item["title"] for item in response.json()]
        self.assertIn(upcoming.title, titles)
        self.assertNotIn(expired.title, titles)

    def test_admin_list_keeps_expired_excursions_visible_but_marked_inactive(self):
        admin = User.objects.create_user(username="admin", password="secret123")
        admin.is_staff = True
        admin.save(update_fields=["is_staff"])

        expired = self.make_excursion(
            "Excursión admin vencida",
            timezone.localdate() - timedelta(days=2),
        )

        self.client.force_authenticate(user=admin)
        response = self.client.get("/api/excursiones/")

        self.assertEqual(response.status_code, 200)
        payload = {item["title"]: item for item in response.json()}
        self.assertIn(expired.title, payload)
        self.assertFalse(payload[expired.title]["is_active"])
