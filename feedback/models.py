# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.db import models

# Create your models here.


class FeedbackMessage(models.Model):
    stars = models.IntegerField()
    praise = models.TextField(blank=True)
    criticism = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="starts_range",
                check=models.Q(stars__range=(1, 5)),
            ),
        ]


class Feedback(models.Model):
    datetime = models.DateTimeField(auto_now_add=True)
    general = models.ForeignKey(
        FeedbackMessage, related_name="generalMessage", on_delete=models.CASCADE
    )
    ui = models.ForeignKey(
        FeedbackMessage, related_name="uiMessage", on_delete=models.CASCADE
    )
    ux = models.ForeignKey(
        FeedbackMessage, related_name="uxMessage", on_delete=models.CASCADE
    )
    improvements = models.TextField(blank=True)
