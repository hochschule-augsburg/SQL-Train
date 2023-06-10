# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from typing import List

from django.db import models
from django.db.models import Subquery
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from ninja import Query, Router

from exercises import filter_schemas as s
from exercises import models as m
from exercises.schemas import Topic

router = Router()


@router.get("/filter_topics", response=List[Topic])
def filter_topic(request: HttpRequest, filters: s.TopicFilter = Query(...)):
    """Returns a filtered list of topics optionally filtered like filter_exercises."""
    objects = m.Topic.objects.filter(visible=True)
    objects = objects.filter(filters.filter())
    return objects


@router.get("/filter_exercises", response=List[s.TopicExercise])
def filter_exercises(request: HttpRequest, filters: s.ExerciseFilter = Query(...)):
    """Returns a filtered list of exercises optionally filtered with AND concat."""
    topic_exercises = []
    topics = m.Topic.objects.filter(visible=True)
    if filters.topics:
        topics = topics.filter(short__in=filters.topics)
    for topic in topics:
        user_exercise = m.UserExercise.objects.filter(
            exercise=models.OuterRef("id"), user=request.user
        )
        exercises = filters.filter(m.Exercise.objects.filter(topic=topic)).annotate(
            is_correct=Coalesce(Subquery(user_exercise.values("is_correct")), None),
            favourite=Coalesce(Subquery(user_exercise.values("favourite")), False),
        )
        if exercises.exists():
            topic_exercises += [
                s.TopicExercise(
                    topic_short=topic.short,
                    topic_title=topic.title,
                    exercises=list(exercises),
                )
            ]
    return topic_exercises
