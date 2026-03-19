import json

from django.core.cache import cache
from django.test import TestCase

from .models import NewsletterSubscription


class NewsletterSubscriptionModelTests(TestCase):
    def test_subscription_defaults(self):
        subscription = NewsletterSubscription.objects.create(email="user@example.com")

        self.assertEqual(subscription.email, "user@example.com")
        self.assertTrue(subscription.is_active)
        self.assertIsNotNone(subscription.created_at)


class NewsletterSubscribeViewTests(TestCase):
    subscribe_url = "/newsletter/subscribe/"
    legacy_url = "/api/subscribe"

    def setUp(self):
        cache.clear()

    def post_json(self, url: str, payload: dict, **extra):
        return self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **extra,
        )

    def test_subscribe_creates_subscription(self):
        response = self.post_json(self.subscribe_url, {"email": "user@example.com"})

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})
        self.assertTrue(
            NewsletterSubscription.objects.filter(email="user@example.com").exists()
        )

    def test_duplicate_subscription_returns_success_without_duplicate(self):
        NewsletterSubscription.objects.create(email="user@example.com")

        response = self.post_json(self.subscribe_url, {"email": "user@example.com"})

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})
        self.assertEqual(
            NewsletterSubscription.objects.filter(email="user@example.com").count(),
            1,
        )

    def test_inactive_subscription_is_reactivated(self):
        NewsletterSubscription.objects.create(
            email="user@example.com",
            is_active=False,
        )

        response = self.post_json(self.subscribe_url, {"email": "user@example.com"})

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})
        subscription = NewsletterSubscription.objects.get(email="user@example.com")
        self.assertTrue(subscription.is_active)

    def test_missing_email_returns_bad_request(self):
        response = self.post_json(self.subscribe_url, {})

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"success": False, "error": "Email is required"},
        )

    def test_invalid_email_returns_bad_request(self):
        response = self.post_json(self.subscribe_url, {"email": "invalid-email"})

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"success": False, "error": "Invalid email"},
        )

    def test_rate_limit_returns_too_many_requests(self):
        for _ in range(5):
            response = self.post_json(
                self.subscribe_url,
                {"email": "user@example.com"},
                REMOTE_ADDR="127.0.0.1",
            )
            self.assertEqual(response.status_code, 200)

        response = self.post_json(
            self.subscribe_url,
            {"email": "user@example.com"},
            REMOTE_ADDR="127.0.0.1",
        )

        self.assertEqual(response.status_code, 429)
        self.assertJSONEqual(
            response.content,
            {"success": False, "error": "Too many requests. Try again later."},
        )

    def test_legacy_alias_works(self):
        response = self.post_json(self.legacy_url, {"email": "user@example.com"})

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})
        self.assertTrue(
            NewsletterSubscription.objects.filter(email="user@example.com").exists()
        )

    def test_form_payload_is_supported(self):
        response = self.client.post(
            self.subscribe_url,
            data={"email": "user@example.com"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"success": True})
