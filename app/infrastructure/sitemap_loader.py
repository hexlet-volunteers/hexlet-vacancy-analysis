from importlib import import_module

from django.apps import apps


def get_sitemaps():
    result = {}

    for app_config in apps.get_app_configs():
        try:
            module = import_module(f"{app_config.name}.sitemap")
        except ModuleNotFoundError:
            continue

        if hasattr(module, "sitemaps"):
            result.update(module.sitemaps)

    return result
