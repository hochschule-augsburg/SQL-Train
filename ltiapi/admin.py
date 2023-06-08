# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later
#
# This was copied and altered from its original location
# at <https://github.com/Hyperchalk/Hyperchalk/>.

"""Admin site for registration link"""
from datetime import datetime

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from rangefilter.filters import DateTimeRangeFilterBuilder

from ltiapi.utils import chain

from . import models as m


@admin.register(m.OneOffRegistrationLink)
class OneOffRegistrationLinkAdmin(admin.ModelAdmin):
    list_display = ["consumer_name", "id"]
    readonly_fields = ["registration_link"]

    # pylint: disable=signature-differs

    def get_readonly_fields(self, request: HttpRequest, obj: m.OneOffRegistrationLink):
        if not chain(obj, ("pk",)):
            return []
        return super().get_readonly_fields(request, obj)

    def changeform_view(self, request, *args, **kwargs):
        self.request = request
        return super().changeform_view(request, *args, **kwargs)

    @admin.display(description="One off registration link")
    def registration_link(self, obj: m.OneOffRegistrationLink):
        return obj.get_uri(self.request)


@admin.register(m.Course)
class CourseAdmin(admin.ModelAdmin):
    pass


@admin.register(m.LTIUser)
class LTIUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Personal info"),
            {"fields": ("lms_username", "first_name", "last_name", "email")},
        ),
        ("LTI", {"fields": ("registered_via", "course")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    list_filter = UserAdmin.list_filter + (
        (
            "last_login",
            DateTimeRangeFilterBuilder(
                title="Last Login",
                default_start=datetime(2023, 1, 1),
                default_end=datetime.now(),
            ),
        ),
        (
            "date_joined",
            DateTimeRangeFilterBuilder(
                title="Created",
                default_start=datetime(2023, 1, 1),
                default_end=datetime.now(),
            ),
        ),
    )
