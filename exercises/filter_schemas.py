# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from functools import reduce
from typing import List, Optional

from django.db.models import Q
from ninja import Schema

from exercises import models as m


class ExerciseFilter(Schema):
    """Schema for filtering exercises
    With empty filter field:
      all object are being returned.
    With more than one filter field:
      All filters fields apply concatinated with AND.
      All inexact fields are OR concatinated.
    "^i.*" marks inexact filter fields.
    """

    topics: List[str] = []
    itopic_titles: List[str] = []
    enumbers: List[int] = []
    ititles: List[str] = []
    etags: List[str] = []
    ttags: List[str] = []
    diffs: List[int] = []

    def filter(self, exercises: m.ExerciseManager) -> m.ExerciseManager:
        q = Q()
        # Topic shorts
        if self.topics:
            q &= Q(topic__in=self.topics)
        # Topic titles
        q &= reduce(
            lambda a, b: a | Q(topic__title__icontains=b), self.itopic_titles, Q()
        )
        # Topic tags
        if self.ttags:
            q &= Q(topic__tag__in=self.ttags)
        # Exercise numbers
        if self.enumbers:
            q &= Q(enumber__in=self.enumbers)
        # Exercise titles
        q &= reduce(lambda a, b: a | Q(title__icontains=b), self.ititles, Q())
        # Exercise Difficulties
        if self.diffs:
            q &= Q(difficulty__in=self.diffs)
        # Exercise Tags
        for etag in self.etags:
            exercises = exercises.filter(tags=etag)
        return exercises.filter(q)


class TopicFilter(Schema):
    """Schema for filtering exercises
    With empty filter field:
      all object are being returned.
    With more than one filter field:
      All filters fields apply concatinated with AND.
      All list are OR concatiated.
    "^i.*" marks inexact filter fields.
    """

    ititles: List[str] = []
    tags: List[str] = []

    def filter(self) -> Q:
        q = Q()
        q &= reduce(lambda a, b: a | Q(title__icontains=b), self.ititles, Q())
        if self.tags:
            q &= Q(tag__in=self.tags)
        return q


class ExerciseSpec(Schema):
    enumber: int
    is_correct: Optional[bool]
    favourite: bool


class TopicExercise(Schema):
    """Used for listing exercises grouped by topic"""

    topic_short: str
    topic_title: str
    exercises: List[ExerciseSpec]
