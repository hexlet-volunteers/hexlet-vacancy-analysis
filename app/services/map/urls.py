from django.urls import path

from . import views

urlpatterns = [
    path("", views.MapListView.as_view(), name="map_list"),
]
