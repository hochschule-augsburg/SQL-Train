# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

import json
from typing import List

from django.db import models
from django.db.models import Q, constraints

from exercises.utils import SQLField
from ltiapi.models import LTIUser

# Create your models here.


def topic_path(instance, filename):
    # TODO better path
    return f"{instance.short}/{filename}"


class Ttag(models.Model):
    name = models.CharField(max_length=20, primary_key=True)


class Topic(models.Model):
    # Primary keys cannot be translated
    short = models.SlugField(
        max_length=10, primary_key=True, help_text="Not translated primary key"
    )
    title = models.CharField(max_length=50)
    visible = models.BooleanField(default=False)
    tag = models.ForeignKey(Ttag, on_delete=models.SET_NULL, null=True)
    datamodel_representation = models.FileField(
        upload_to=topic_path,
        help_text="Students get the datamodel as a graphical representation of \
            the table structures. Upload an image preferably an svg.",
    )
    datamodel_script = models.FileField(
        upload_to=topic_path,
        help_text="This script get executed when the datamodel is being installed\
              or reseted.\n It must contain the DDL and insert statements for each tables.",
    )

    def __str__(self) -> str:
        return f"{self.short}"

    class Meta:
        ordering = ["title", "tag"]


class Etag(models.Model):
    name = models.CharField(max_length=50, primary_key=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["name"]


class ExerciseManager(models.Manager):
    def get_by_natural_key(self, topic, enumber):
        return self.get(topic=topic, enumber=enumber)


class Exercise(models.Model):
    class Difficulty(models.IntegerChoices):
        EASY = 1
        NORMAL = 2
        HARD = 3

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    enumber = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=50)
    question = models.TextField()
    points = models.FloatField(default=5.0)
    difficulty = models.IntegerField(
        choices=Difficulty.choices, default=Difficulty.EASY
    )
    tags = models.ManyToManyField(Etag)

    check_order = models.BooleanField(
        help_text="If true it the user query result must have the\
              same order as the solution query result",
        default=False,
        null=False,
    )
    mandatory_list = models.TextField(
        blank=True,
        help_text="""
        Case-insensitive list of SQL Keywords which must be used in the solution.
        Example: ["Right Join", "MINUS"]
        """,
        default="[  ]",
    )
    deny_list = models.TextField(
        blank=True,
        help_text="""
        Case-insensitive list of SQL Keywords which must not be used in
          the solution.
        Example: ["Right Join", "MINUS"]
        """,
        default="[  ]",
    )
    is_select = models.BooleanField(
        default=True,
        help_text="""
        For Evaluation of the user solution
        If true: After the user query is executed the eval_statement will be executed\
            the result of the statement will be set as is_correct
        """,
    )
    eval_statement = SQLField(
        null=True,
        blank=True,
        help_text="""For non-SELECT-Statements:
        Outputs true if UserSolution correct otherwise false.
        Example:    Exercise: Delete all images that are not assigned to a collection.
                    eval_statement: 
                        "SELECT NOT EXISTS(
                            SELECT photo from photo
                            except
                            select photo from collectphoto
                        ) AS out;"
        """,
    )

    objects = ExerciseManager()

    def natural_key(self):
        return (self.topic.short, self.enumber)

    def get_mandatory_list(self) -> List[str]:
        return json.loads(self.mandatory_list)

    def get_deny_list(self) -> List[str]:
        return json.loads(self.deny_list)

    def __str__(self) -> str:
        return f"{self.topic}/{self.enumber}"

    class Meta:
        ordering = ["topic", "enumber"]
        constraints = [
            constraints.UniqueConstraint(fields=["topic", "enumber"], name="exer_pk"),
            constraints.CheckConstraint(
                check=Q(is_select=True) | ~Q(eval_statement=None),
                name="""If the solution to the exercise is not a select
                an eval_statement must be given""",
            ),
        ]


class SolutionManager(models.Manager):
    def get_by_natural_key(self, snumber, topic, enumber):
        return self.get(
            exercise__topic=topic, exercise__enumber=enumber, snumber=snumber
        )


class Solution(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    snumber = models.PositiveSmallIntegerField()
    sql = SQLField()
    description = models.TextField(blank=True)

    objects = SolutionManager()

    def natural_key(self):
        return (self.snumber,) + self.exercise.natural_key()

    natural_key.dependencies = ["exercises.exercise"]  # type: ignore

    def __str__(self) -> str:
        return f"{self.exercise}/{self.snumber}"

    class Meta:
        ordering = ["exercise", "snumber"]
        constraints = [
            constraints.UniqueConstraint(
                fields=["exercise", "snumber"], name="solution_pk"
            )
        ]


class UserExercise(models.Model):
    user = models.ForeignKey(LTIUser, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    is_correct = models.BooleanField(null=True)
    buffer_save = models.TextField(blank=True)
    favourite = models.BooleanField(default=False)

    class Meta:
        ordering = ["user", "exercise"]
        constraints = [
            constraints.UniqueConstraint(
                fields=["user", "exercise"], name="user_exer_pk"
            )
        ]

    def __str__(self) -> str:
        return f"{self.user.username}/{self.exercise}"
