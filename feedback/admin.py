# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.contrib import admin

from feedback import models as m

# Register your models here.


@admin.register(m.Feedback, m.FeedbackMessage)
class Admin(admin.ModelAdmin):
    pass
