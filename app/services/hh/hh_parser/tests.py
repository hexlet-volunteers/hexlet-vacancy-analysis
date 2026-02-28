import asyncio
from http import HTTPStatus
from unittest.mock import AsyncMock, patch

from django.http import JsonResponse
from django.test import TransactionTestCase
from django.utils import timezone

from app.services.hh.hh_parser.utils.data_transformer import (
    extract_city_and_address,
    extract_company,
    extract_plain_text,
    format_list,
    format_salary,
    safe_nested_get,
    transform_hh_data,
)
from app.services.hh.hh_parser.utils.vacancy_fetcher import fetch_hh_vacancies
from app.services.hh.hh_parser.utils.vacancy_service import (
    process_vacancies,
    save_vacancy,
)
from app.services.hh.hh_parser.views import hh_vacancy_parse
from app.services.vacancies.models import City, Company, Platform, Vacancy


class HhParserTests(TransactionTestCase):
    def setUp(self):
        self.sample_item = {
            "id": "123",
            "name": "Test Vacancy",
            "salary": {"from": 100000, "to": 200000, "currency": "RUB"},
            "alternate_url": "https://hh.ru/vacancy/123",
            "experience": {"name": "3-5 years"},
            "schedule": {"name": "full day"},
            "work_format": [{"name": "remote"}],
            "key_skills": [{"name": "Python"}],
            "education": {"level": {"name": "Bachelor"}},
            "description": "<p>Hello</p>",
            "address": {"city": "Moscow", "raw": "Moscow, Red Square"},
            "employment": {"name": "full-time"},
            "contacts": "email@example.com",
            "published_at": timezone.now(),
            "employer": {"name": "TestCompany"},
        }

    def test_format_salary_variants(self):
        self.assertEqual(
            format_salary({"from": 1, "to": 2, "currency": "RUB"}),
            "от 1 до 2 RUB",
        )
        self.assertEqual(
            format_salary({"from": 1, "to": 2, "currency": "rur"}),
            "от 1 до 2 RUB",
        )
        self.assertEqual(format_salary({"from": 10}), "от 10")
        self.assertEqual(format_salary({"to": 20}), "до 20")
        self.assertEqual(
            format_salary({"from": "abc", "to": "bla"}), "По договоренности"
        )
        self.assertEqual(
            format_salary({"from": "0", "to": "bla"}), "По договоренности"
        )
        self.assertEqual(
            format_salary(
                {},
            ),
            "По договоренности",
        )
        self.assertEqual(format_salary(None), "По договоренности")

    def test_format_list_and_plaintext(self):
        items = [{"name": "a"}, {"name": "b"}, {}]
        self.assertEqual(format_list(items, "name"), "a, b")

        self.assertEqual(extract_plain_text("<b>foo</b>"), "foo")
        self.assertEqual(extract_plain_text(None), "")

    def test_safe_nested_get(self):
        data = {"a": {"b": {"c": 1}}}
        self.assertEqual(safe_nested_get(data, "a", "b", "c"), 1)
        self.assertIsNone(safe_nested_get(None, "a"))

    def test_extract_company_and_city_and_address(self):
        comp = extract_company({"employer": {"name": "Hexlet"}})
        self.assertIsInstance(comp, Company)
        self.assertEqual(comp.name, "Hexlet")

        self.assertIsNone(extract_company({}))

        city_obj, addr = extract_city_and_address({"city": "Spb", "raw": "St"})
        self.assertIsInstance(city_obj, City)
        self.assertEqual(city_obj.name, "Spb")
        self.assertEqual(addr, "St")

        self.assertEqual(extract_city_and_address(None), (None, None))

    def test_transform_hh_data_creates_related(self):
        self.assertFalse(Platform.objects.filter(name=Platform.HH).exists())
        transformed = transform_hh_data(self.sample_item)
        self.assertEqual(transformed["title"], "Test Vacancy")
        self.assertEqual(transformed["salary"], "от 100000 до 200000 RUB")

        self.assertIsInstance(transformed["platform"], Platform)
        self.assertIsInstance(transformed["company"], Company)
        self.assertIsInstance(transformed["city"], City)

        self.assertTrue(Platform.objects.filter(name=Platform.HH).exists())

    @patch(
        "app.services.hh.hh_parser.utils.vacancy_fetcher.HTTPClient.get",
        new_callable=AsyncMock,
    )
    def test_fetch_hh_vacancies_success(self, mock_get):
        first = {"items": [{"id": "1"}, {"id": "2"}]}
        second1 = {"id": "1"}
        second2 = {"id": "2"}
        mock_get.side_effect = [[first], [second1, second2]]
        result = asyncio.run(fetch_hh_vacancies())
        self.assertEqual(result, [second1, second2])

    @patch(
        "app.services.hh.hh_parser.utils.vacancy_fetcher.HTTPClient.get",
        new_callable=AsyncMock,
    )
    def test_fetch_hh_vacancies_empty_items(self, mock_get):
        mock_get.return_value = [{"items": []}]
        with self.assertRaises(ValueError):
            asyncio.run(fetch_hh_vacancies({}))

    @patch(
        "app.services.hh.hh_parser.utils.vacancy_fetcher.HTTPClient.get",
        new_callable=AsyncMock,
    )
    def test_fetch_hh_vacancies_api_error(self, mock_get):
        mock_get.side_effect = [[]]
        with self.assertRaises(IndexError):
            asyncio.run(fetch_hh_vacancies({}))

    def test_process_vacancies_success(self):
        async def fake_fetch(params):
            return [{"id": "1"}]

        def fake_transform(item):
            return {
                "platform_vacancy_id": "p1",
                "title": "t",
                "published_at": timezone.now(),
            }

        response = asyncio.run(
            process_vacancies(fake_fetch, fake_transform, {})
        )
        self.assertEqual(response.status_code, HTTPStatus.OK.value)
        self.assertTrue(
            Vacancy.objects.filter(platform_vacancy_id="p1").exists()
        )

    def test_process_vacancies_not_found(self):
        async def fake_fetch(params):
            raise ValueError("No vacancy found")

        response = asyncio.run(process_vacancies(fake_fetch, lambda i: {}, {}))
        self.assertEqual(response.status_code, 404)

        async def fake_fetch(params):
            raise RuntimeError("Api error")

        response = asyncio.run(process_vacancies(fake_fetch, lambda i: {}, {}))
        self.assertEqual(response.status_code, 500)

    def test_save_vacancy_creates_record(self):
        def fake_transform(item):
            return {
                "platform_vacancy_id": "123",
                "title": "Python developer",
                "published_at": timezone.now(),
            }

        asyncio.run(save_vacancy(fake_transform, {}))
        self.assertTrue(
            Vacancy.objects.filter(platform_vacancy_id="123").exists()
        )

    @patch(
        "app.services.hh.hh_parser.views.process_vacancies",
        new_callable=AsyncMock,
    )
    def test_hh_vacancy_parse_happy_path(self, mock_process):
        response = JsonResponse(
            {
                "status": "success",
                "vacancies": ["vacancies"],
                "message": "Успешно сохранено 5 вакансий",
            },
            status=200,
        )
        mock_process.return_value = response
        result = asyncio.run(hh_vacancy_parse())
        mock_process.assert_awaited_with(
            fetch_hh_vacancies, transform_hh_data, params=None
        )

        self.assertIs(result, response)
