# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from csp.decorators import csp_exempt
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import include, path, re_path
from django.utils.translation import gettext_lazy as _
from django.views.generic import TemplateView
from django.views.static import serve
from ninja import NinjaAPI
from ninja.security import django_auth
from psycopg_pool import PoolTimeout

from exercises.api import router as exercises_router
from feedback.api import router as feedback_router
from pg_stud.api import router as pg_stud_router
from sql_training.settings import DEPLOY, MEDIA_ROOT, PG_STUD_CONNINFO

from . import views

# TODO remove csp_exempt and replace with cps_update
if DEPLOY:
    docs_decorator = lambda f: staff_member_required(csp_exempt(f))
else:
    docs_decorator = csp_exempt

api = NinjaAPI(
    docs_url="/docs/",
    servers=[{"url": ""}],
    auth=django_auth,
    csrf=True,
    docs_decorator=docs_decorator,
)


@api.exception_handler(PoolTimeout)
def service_unavailable(request, exc):
    return api.create_response(
        request,
        f"""Cannot get connection to {PG_STUD_CONNINFO['host']}.
            Try reaching your lecturer.""",
        status=503,
    )


api.add_router("/", exercises_router)
api.add_router("pg-stud/", pg_stud_router)
api.add_router("feedback", feedback_router)


urlpatterns = [
    path("", views.index),
    path("privacy", TemplateView.as_view(template_name="privacy.html")),
    path("credits", TemplateView.as_view(template_name="credits.html")),
    path("admin/", admin.site.urls),
    path("api/", api.urls),
    path("lti/", include("ltiapi.urls")),
]

if not DEPLOY:
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            serve,
            {
                "document_root": MEDIA_ROOT,
            },
        ),
    ]
