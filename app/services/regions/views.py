from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.views import View
from inertia import render as inertia_render

from app.services.vacancies.models import Vacancy

from .models import Region


class RegionView(View):

    def get(self, request, region_id):
        region = get_object_or_404(Region, code=region_id)

        vacancies = Vacancy.objects.filter(
            region_code=region.code
        ).select_related('company', 'city', 'platform')

        paginator = Paginator(vacancies, 25)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)

        vacancies_data = [
            {
                "id": vacancy.id,
                "title": vacancy.title,
                "company": vacancy.company.name if vacancy.company
                    else "Компания не указана",
                "platform": vacancy.platform.name if vacancy.platform
                    else "Источник не указан",
                "city": vacancy.city.name if vacancy.city else "Город не указан",
                "url": vacancy.url,
                "salary": vacancy.salary,
                "address": vacancy.address,
                "skills": vacancy.skills,
                "employment": vacancy.employment,
                "work_format": vacancy.work_format,
                "schedule": vacancy.schedule,
                "published_at": vacancy.published_at.strftime("%d.%m.%Y") if
                    vacancy.published_at else None,
            }
            for vacancy in page_obj.object_list
        ]

        props = {
            "region": {
                "id": region.id,
                "name": region.name,
                "code": region.code
            },
            "vacancies": {
                "data": vacancies_data,
                "current_page": page_obj.number,
                "total_pages": paginator.num_pages,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            }
        }

        return inertia_render(request, "RegionPage", props)