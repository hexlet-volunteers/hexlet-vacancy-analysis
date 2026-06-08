import datetime
import logging
import uuid

from asgiref.sync import sync_to_async

from app.services.hh.hh_parser.utils.hh_regions_parser import (
    REGION_NAME_TO_CODE,
    get_hh_city_to_region_mapping,
)
from app.services.vacancies.models import City, Company, Platform, Vacancy

logger = logging.getLogger(__name__)


class SaveDataVacancy:
    @sync_to_async
    def save_vacancy(self, parsed, date):
        region_name, region_code, city, company = None, None, None, None

        platform, _ = Platform.objects.get_or_create(name=Platform.TELEGRAM)
        if parsed["company"]:
            company, _ = Company.objects.get_or_create(name=parsed["company"])
        if parsed["city"]:
            city, _ = City.objects.get_or_create(name=parsed["city"])
            region = get_hh_city_to_region_mapping(source="hh")
            region_name = region.get(str(city), 'Регион не найден')
            region_code = REGION_NAME_TO_CODE.get(region_name, 'Код региона не найден')

        platform_vacancy_id = f"{Platform.TELEGRAM}{uuid.uuid4()}"

        Vacancy.objects.update_or_create(
            platform_vacancy_id=platform_vacancy_id,
            defaults={
                "platform": platform,
                "region": region_name,
                "region_code": region_code,
                "city": city,
                "company": company,
                "platform_vacancy_id": platform_vacancy_id,
                "title": parsed["title"],
                "salary": parsed["salary"],
                "url": parsed["url"],
                "experience": parsed["experience"],
                "schedule": parsed["schedule"],
                "work_format": parsed["work_format"],
                "skills": parsed["skills"],
                "description": parsed["description"],
                "address": parsed["address"],
                "contacts": parsed["contacts"],
                "published_at": datetime.datetime.now(),
            },
        )
        logger.info("Данные в модель успешно записаны")
