import json
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit  # type: ignore

from .models import NewsletterSubscription

EMAIL_REQUIRED_ERROR = "Email is required"
INVALID_EMAIL_ERROR = "Invalid email"
RATE_LIMIT_ERROR = "Too many requests. Try again later."
METHOD_NOT_ALLOWED_ERROR = "Method not allowed"


@method_decorator(csrf_exempt, name="dispatch")
class NewsletterSubscribeView(View):
    http_method_names = ["post"]

    def http_method_not_allowed(
        self,
        request: HttpRequest,
        *args: Any,
        **kwargs: Any,
    ) -> JsonResponse:
        return JsonResponse(
            {"success": False, "error": METHOD_NOT_ALLOWED_ERROR},
            status=405,
        )

    @method_decorator(ratelimit(key="ip", rate="5/m", block=False))
    def post(self, request: HttpRequest) -> JsonResponse:
        if getattr(request, "limited", False):
            return JsonResponse(
                {"success": False, "error": RATE_LIMIT_ERROR},
                status=429,
            )

        email = self._get_email(request)
        if not email:
            return JsonResponse(
                {"success": False, "error": EMAIL_REQUIRED_ERROR},
                status=400,
            )

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse(
                {"success": False, "error": INVALID_EMAIL_ERROR},
                status=400,
            )

        NewsletterSubscription.objects.update_or_create(
            email=email,
            defaults={"is_active": True},
        )
        return JsonResponse({"success": True}, status=200)

    def _get_email(self, request: HttpRequest) -> str:
        if "application/json" in (request.content_type or ""):
            try:
                payload = json.loads(request.body or "{}")
            except json.JSONDecodeError:
                return ""
            return str(payload.get("email", "")).strip()

        return str(request.POST.get("email", "")).strip()
