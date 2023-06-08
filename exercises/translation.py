# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from modeltranslation.translator import TranslationOptions, register

import exercises.models as m

# Specify field that need translation here.


@register(m.Topic)
class Topic(TranslationOptions):
    fields = ("title",)


@register(m.Exercise)
class Exercise(TranslationOptions):
    fields = ("title", "question")


@register(m.Solution)
class Solution(TranslationOptions):
    fields = ("description",)
