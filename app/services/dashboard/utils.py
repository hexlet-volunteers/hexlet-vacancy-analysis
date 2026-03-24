from app.services.vacancies.models import Vacancy


def collect_kpi():
    return Vacancy.objects.all()


def collect_dynamics():
    pass


def collect_top_skills():
    pass
