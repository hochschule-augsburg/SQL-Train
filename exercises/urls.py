from django.urls import path

from exercises import views

urlpatterns = [
    path("datamodel/<slug:topic>", views.data_model),
]
