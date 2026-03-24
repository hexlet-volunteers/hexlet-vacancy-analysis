from django.urls import reverse
from inertia.test import InertiaTestCase


class DashboardTest(InertiaTestCase):
    def test_dashboard_view(self):
        self.client.get(reverse("dashboard"))
        self.assertComponentUsed("DashboardPage")
        self.assertEqual(self.props(), {})
