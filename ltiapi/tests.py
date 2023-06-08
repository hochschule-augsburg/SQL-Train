# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

import json
from datetime import date, timedelta
from random import randint
from unittest import mock
from unittest.mock import MagicMock

from django.contrib.auth.models import Group
from django.test import TestCase
from django.utils import timezone
from freezegun import freeze_time
from ninja import ModelSchema

from ltiapi import models as m
from ltiapi.management.commands import clearusers
from ltiapi.models import INSTRUCTOR_ROLE
from ltiapi.utils import CLAIM, get_user_from_launch_data, is_superior
from sql_training.settings import BASE_DIR

# Create your tests here.


class User(TestCase):
    message_launch_data = json.load(
        open(BASE_DIR / "ltiapi" / "fixtures" / "test_message_launch_data.json")
    )

    def user_test(self, user):
        self.assertEqual(user.course.locale, "de")
        self.assertEqual(user.course.lms, "moodle.example.com")
        self.assertEqual(user.course.document_target, "window")
        self.assertEqual(user.course.tool_title, "Ex-Tool")

    def test_create_user_from_launch_data_learner(self):
        message_launch_data = self.message_launch_data.copy()
        user = get_user_from_launch_data(message_launch_data, None)
        self.user_test(user)
        self.assertEqual(user.groups.first().name, "membership#Learner")
        self.assertEqual(is_superior(user), False)
        user.groups.add(Group.objects.get_or_create(name=INSTRUCTOR_ROLE)[0])
        self.assertEqual(is_superior(user), True)

    def test_create_user_from_launch_data_instructor(self):
        message_launch_data = self.message_launch_data.copy()
        message_launch_data[CLAIM + "/roles"] = [
            "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
        ]
        user = get_user_from_launch_data(message_launch_data, None)
        self.user_test(user)
        self.assertEqual(user.groups.first().name, "membership#Instructor")
        self.assertEqual(is_superior(user), True)
        self.assertEqual(user.is_staff, True)


class CleanUser(TestCase):
    @freeze_time("2012-01-01")
    def setUp(self):
        self.ss_end = date(int(date.today().strftime("%Y")), 7, 31)  # - timedelta(365)
        self.ws_end = date(int(date.today().strftime("%Y")), 2, 15)
        with self.settings(USE_TZ=False):
            for i in range(0, 10):
                user = m.LTIUser.objects.create(username=f"ss{i}")
                user.date_joined = self.ss_end - timedelta(randint(1, 100))
                user.save()
                user = m.LTIUser.objects.create(username=f"ss{i}staff", is_staff=True)
                user.date_joined = self.ss_end - timedelta(randint(1, 100))
                user.save()
                user = m.LTIUser.objects.create(
                    username=f"ss{i}super", is_superuser=True
                )
                user.date_joined = self.ss_end - timedelta(randint(1, 100))
                user.save()
            for i in range(10, 25):
                user = m.LTIUser.objects.create(username=f"ws{i}")
                user.date_joined = self.ws_end - timedelta(randint(1, 100))
                user.save()
                user = m.LTIUser.objects.create(username=f"ws{i}staff", is_staff=True)
                user.date_joined = self.ws_end - timedelta(randint(1, 100))
                user.save()
                user = m.LTIUser.objects.create(
                    username=f"ws{i}super", is_superuser=True
                )
                user.date_joined = self.ws_end - timedelta(randint(1, 100))
                user.save()

        # print(self.ss_end, self.ws_end)
        # for user in m.LTIUser.objects.all():
        #     print(user.username, user.date_joined)

    @freeze_time("2012-04-28")
    def test_clearusersWS(self):
        clearusers.command()
        self.assertEqual(m.LTIUser.objects.count(), 60)

    @freeze_time("2012-10-15")
    def test_clearusersSS(self):
        clearusers.command()
        self.assertEqual(m.LTIUser.objects.count(), 50)

    @freeze_time("2012-02-14")
    def test_clearuserSS_last(self):
        clearusers.command()
        self.assertEqual(m.LTIUser.objects.count(), 75)
