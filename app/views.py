from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.http import require_GET
from inertia import render as inertia_render


def index(request):
    return inertia_render(
        request,
        "HomePage",
        props={},
    )


def custom_server_error(request):
    return JsonResponse(
        {"status": "error", "message": "Internal server error"},
        status=500,
    )


def custom_not_found_error(request, exception):
    return JsonResponse(
        {"status": "error", "message": "Internal server error"},
        status=404,
    )


@require_GET
def robots_txt(request: HttpRequest) -> HttpResponse:
    """
    Возвращает файл robots.txt для управления поисковыми роботами.

    Указывает разрешенные и запрещенные пути, а также карту сайта.

    Args:
        request (HttpRequest): HTTP-запрос для построения URL карты сайта.

    Returns:
        HttpResponse: Текстовый файл robots.txt.
    """
    public_pages: list[str] = []

    private_pages: list[str] = [
        "/",
        "/admin/",
    ]

    lines = [
        "User-agent: *",
        *[f"Allow: {page}" for page in public_pages],
        *[f"Disallow: {page}" for page in private_pages],
        f"Sitemap: {request.build_absolute_uri('/sitemap.xml')}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
