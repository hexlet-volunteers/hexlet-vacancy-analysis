from http import HTTPStatus

from django.test import TransactionTestCase
from django.urls import reverse

from app.services.vacancies.tests.factories import VacancyFactory


class MapTests(TransactionTestCase):
    def setUp(self):
        self.vacancies_data = [{"totalVacancies": 5, "region": "Moscow"}]

        for v in self.vacancies_data:
            VacancyFactory.create_batch(
                v["totalVacancies"],
                region=v["region"],
            )

    def test_map_list_view_get(self):
        response = self.client.get(reverse("map_list"))
        data = response.props["mapData"][0]

        self.assertEqual(response.status_code, HTTPStatus.OK.value)
        for v in self.vacancies_data:
            self.assertDictEqual(data, v)
