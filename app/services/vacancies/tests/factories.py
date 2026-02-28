import factory
from django.utils import timezone
from factory import Sequence
from factory.django import DjangoModelFactory

from app.services.vacancies.models import City, Company, Platform, Vacancy


class PlatformFactory(DjangoModelFactory):
    class Meta:
        model = Platform
        django_get_or_create = ("name",)


class CityFactory(DjangoModelFactory):
    class Meta:
        model = City
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"City {n}")


class CompanyFactory(DjangoModelFactory):
    class Meta:
        model = Company
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Company {n}")


class VacancyFactory(DjangoModelFactory):
    class Meta:
        model = Vacancy

    platform = factory.SubFactory(PlatformFactory, name="HH")
    company = factory.SubFactory(CompanyFactory, name="Hexlet")
    city = factory.SubFactory(CityFactory, name="Moscow")

    platform_vacancy_id = Sequence(lambda n: n)

    title = factory.Sequence(lambda n: f"Developer {n}")
    url = factory.LazyAttribute(
        lambda o: f"https://example.com/vacancy/{o.platform_vacancy_id}"
    )
    salary = "100000 RUB"
    experience = "2-3 years"
    employment = "Full-time"
    description = "No description"
    published_at = factory.LazyFunction(timezone.now)