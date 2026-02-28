import asyncio
from unittest.mock import AsyncMock, patch

import factory
from django.test import RequestFactory, TransactionTestCase, override_settings

from app.services.vacancies.models import Vacancy
from app.services.vacancies.utils.paginated_vacancies import (
    VACANCIES_PER_PAGE,
    get_paginated_vacancies,
    get_searched_vacancies,
)

from ..views import VacancyListView
from .factories import CityFactory, CompanyFactory, VacancyFactory


class VacanciesTests(TransactionTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        VacancyFactory.create_batch(
            2,
            title=factory.Iterator(["Python Developer", "Java Engineer"]),
            city=factory.Iterator(
                [CityFactory(name="Moscow"), CityFactory(name="SPB")]
            ),
            company=factory.Iterator(
                [CompanyFactory(name="Hexlet"), CompanyFactory(name="Google")]
            ),
        )

    def test_vacancies_created(self):
        self.assertEqual(Vacancy.objects.count(), 2)

    @patch("app.services.vacancies.views.inertia_render")
    @patch(
        "app.services.vacancies.views.get_paginated_vacancies",
        new_callable=AsyncMock,
    )
    @override_settings(SECRET_KEY="a-test-secret")
    async def test_fetch_vacancies(
        self, mock_get_paginated_vacancies, mock_inertia_render
    ):
        request = self.factory.get("/vacancies/")
        mock_paginated_data = {
            "vacancies": [{"id": 1, "title": "Test Vacancy"}],
            "pagination": {"page": 1, "has_next": False},
        }
        mock_get_paginated_vacancies.return_value = mock_paginated_data
        mock_inertia_render.return_value = "Mocked Inertia Response"

        view = VacancyListView()
        response = await view.get(request)

        print(response)

    def test_vacancy_titles(self):
        titles = [v.title for v in Vacancy.objects.all()]

        self.assertIn("Python Developer", titles)
        self.assertIn("Java Engineer", titles)

    def test_get_all_vacancies_empty_search(self):
        result = asyncio.run(get_searched_vacancies(""))
        self.assertEqual(len(result), Vacancy.objects.count())
        self.assertEqual(result[-1]["title"], "Python Developer")
        self.assertEqual(result[-1]["company"], "Hexlet")

    def test_search_by_title(self):
        result = asyncio.run(get_searched_vacancies("Python"))

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "Python Developer")

    def test_search_by_company_name(self):
        result = asyncio.run(get_searched_vacancies("Google"))

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["company"], "Google")

    def test_search_by_city(self):
        result = asyncio.run(get_searched_vacancies("SPB"))

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["city"], "SPB")

    def test_search_by_description(self):
        VacancyFactory.create(description="We need Django expertise")
        result = asyncio.run(get_searched_vacancies("Django"))

        self.assertEqual(len(result), 1)
        self.assertIn("Django", result[0]["description"])

    def test_search_multiple_terms(self):
        result = asyncio.run(get_searched_vacancies("Python Moscow"))

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "Python Developer")

    def test_search_case_insensitive(self):
        result_lower = asyncio.run(get_searched_vacancies("python"))
        result_upper = asyncio.run(get_searched_vacancies("PYTHON"))

        self.assertEqual(len(result_lower), 1)
        self.assertEqual(len(result_upper), 1)

    def test_first_page_pagination(self):
        VacancyFactory.create_batch(10)
        request = self.factory.get("/vacancies?page=1")
        result = asyncio.run(get_paginated_vacancies(request))

        self.assertEqual(len(result["vacancies"]), VACANCIES_PER_PAGE)
        self.assertEqual(result["pagination"]["current_page"], 1)
        self.assertTrue(result["pagination"]["has_next"])
        self.assertFalse(result["pagination"]["has_previous"])

    def test_last_page_pagination(self):
        VacancyFactory.create_batch(12)

        request = self.factory.get("/vacancies?page=3")

        with patch(
            "app.services.vacancies.utils.paginated_vacancies.hh_vacancy_parse"
        ) as mock_hh:
            with patch(
                "app.services.vacancies.utils.paginated_vacancies.superjob_vacancy_parse"
            ) as mock_sj:
                mock_hh.return_value = AsyncMock(status_code=200)
                mock_sj.return_value = AsyncMock(status_code=200)

                result = asyncio.run(get_paginated_vacancies(request))

        self.assertEqual(result["pagination"]["current_page"], 3)
        self.assertFalse(result["pagination"]["has_next"])
        self.assertTrue(result["pagination"]["has_previous"])

    def test_default_page_number(self):
        request = self.factory.get("/vacancies")
        result = asyncio.run(get_paginated_vacancies(request))

        self.assertEqual(result["pagination"]["current_page"], 1)

    def test_pagination_with_search_query(self):
        VacancyFactory.create_batch(5, title="Python Developer")
        VacancyFactory.create_batch(5, title="Java Developer")

        request = self.factory.get("/vacancies?page=1&search=Python")
        result = asyncio.run(get_paginated_vacancies(request))

        self.assertEqual(result["pagination"]["current_page"], 1)
        for vacancy in result["vacancies"]:
            self.assertIn("Python", vacancy["title"])

    def test_pagination_structure(self):
        request = self.factory.get("/vacancies?page=1")
        result = asyncio.run(get_paginated_vacancies(request))

        self.assertIn("pagination", result)
        self.assertIn("vacancies", result)

        pagination = result["pagination"]
        self.assertIn("current_page", pagination)
        self.assertIn("total_pages", pagination)
        self.assertIn("has_next", pagination)
        self.assertIn("has_previous", pagination)
