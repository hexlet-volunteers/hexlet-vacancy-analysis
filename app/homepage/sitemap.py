from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class HomeStaticSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return ["index"]

    def location(self, item):
        return reverse(item)


sitemaps = {
    "home": HomeStaticSitemap,
}
