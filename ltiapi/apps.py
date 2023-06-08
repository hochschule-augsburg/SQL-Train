# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.apps import AppConfig


class LtiapiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ltiapi"
