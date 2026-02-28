import asyncio
from datetime import datetime
from http import HTTPStatus
from unittest.mock import AsyncMock, patch

from django.http import JsonResponse
from django.test import TransactionTestCase
from django.utils import timezone

from app.services.hh.hh_parser.utils.vacancy_service import (
    process_vacancies,
    save_vacancy,
)
from app.services.superjob.superjob_parser.utils.data_transformer import (
    extract_city,
    extract_company,
    format_skills,
    parse_published_at,
    transform_superjob_data,
)
from app.services.superjob.superjob_parser.utils.vacancy_fetcher import (
    fetch_superjob_vacancies,
)
from app.services.superjob.superjob_parser.views import superjob_vacancy_parse
from app.services.vacancies.models import City, Company, Platform, Vacancy


class SuperJobParserTests(TransactionTestCase):
    def setUp(self):
        self.sample_item = {
            "id": "456",
            "profession": "Senior Python Developer",
            "payment_from": 150000,
            "payment_to": 250000,
            "currency": "RUB",
            "link": "https://superjob.ru/vacancy/456",
            "experience": {"title": "3-5 years"},
            "type_of_work": {"title": "full-time"},
            "place_of_work": {"title": "remote"},
            "catalogues": [{"title": "Python"}, {"title": "Django"}],
            "education": {"title": "Higher"},
            "vacancyRichText": "<p>We are hiring</p>",
            "address": "Moscow, Tverskaya st.",
            "phone": "+7 999 123-45-67",
            "date_published": 1700000000,
            "client": {"title": "SuperCompany"},
            "town": {"title": "Moscow"},
        }

    def test_format_salary_variants(self):
        from app.services.hh.hh_parser.utils.data_transformer import (
            format_salary,
        )

        self.assertEqual(
            format_salary({"from": 1000, "to": 2000, "currency": "USD"}),
            "от 1000 до 2000 USD",
        )
        self.assertEqual(format_salary({"from": "100", "currency": "rur"}), "от 100 RUB")
        self.assertEqual(format_salary({"from": 5000}), "от 5000")
        self.assertEqual(format_salary({"from": "5000"}), "от 5000")
        self.assertEqual(format_salary({"to": 8000}), "до 8000")
        self.assertEqual(format_salary({"from": "0"}), "По договоренности")
        self.assertEqual(format_salary({"from": "0", "to": 400}), "до 400")
        self.assertEqual(format_salary({"from": "bla", "to": None}), "По договоренности")
        self.assertEqual(format_salary({}), "По договоренности")
        self.assertEqual(format_salary(None), "По договоренности")

    def test_extract_company(self):
        comp = extract_company({"client": {"title": "Yandex"}})
        self.assertIsInstance(comp, Company)
        self.assertEqual(comp.name, "Yandex")

        self.assertIsNone(extract_company({"client": {}}))
        self.assertIsNone(extract_company({}))

    def test_extract_city(self):
        city_obj = extract_city({"title": "Saint Petersburg"})
        self.assertIsInstance(city_obj, City)
        self.assertEqual(city_obj.name, "Saint Petersburg")

        self.assertIsNone(extract_city({}))
        self.assertIsNone(extract_city(None))

    def test_format_skills(self):
        skills = [{"title": "Python"}, {"title": "FastAPI"}]
        self.assertEqual(format_skills(skills), "Python")

        self.assertEqual(format_skills("Direct text"), "Direct text")
        self.assertIsNone(format_skills(None))
        self.assertIsNone(format_skills([]))

    def test_parse_published_at(self):
        timestamp = 1700000000
        result = parse_published_at(timestamp)
        self.assertIsInstance(result, datetime)

        self.assertIsNone(parse_published_at(None))
        self.assertIsNone(parse_published_at(0))

    def test_transform_superjob_data_creates_related(self):
        self.assertFalse(Platform.objects.filter(name=Platform.SUPER_JOB).exists())
        transformed = transform_superjob_data(self.sample_item)

        self.assertEqual(transformed["title"], "Senior Python Developer")
        self.assertEqual(transformed["salary"], "от 150000 до 250000 RUB")
        self.assertEqual(transformed["platform_vacancy_id"], f"{Platform.SUPER_JOB}456")

        self.assertIsInstance(transformed["platform"], Platform)
        self.assertIsInstance(transformed["company"], Company)
        self.assertIsInstance(transformed["city"], City)

        self.assertTrue(Platform.objects.filter(name=Platform.SUPER_JOB).exists())

    def test_transform_superjob_data_missing_fields(self):
        minimal_item = {
            "id": "789",
            "profession": "Junior Developer",
            "payment_from": None,
            "payment_to": None,
            "currency": None,
            "link": "https://superjob.ru/vacancy/789",
            "client": {"title": "Startup"},
            "town": None,
            "date_published": None,
        }

        transformed = transform_superjob_data(minimal_item)
        self.assertEqual(transformed["title"], "Junior Developer")
        self.assertEqual(transformed["salary"], "По договоренности")
        self.assertIsNone(transformed["city"])
        self.assertIsNone(transformed["published_at"])

    @patch(
        "app.services.superjob.superjob_parser.utils.vacancy_fetcher.HTTPClient.get",
        new_callable=AsyncMock,
    )
    def test_fetch_superjob_vacancies_success(self, mock_get):
        response_data = {"objects": [{"id": "1"}, {"id": "2"}]}
        mock_get.return_value = [response_data]

        result = asyncio.run(fetch_superjob_vacancies())
        self.assertEqual(result, [{"id": "1"}, {"id": "2"}])
        mock_get.assert_awaited_once()

    @patch(
        "app.services.superjob.superjob_parser.utils.vacancy_fetcher.HTTPClient.get",
        new_callable=AsyncMock,
    )
    def test_fetch_superjob_vacancies_empty_objects(self, mock_get):
        mock_get.return_value = [{"objects": []}]

        with self.assertRaises(ValueError):
            asyncio.run(fetch_superjob_vacancies(params={}))

    @patch(
        "app.services.superjob.superjob_parser.utils.vacancy_fetcher.os.getenv",
        return_value=None,
    )
    def test_fetch_superjob_vacancies_missing_api_key(self, mock_getenv):
        with self.assertRaises(ValueError):
            asyncio.run(fetch_superjob_vacancies(params={}))

    def test_process_vacancies_success(self):
        from app.services.hh.hh_parser.utils.vacancy_service import (
            process_vacancies,
        )

        async def fake_fetch(params):
            return [{"id": "1"}]

        def fake_transform(item):
            return {
                "platform_vacancy_id": "sj_1",
                "title": "SuperJob Vacancy",
                "published_at": timezone.now(),
            }

        response = asyncio.run(process_vacancies(fake_fetch, fake_transform, {}))
        self.assertEqual(response.status_code, HTTPStatus.OK.value)
        self.assertTrue(Vacancy.objects.filter(platform_vacancy_id="sj_1").exists())

    def test_process_vacancies_not_found(self):
        async def fake_fetch(params):
            raise ValueError("No vacancies")

        def fake_transform():
            return {}

        response = asyncio.run(process_vacancies(fake_fetch, fake_transform))
        self.assertEqual(response.status_code, 404)

        async def fake_fetch(params):
            raise RuntimeError("API error")

        response = asyncio.run(process_vacancies(fake_fetch, fake_transform))
        self.assertEqual(response.status_code, 500)

    def test_save_vacancy_creates_record(self):
        def fake_transform(item):
            return {
                "platform_vacancy_id": "sj_123",
                "title": "Test SuperJob",
                "published_at": timezone.now(),
            }

        asyncio.run(save_vacancy(fake_transform, {}))
        self.assertTrue(Vacancy.objects.filter(platform_vacancy_id="sj_123").exists())

    @patch(
        "app.services.superjob.superjob_parser.views.process_vacancies",
        new_callable=AsyncMock,
    )
    def test_superjob_vacancy_parse_happy_path(self, mock_process):
        response = JsonResponse(
            {
                "status": "success",
                "vacancies": ["vacancies"],
                "message": "Успешно сохранено 5 вакансий",
            },
            status=200,
        )
        mock_process.return_value = response
        result = asyncio.run(superjob_vacancy_parse(params={"x": 1}))

        mock_process.assert_awaited_with(
            fetch_superjob_vacancies, transform_superjob_data, params={"x": 1}
        )
        self.assertIs(result, response)