from django.db import models
from django.db.models import Count


class RegionQuerySet(models.QuerySet):
    def total_vacancies(self):
        return (
            self.filter(region__isnull=False)
            .values("region")
            .annotate(totalVacancies=Count("region"))
        )


class RegionManager(models.Manager):
    def get_queryset(self):
        return RegionQuerySet(self.model, using=self._db)

    def total_vacancies(self):
        return self.get_queryset().total_vacancies()
