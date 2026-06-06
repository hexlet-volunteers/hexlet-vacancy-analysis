from django.views import View
from inertia import render as inertia_render

from app.services.vacancies.models import Vacancy


class MapListView(View):
    def get(self, request):
        map_data = list(Vacancy.regions.total_vacancies())

        return inertia_render(request, "MapPage", props={"mapData": map_data})
