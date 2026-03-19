from django.db import models


class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Newsletter subscription"
        verbose_name_plural = "Newsletter subscriptions"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email
