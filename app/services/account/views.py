from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpRequest
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views import View
from inertia import InertiaResponse, location
from inertia import render as inertia_render

from .forms import ProfileForm


class ProfileEditView(LoginRequiredMixin, View):
    login_url = "login"

    def handle_no_permission(self):
        return location(reverse(self.login_url))

    def _build_props(self, user, form=None):
        data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": getattr(user, "phone", None),
            "created_at": user.created_at.isoformat()
            if getattr(user, "created_at", None)
            else None,
        }

        if form:
            data.update(
                {
                    "first_name": form.data.get("first_name", ""),
                    "last_name": form.data.get("last_name", ""),
                    "phone": form.data.get("phone", ""),
                    "errors": form.errors,
                }
            )

        return data

    def _get_safe_next_url(self, request):
        candidate = request.POST.get("next") or request.META.get("HTTP_REFERER")
        if candidate and url_has_allowed_host_and_scheme(
            url=candidate,
            allowed_hosts={request.get_host()},
            require_https=request.is_secure(),
        ):
            return candidate
        return None

    def get(self, request: HttpRequest) -> InertiaResponse:
        return inertia_render(
            request,
            "ProfileEdit",
            props=self._build_props(request.user),
        )

    def post(self, request: HttpRequest) -> InertiaResponse:
        form = ProfileForm(request.POST, instance=request.user)

        if not form.is_valid():
            resp = inertia_render(
                request,
                "ProfileEdit",
                props=self._build_props(request.user, form=form),
            )
            resp.status_code = 422
            return resp

        form.save()

        next_url = self._get_safe_next_url(request)
        return location(next_url or reverse("account_profile_edit"))
