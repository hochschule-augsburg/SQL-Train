# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.contrib import admin
from django.core import serializers
from django.http import HttpResponse
from modeltranslation.admin import TranslationAdmin

import exercises.models as m



@admin.register(m.Topic)
class TopicAdmin(TranslationAdmin):
    list_display = ["short", "title", "visible"]
    list_filter = ["short", "title", "visible"]
    actions = ["export_topic"]

    @admin.action(description="Export selected Topics")
    def export_topic(self, request, queryset):
        response = HttpResponse(content_type="application/yaml")
        response["Content-Disposition"] = 'attachment; filename="topic_export.yaml"'
        etags = []
        for to in queryset:
            # Topic with all fields
            serializers.serialize(
                "yaml", m.Topic.objects.filter(pk=to), stream=response
            )
            serializers.serialize(
                "yaml", m.Ttag.objects.filter(topic__short=to), stream=response
            )
            # Exercises of Topic including all fields
            serializers.serialize(
                "yaml",
                m.Exercise.objects.filter(topic=to),
                use_natural_foreign_keys=True,
                use_natural_primary_keys=True,
                stream=response,
            )
            # Solutions
            serializers.serialize(
                "yaml",
                m.Solution.objects.filter(exercise__topic=to),
                use_natural_foreign_keys=True,
                use_natural_primary_keys=True,
                stream=response,
            )
            # etags will be serialized later, beforehand there will be duplicate elimination
            etags += m.Etag.objects.filter(exercise__topic=to)
        etags = list(set(etags))
        serializers.serialize("yaml", etags, stream=response)
        return response
    pass


@admin.register(m.Exercise)
class ExerciseAdmin(TranslationAdmin):
    list_display = ["topic", "enumber", "title", "points", "is_select"]
    list_filter = ["topic", "enumber", "title", "points", "is_select"]
    actions = ["export_exercise"]

    @admin.action(description="Export selected Exercises")
    def export_exercise(modeladmin, request, queryset):
        response = HttpResponse(content_type="application/yaml")
        response["Content-Disposition"] = 'attachment; filename="exercises_export.yaml"'
        etags = []
        for ex in queryset:
            to, ex_nr = str(ex).split("/")
            # Exercises of Topic including all fields
            # serializers.serialize('yaml', m.Exercise.objects.filter(topic=to, enumber=ex_nr),
            #                      use_natural_foreign_keys=True, use_natural_primary_keys=True, stream=response)
            serializers.serialize(
                "yaml",
                m.Exercise.objects.filter(topic=to, enumber=ex_nr),
                use_natural_foreign_keys=True,
                use_natural_primary_keys=True,
                stream=response,
            )
            serializers.serialize(
                "yaml",
                m.Solution.objects.filter(exercise__topic=to, exercise__enumber=ex_nr),
                use_natural_foreign_keys=True,
                use_natural_primary_keys=True,
                stream=response,
            )
            etags += m.Etag.objects.filter(exercise__topic=to, exercise__enumber=ex_nr)
        etags = list(set(etags))
        serializers.serialize("yaml", etags, stream=response)
        return response

    pass


@admin.register(m.Ttag)
class TtagAdmin(admin.ModelAdmin):
    pass


@admin.register(m.Etag)
class EtagAdmin(admin.ModelAdmin):
    pass


@admin.register(m.Solution)
class SolutionAdmin(TranslationAdmin):
    list_display = ["exercise", "snumber"]
    list_filter = ["exercise", "snumber"]
    pass


@admin.register(m.UserExercise)
class UserExercisesAdmin(admin.ModelAdmin):
    list_display = ["user", "exercise", "is_correct", "favourite"]
    list_filter = ["user", "exercise", "is_correct", "favourite"]
    pass
