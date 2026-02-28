from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .models import BlogPost


class BlogSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return BlogPost.objects.published()

    def lastmod(self, obj):
        return obj.updated_at


class BlogStaticSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return ["blog_list"]

    def location(self, item):
        return reverse(item)


sitemaps = {
    "blog_static": BlogStaticSitemap,
    "blog": BlogSitemap,
}
