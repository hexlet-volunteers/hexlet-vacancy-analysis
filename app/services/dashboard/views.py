from django.views import View
from inertia import render as inertia_render

from .utils import (
    collect_dynamics,
    collect_kpi,
    collect_top_skills,
)


class DashboardView(View):
    def get(self, request):

        # TODO Поправить на редирект на страницу входа
        if not request.user.is_authenticated:
            return None

        return inertia_render(
            request,
            "DashboardPage",
            props={
                "kpi": collect_kpi(),
                "dynamics": collect_dynamics(),
                "top_skills": collect_top_skills(),
            },
        )
