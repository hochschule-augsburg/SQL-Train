# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.urls import path

from . import views

app_name = "lti"

urlpatterns = [
    path(
        "register-consumer/<uuid:pk>",
        views.RegisterConsumerView.as_view(),
        name="register-consumer",
    ),
    path("login", views.oidc_login, name="login"),
    path("jwks", views.oidc_jwks, name="jwks"),
    path("launch", views.lti_launch, name="launch"),
    path("login-lms", views.login_lms, name="login-lms"),
]
