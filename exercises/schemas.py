# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from typing import Optional

from ninja import ModelSchema, Schema

from exercises import models as m


class Userdata(Schema):
    username: str
    course_locale: Optional[str] = None
    course_title: Optional[str] = None
    course_return_url: Optional[str] = None
    lecturer: bool


class Ttag(ModelSchema):
    name: str

    class Config:
        model = m.Ttag
        model_fields = ["name"]


class Topic(ModelSchema):
    class Config:
        model = m.Topic
        model_fields = ["short", "title", "datamodel_representation", "tag"]


class Etag(ModelSchema):
    name: str

    class Config:
        model = m.Etag
        model_fields = ["name"]


class Exercise(ModelSchema):
    class Config:
        model = m.Exercise
        model_fields = [
            "id",
            "topic",
            "enumber",
            "title",
            "question",
            "difficulty",
            "points",
            "tags",
        ]


class ExerciseItem(ModelSchema):
    class Config:
        model = m.Exercise
        model_fields = [
            "id",
            "topic",
            "enumber",
            "title",
            "difficulty",
            "points",
            "tags",
        ]


class Solution(ModelSchema):
    class Config:
        model = m.Solution
        model_fields = ["id", "exercise", "snumber", "sql", "description"]


class UserExercise(ModelSchema):
    class Config:
        model = m.UserExercise
        model_fields = [
            "id",
            "exercise",
            "is_correct",
            "favourite",
            "buffer_save",
        ]


class UserExerciseItem(ModelSchema):
    """Used for lists"""

    class Config:
        model = m.UserExercise
        model_fields = [
            "id",
            "exercise",
            "is_correct",
            "favourite",
        ]


class Favourite(Schema):
    topic_short: str
    topic_title: str
    enumber: int
    difficulty: int


class TopicOverview(Schema):
    topic: str
    count_exercises: int
    count_correct: int
