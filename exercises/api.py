# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from typing import List, Optional

from django.db import models
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from django.shortcuts import get_list_or_404, get_object_or_404
from ninja import Query, Router, Schema

from exercises import models as m
from exercises import schemas as s
from exercises.filter_api import router as filter_router
from exercises.stats_api import router as stats_router
from ltiapi.models import LTIUser
from ltiapi.utils import is_superior

router = Router()
router.add_router("filter", filter_router)
router.add_router("stats", stats_router)


@router.get("userdata", response=s.Userdata)
def get_userdata(request: HttpRequest):
    """Returns username of current user."""
    user = request.user
    if not user.course:
        return s.Userdata(username=user.lms_username, lecturer=is_superior(user))
    return s.Userdata(
        username=user.lms_username,
        course_locale=user.course.locale,
        course_title=user.course.title,
        course_return_url=user.course.return_url,
        lecturer=is_superior(user),
    )


@router.get("/topic/{topic_short}", response=s.Topic)
def get_topic(request: HttpRequest, topic_short):
    """Returns topic fields for topic_short."""
    topic = get_object_or_404(m.Topic, short=topic_short, visible=True)
    return topic


@router.get("/ttags", response=List[s.Ttag])
def list_ttag(request: HttpRequest):
    """Returns a list of all topic tags."""
    return m.Ttag.objects.all()


@router.get("/list_topics", response=List[s.Topic])
def list_topic(request):
    """Returns a list of all topics."""
    return m.Topic.objects.filter(visible=True)


@router.get("/etags", response=List[s.Etag])
def list_etag(request: HttpRequest):
    """Returns a list of all exercise tags."""
    return m.Etag.objects.all()


@router.get("/exercise/{topic_short}/{enumber}", response=s.Exercise)
def get_exercise(request, topic_short: str, enumber: int):
    """Returns exercise field by enumber and topic_short."""
    exercise = get_object_or_404(
        m.Exercise, topic=topic_short, topic__visible=True, enumber=enumber
    )
    return exercise


@router.get("/list_exercises", response=List[s.ExerciseItem])
def list_exercise(request: HttpRequest, topic_short: Optional[str] = None):
    """Returns a list of all exercises optionally filtered by topic_short."""
    if topic_short:
        return get_list_or_404(
            m.Exercise,
            topic=topic_short,
            topic__visible=True,
        )
    return m.Exercise.objects.all()


@router.get("/solution/{topic_short}/{enumber}/{snumber}", response=s.Solution)
def get_solution(request, topic_short: str, enumber: int, snumber: int):
    """Return solution fields by snumber, enumber, topic_short"""
    solution = get_object_or_404(
        m.Solution,
        exercise__topic=topic_short,
        exercise__topic__visible=True,
        exercise__enumber=enumber,
        snumber=snumber,
    )
    return solution


@router.get("/solutions", response=List[s.Solution])
def list_solution(
    request, topic_short: Optional[str] = None, enumber: Optional[int] = None
):
    """Return all solutions optionally filtered by enumber and topic_short."""
    if topic_short:
        if enumber:
            return get_list_or_404(
                m.Solution,
                exercise__topic=topic_short,
                exercise__topic__visible=True,
                exercise__enumber=enumber,
            )
        return get_list_or_404(m.Solution, exercise__topic=topic_short)
    return m.Solution.objects.all()


@router.get("/user_exercise/{topic_short}/{enumber}", response=s.UserExercise)
def get_user_exercise(request, topic_short: str, enumber: int):
    """Return user data for exercise by enumber and topic_short."""
    exercise = get_object_or_404(
        m.Exercise, topic=topic_short, enumber=enumber, topic__visible=True
    )
    user_exercise, _ = m.UserExercise.objects.get_or_create(
        user=request.user,
        exercise=exercise,
    )
    return user_exercise


@router.get("/user_exercises", response=List[s.UserExerciseItem])
def list_user_exercise(request, topic_short: Optional[str] = None):
    """Return all exercise user data optionally filtered by topic_short."""
    if topic_short:
        return m.UserExercise.objects.filter(
            exercise__topic=topic_short,
            user=request.user,
            exercise__topic__visible=True,
        )
    return m.UserExercise.objects.filter(
        user=request.user, exercise__topic__visible=True
    )


class UserExerciseIn(Schema):
    buffer_save: Optional[str] = None
    favourite: Optional[bool] = None


@router.patch("/user_exercise")
def patch_user_exercise(request, topic_short: str, enumber: int, data: UserExerciseIn):
    """Patches current user's exercise (topic_short, enumber) by provided data."""
    exercise = get_object_or_404(
        m.Exercise, topic=topic_short, enumber=enumber, topic__visible=True
    )
    defaults = {k: v for k, v in data.dict().items() if v is not None}

    m.UserExercise.objects.update_or_create(
        user=request.user, exercise=exercise, defaults=defaults
    )
    return {"success": True}


@router.get("/favourite_list", response=List[s.Favourite])
def list_favourite(request, topic_short: Optional[str] = None):
    """Return all favourites of current user optionally filtered by topic_short."""
    objects = m.UserExercise.objects.filter(
        user=request.user, favourite=True, exercise__topic__visible=True
    )
    if topic_short:
        objects = objects.filter(exercise__topic=topic_short)
    return objects.values(
        topic_short=models.F("exercise__topic"),
        topic_title=models.F("exercise__topic__title"),
        difficulty=models.F("exercise__difficulty"),
        enumber=models.F("exercise__enumber"),
    )


@router.get("/topics_overview", response=List[s.TopicOverview])
def get_topics_overview(request):
    """Return for all topics the number of exercises and
    the number of exercises correctly done by the current user."""
    # get the number of exercises per topic
    topics = (
        m.Exercise.objects.filter(topic__visible=True)
        .values("topic")
        .annotate(
            count_exercises=models.Count("enumber"),
        )
        .values("topic", "count_exercises")
    )
    # get the number of exercises correctly done by user per topic
    correct = (
        m.UserExercise.objects.filter(user=request.user)
        .values("exercise__topic")
        .filter(is_correct=True)
        .annotate(count_correct=models.Count("*"))
    )
    # combine the two and fill out nulls when no exercise was done correctly
    overview = topics.annotate(
        count_correct=Coalesce(
            models.Subquery(
                correct.filter(exercise__topic=models.OuterRef("topic")).values(
                    "count_correct"
                )
            ),
            0,
        )
    )
    return overview.order_by("topic")
