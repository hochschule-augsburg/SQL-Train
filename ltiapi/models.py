# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later
#
# models.py was copied and altered from its original location
# at <https://github.com/Hyperchalk/Hyperchalk/>.

import uuid

from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import MinLengthValidator
from django.db import models
from django.http import HttpRequest
from django.urls import reverse
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from pylti1p3.contrib.django.lti1p3_tool_config.models import LtiTool


class OneOffRegistrationLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    consumer_name = models.CharField(
        _("consumer name"),
        max_length=64,
        blank=False,
        validators=[MinLengthValidator(5)],
        help_text=_("Name of the LTI consumer to register"),
    )
    registered_consumer = models.OneToOneField(
        LtiTool,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_("registered consumer"),
        help_text=_("only fills after registration completed"),
    )
    consumer_registration_timestamp = models.DateTimeField(
        _("consumer registration timestamp"), null=True, blank=True
    )

    def get_uri(self, request: HttpRequest):
        return request.build_absolute_uri(
            reverse("lti:register-consumer", args=[self.pk])
        )

    def registration_complete(self, consumer: LtiTool):
        self.registered_consumer = consumer
        self.consumer_registration_timestamp = now()
        self.save()


class Course(models.Model):
    course_id = models.IntegerField()
    lms = models.CharField(max_length=100)
    label = models.CharField(max_length=100, null=True)
    title = models.CharField(max_length=100, null=True)
    type = models.TextField(null=True)

    locale = models.CharField(max_length=10, null=True)
    document_target = models.CharField(max_length=50, null=True)
    return_url = models.URLField(null=True)

    tool_title = models.CharField(max_length=100, null=True)
    tool_description = models.TextField(null=True)
    tool_id = models.IntegerField(null=True)

    class Meta:
        constraints = [
            models.constraints.UniqueConstraint(
                fields=["course_id", "lms"], name="lms_course"
            ),
        ]

    def __str__(self) -> str:
        return f"Course: {self.lms}-{self.course_id}"


class LTIUser(AbstractUser):
    """
    User model for LTI.

    For Authentification
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registered_via = models.ForeignKey(
        LtiTool, on_delete=models.CASCADE, null=True, verbose_name=_("registered via")
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)

    lms_username = models.CharField(
        max_length=150,
        help_text=_("Unique username from lms"),
        default="Not_from_LMS",
    )

    class Meta(AbstractUser.Meta):
        constraints = [
            models.constraints.UniqueConstraint(
                fields=["lms_username", "course"], name="user_course"
            ),
        ]


INSTRUCTOR_ROLE = "membership#Instructor"
SYS_ADMIN_ROLE = "system/person#Administrator"
INSTITUTION_ADMIN_ROLE = "institution/person#Administrator"
SUPERIOR_ROLES = [INSTRUCTOR_ROLE, SYS_ADMIN_ROLE, INSTITUTION_ADMIN_ROLE]
