# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

import ctypes
import json
import os
import sys
import threading
import unittest
from unittest.mock import MagicMock, patch

from django.conf import settings
from django.test import RequestFactory, TestCase, tag

import exercises.models as m
import pg_stud
from ltiapi.models import LTIUser
from pg_stud.api import (
    ExerciseSpeciIn,
    Message,
    QueryIn,
    QueryOut,
    Result,
    check_answer_correct_api,
    check_or_install_db,
    execute_query,
    is_installed,
    reset_db,
    solution_result,
)
from pg_stud.pg_conn_pool import PgConnPool
from sql_training.settings import FIXTURE_DIRS


@unittest.skipIf(False, "Skip pg_stud test")
class PgStudTestCase(TestCase):
    fixtures = [
        # "exercises/fixtures/common_test.yaml",
        # "exercises/fixtures/pc_test.yaml",
        "common_test.yaml",
        "pc_test.yaml",
    ]

    # create user and request factory
    def setUp(self):
        self.factory = RequestFactory()
        settings.MEDIA_ROOT = settings.BASE_DIR / "exercises/fixtures/"
        self.maxDiff = None
        self.user = LTIUser.objects.create_user(username="mitro", password="testpw")

    # how uninstall schema in order to test?
    def test_check_or_install_db(self):
        data = ExerciseSpeciIn(topic_short="pc", enumber=3)
        request = self.factory.post("/api/pg-stud/check_or_install_db/", data.dict())
        request.user = self.user

        response = check_or_install_db(request, data)
        with PgConnPool().get_pool(self.user).connection() as conn:
            self.assertTrue(is_installed(conn, topic=m.Topic.objects.get(short="pc")))

        expected_data = {"message": "Already Installed!"}

        self.assertDictEqual(response.dict(), expected_data)

    def test_reset_db(self):
        # delete all entries with nb02
        updated_data = QueryIn(
            topic_short="pc", enumber=1, query="delete from photo where photo = 'nb02'"
        )
        update_request = self.factory.post(
            "/api/pg-stud/execute_query/", updated_data.dict()
        )
        update_request.user = self.user
        execute_query(update_request, updated_data)

        # select nb02 -> should be empty
        select_data = QueryIn(
            topic_short="pc",
            enumber=1,
            query="select * from photo where photo = 'nb02'",
        )
        select_request = self.factory.post(
            "/api/pg-stud/execute_query/", select_data.dict()
        )
        select_request.user = self.user
        select_response = execute_query(select_request, select_data)
        select_response_dict = json.loads(select_response.json())
        empty_response = {
            "result": {
                "result": [
                    {
                        "date": "",
                        "height": "",
                        "photo": "",
                        "source": "",
                        "title": "",
                        "type": "",
                        "width": "",
                    }
                ],
                "miss_cols": [],
                "miss_rows": [],
            }
        }
        self.assertDictEqual(select_response_dict, empty_response)

        # Call reset db function
        data = ExerciseSpeciIn(topic_short="pc", enumber=1)
        request = self.factory.post("/api/pg-stud/reset_db/", data.dict())
        request.user = self.user

        response = reset_db(request, data)
        self.assertIsInstance(response, Message)
        response_dict = json.loads(response.json())

        expected_data = {"message": "Reseted Successfully!"}
        self.assertDictEqual(response_dict, expected_data)

        # select all entries with nb02 -> now should be there cause of reset
        select_data = QueryIn(
            topic_short="pc",
            enumber=1,
            query="select * from photo where photo = 'nb02'",
        )
        select_request = self.factory.post(
            "/api/pg-stud/execute_query/", select_data.dict()
        )
        select_request.user = self.user
        select_response = execute_query(select_request, select_data)
        select_response_dict = json.loads(select_response.json())
        expected_response = {
            "result": {
                "result": [
                    {
                        "photo": "nb02",
                        "title": "Example 1",
                        "date": "2005-03-20",
                        "source": "Mar",
                        "type": "tif",
                        "height": 360,
                        "width": 240,
                    }
                ],
                "miss_cols": [],
                "miss_rows": [],
            }
        }
        self.assertDictEqual(select_response_dict, expected_response)

    def test_execute_query(self):
        # Create request and input data
        data = QueryIn(
            topic_short="pc",
            enumber=1,
            query="select * from photo where photo = 'nb02'",
        )
        request = self.factory.post("/api/pg-stud/execute_query/", data.dict())
        request.user = self.user

        # Call function
        response = execute_query(request, data)
        response_dict = json.loads(response.json())

        # Check that the response is a QueryOut object
        self.assertIsInstance(response, QueryOut)

        expected_response = {
            "result": {
                "result": [
                    {
                        "photo": "nb02",
                        "title": "Example 1",
                        "date": "2005-03-20",
                        "source": "Mar",
                        "type": "tif",
                        "height": 360,
                        "width": 240,
                    }
                ],
                "miss_cols": [],
                "miss_rows": [],
            }
        }
        self.assertDictEqual(response_dict, expected_response)

    def test_check_answer_correct(self):
        data = QueryIn(
            topic_short="pc",
            enumber=3,
            query="""
                SELECT TO_CHAR(date,'dd.mm.yyyy') date FROM photo where photo='nb02';""",
        )
        request = self.factory.post("/api/pg-stud/check_answer_correct/", data.dict())
        request.user = self.user

        response = check_answer_correct_api(request, data)
        # convert response into dictionary
        response_dict = json.loads(response.json())

        expected_data = {
            "correct": True,
            "message": "",
            "user_result": {
                "result": [{"date": "20.03.2005"}],
                "miss_cols": [],
                "miss_rows": [],
            },
            "solu_result": {
                "result": [{"date": "20.03.2005"}],
                "miss_cols": [],
                "miss_rows": [],
            },
        }
        # compare both dictionaries
        self.assertDictEqual(response_dict, expected_data)

    def test_solution_result(self):
        data = ExerciseSpeciIn(topic_short="pc", enumber="3")
        request = self.factory.post("/api/pg-stud/solution_result/", data.dict())
        request.user = self.user

        response = solution_result(request, data)
        response_dict = json.loads(response.json())

        expected_data = {
            "result": {
                "result": [{"date": "20.03.2005"}],
                "miss_cols": [],
                "miss_rows": [],
            }
        }
        self.assertDictEqual(response_dict, expected_data)

    def test_execute_duplicate_columns(self):
        # Create request and input data
        data = QueryIn(
            topic_short="pc",
            enumber=1,
            query="select photo, photo from photo where photo='nb02';",
        )
        request = self.factory.post("/api/pg-stud/execute_query/", data.dict())
        request.user = self.user

        # Call function
        response = execute_query(request, data)
        response_dict = json.loads(response.json())

        # Check that the response is a QueryOut object
        self.assertIsInstance(response, QueryOut)

        expected_response = {
            "result": {
                "result": [
                    {
                        "photo0": "nb02",
                        "photo1": "nb02",
                    }
                ],
                "miss_cols": [],
                "miss_rows": [],
            }
        }
        self.assertDictEqual(response_dict, expected_response)


class AllExercises(TestCase):
    fixtures = list(
        map(
            lambda f: f[:-5],
            filter(lambda f: f.endswith(".yaml"), os.listdir(FIXTURE_DIRS[0])),
        )
    )

    # create user and request factory
    def setUp(self):
        self.factory = RequestFactory()
        self.maxDiff = None
        self.user = LTIUser.objects.create_user(username="mitro", password="testpw")

    def check_answer(self, e: m.Exercise):
        data = QueryIn(
            topic_short=e.topic.short,
            enumber=e.enumber,
            query=m.Solution.objects.get(exercise=e, snumber=1).sql,
        )
        request = self.factory.post("/api/pg-stud/check_answer_correct/", data.dict())
        request.user = self.user

        response = check_answer_correct_api(request, data)
        self.assertTrue(response.correct, f"{e} failed")

    @tag("slow")
    def test_all_exercises(self):
        for e in m.Exercise.objects.all():
            try:
                m.Solution.objects.get(exercise=e, snumber=1).sql,
            except Exception:
                print(e)
            self.check_answer(e)
