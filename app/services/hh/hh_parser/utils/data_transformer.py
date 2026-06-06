import logging
import re
from typing import Any, Optional

from bs4 import BeautifulSoup

from app.services.vacancies.models import City, Company, Platform

from .regions_parser import get_hh_city_to_region_mapping

logger = logging.getLogger(__name__)

CURRENCY_PATTERN = re.compile(r"^(rub|rur)$", re.IGNORECASE)


def normalize_currency(currency: str) -> str:
    """Нормализует валюту к формату RUB (rub/rur -> RUB)."""
    if CURRENCY_PATTERN.match(currency):
        return "RUB"
    return currency


def format_salary(salary_data: Optional[dict[str, Any]]) -> str:
    if not salary_data:
        return "По договоренности"

    parts = []
    salary_from = salary_data.get("from")
    salary_to = salary_data.get("to")

    def get_valid_salary_value(value) -> None | int | str:
        if value is None:
            return None
        try:
            if int(value) > 0:
                return value
            else:
                return None
        except ValueError:
            logger.info("Salary value not a number")
            return None

    valid_from = get_valid_salary_value(salary_from)
    valid_to = get_valid_salary_value(salary_to)

    if not valid_from and not valid_to:
        return "По договоренности"

    if valid_from:
        parts.append(f"от {valid_from}")
    if valid_to:
        parts.append(f"до {valid_to}")
    if salary_data.get("currency"):
        parts.append(normalize_currency(salary_data["currency"]))

    return " ".join(parts)


def format_list(items: list, key: str) -> str:
    return ", ".join(item.get(key, "") for item in items if item.get(key))


def extract_plain_text(html_content: Optional[str]) -> str:
    if not html_content:
        return ""
    return BeautifulSoup(html_content, "html.parser").get_text()


def safe_nested_get(data: Optional[dict[str, Any]], *keys: str) -> Any:
    if not data:
        return None

    current = data
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
        if current is None:
            return None

    return current


def transform_hh_data(item: dict[str, Any]) -> dict[str, Any]:
    platform, _ = Platform.objects.get_or_create(name=Platform.HH)
    company = extract_company(item)
    city = extract_city(item)
    full_address = extract_address(item)
    region = get_hh_city_to_region_mapping(source="hh")

    return {
        "platform": platform,
        "company": company,
        "region": region.get(str(city), 'Регион не найден'),
        "city": city,
        "platform_vacancy_id": f"{Platform.HH}{item.get('id')}",
        "title": item.get("name"),
        "salary": format_salary(item.get("salary")),
        "url": item.get("alternate_url"),
        "experience": safe_nested_get(item, "experience", "name"),
        "schedule": safe_nested_get(item, "schedule", "name"),
        "work_format": format_list(item.get("work_format", []), "name"),
        "skills": format_list(item.get("key_skills", []), "name"),
        "education": safe_nested_get(item, "education", "level", "name"),
        "description": extract_plain_text(item.get("description")),
        "address": full_address,
        "employment": safe_nested_get(item, "employment", "name"),
        "contacts": item.get("contacts"),
        "published_at": item.get("published_at"),
    }


def extract_company(item: dict[str, Any]) -> Optional[Company]:
    employer_name = item.get("employer", {}).get("name")
    if not employer_name:
        return None
    company, _ = Company.objects.get_or_create(name=employer_name)
    return company


def extract_city(item: Optional[dict[str, Any]]) -> Optional[City]:
    if not item:
        return None
    city_name = item.get("area", {}).get("name")
    if not city_name:
        return None
    city, _ = City.objects.get_or_create(name=city_name)
    return city


def extract_address(item: Optional[dict[str, Any]]) -> Optional[str]:
    if not item:
        return None
    address = item.get("address", {})
    if not address:
        return None
    return address.get("raw")