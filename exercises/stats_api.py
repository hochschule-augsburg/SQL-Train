# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.http import HttpRequest
from ninja import Query, Router

from exercises import models as m
from exercises.filter_schemas import ExerciseFilter
from exercises.stats_schemas import Course, Stats
from ltiapi import utils
from ltiapi.models import LTIUser

router = Router(
    # Restrict usage to superuser and instructors
    auth=lambda request: utils.is_superior(request.user),
)


@router.get("/course", response=Course)
def course_info(request: HttpRequest):
    """Returns the info about the tool usage by course"""
    objects = LTIUser.objects.filter(course=request.user.course)
    return Course(user_num=objects.count())


@router.get("/exercises", response=Stats)
def exercises(request: HttpRequest, filters: ExerciseFilter = Query(...)):
    """Returns analysis for given filter
    :returns:   - total:    Total number of exercises fiting the filter times users
                - started:  Number of exercises with just a buffer that were never checked
                - correct:  Number of correct exercises
                - wrong:    Number of wrong exercises"""
    exercises = filters.filter(m.Exercise.objects)
    user_exercises = m.UserExercise.objects.filter(exercise__in=exercises).filter(
        user__course=request.user.course
    )
    return Stats(
        total=exercises.count() * course_info(request).user_num,
        started=user_exercises.filter(is_correct=None).count(),
        correct=user_exercises.filter(is_correct=True).count(),
        wrong=user_exercises.filter(is_correct=False).count(),
    )
