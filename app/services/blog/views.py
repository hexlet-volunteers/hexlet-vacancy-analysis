from django.core.paginator import Paginator
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.views import View
from inertia import InertiaResponse
from inertia import render as inertia_render

from .models import BlogCategory, BlogPost, Tag


class BlogListView(View):
    PAGE_SIZE = 6

    def get(self, request: HttpRequest) -> InertiaResponse:
        category_id = request.GET.get("category")
        query = request.GET.get("q")
        qs = (
            BlogPost.objects.for_blog_list()
            .get_by_category(category_id)
            .search(query)
            .values(
                "id",
                "title",
                "content_short",
                "category__name",
                "author__first_name",
                "created_at",
                "duration_minutes",
            )
        )

        paginator = Paginator(qs, self.PAGE_SIZE)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)

        posts = list(page_obj.object_list)
        categories = list(BlogCategory.objects.values("id", "name"))
        tags = list(Tag.objects.values("id", "name"))

        return inertia_render(
            request,
            "Blog",
            props={
                "posts": posts,
                "categories": categories,
                "tags": tags,
                "pagination": {
                    "has_next": page_obj.has_next(),
                    "has_previous": page_obj.has_previous(),
                    "current_page": page_obj.number,
                    "num_pages": paginator.num_pages,
                },
                "filter": {
                    "category": category_id,
                    "query": query,
                },
            },
        )


class BlogDetailView(View):
    def get(self, request: HttpRequest, slug: str) -> InertiaResponse:
        post = get_object_or_404(BlogPost.objects.for_blog_detail(), slug=slug)
        post_data = {
            "id": post.id,
            "slug": post.slug,
            "title": post.title,
            "content_full": post.content_full,
            "created_at": post.created_at,
            "duration_minutes": post.duration_minutes,
            "category": post.category.name,
            "author": post.author.first_name,
            "tags": [tag.name for tag in post.tags.all()],
        }

        recommended_posts = BlogPost.objects.recommended_for(post)

        recommended_posts_data = [
            {
                "id": rec_post.id,
                "slug": rec_post.slug,
                "title": rec_post.title,
                "content_short": rec_post.content_short,
                "category": rec_post.category.name,
                "author": rec_post.author.first_name,
                "created_at": rec_post.created_at,
                "duration_minutes": rec_post.duration_minutes,
            }
            for rec_post in recommended_posts
        ]

        return inertia_render(
            request,
            "BlogPostPage",
            props={
                "post": post_data,
                "recommended_posts": recommended_posts_data,
            },
        )
