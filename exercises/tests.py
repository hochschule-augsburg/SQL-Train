# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

import unittest
from functools import reduce

from django.test import Client, TestCase

import exercises.models as m
from ltiapi.models import LTIUser

# Create your tests here.


@unittest.skipIf(False, "Skip exercises test")
class TestUserdata(TestCase):
    # run "python manage.py test" to execute test
    fixtures = [
        # "exercises/fixtures/common_test.yaml",
        # "exercises/fixtures/pc_test.yaml",
        "common_test.yaml",
        "pc_test.yaml",
    ]

    # create a LTI user and login
    def setUp(self):
        self.user = LTIUser.objects.create_user(username="mitro", password="testpw")
        self.client = Client()
        self.client.login(username="mitro", password="testpw")

    def test_get_topic(self):
        response = self.client.get("/api/topic/pc")
        self.assertEqual(response.status_code, 200)
        expected_data = {
            "short": "pc",
            "title": "Photo Collection",
            "datamodel_representation": "/pc/pc.drawio.svg",
            "tag": "Beginner",
        }
        self.assertEqual(response.json(), expected_data)

    def test_list_ttag(self):
        response = self.client.get("/api/ttags")
        self.assertEqual(response.status_code, 200)
        expected_data = [{"name": "Beginner"}]
        self.assertEqual(response.json(), expected_data)

    def test_list_topic(self):
        response = self.client.get("/api/list_topics")
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "short": "pc",
                "title": "Photo Collection",
                "datamodel_representation": "/pc/pc.drawio.svg",
                "tag": "Beginner",
            }
        ]
        self.assertEqual(response.json(), expected_data)

    # etags used for filtering
    def test_list_etag(self):
        response = self.client.get("/api/etags")
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {"name": "ALTER"},
            {"name": "COALESCE"},
            {"name": "COUNT"},
            {"name": "DATE"},
            {"name": "DELETE"},
            {"name": "JOIN"},
            {"name": "SELECT"},
            {"name": "Set"},
            {"name": "Subquery"},
            {"name": "UPDATE"},
            {"name": "calc"},
        ]
        self.assertEqual(response.json(), expected_data)

    def test_get_exercise(self):
        response = self.client.get("/api/exercise/pc/3")
        self.assertEqual(response.status_code, 200)
        # id wont be checked because it is different dependent on the fixture
        expected_data = {
            # "id": 3,
            "topic": "pc",
            "enumber": 3,
            "title": "Example Title 3",
            "question": "Example Question 3",
            "difficulty": 1,
            "points": 4.5,
            "tags": ["COUNT", "SELECT"],
        }
        response_data = response.json()
        # remove id here as well
        response_data.pop("id", None)
        self.assertEqual(response_data, expected_data)

    def test_list_exercise(self):
        response = self.client.get("/api/list_exercises?topic_short=pc")
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                # "id": 1,
                "topic": "pc",
                "enumber": 1,
                "title": "Example Title 1",
                "difficulty": 1,
                "points": 3.5,
                "tags": ["DATE", "SELECT", "Set"],
            },
            {  # "id": 2,
                "topic": "pc",
                "enumber": 2,
                "title": "Example Title 2",
                "difficulty": 1,
                "points": 4,
                "tags": ["DATE", "SELECT", "Subquery"],
            },
            {  # "id": 3,
                "topic": "pc",
                "enumber": 3,
                "title": "Example Title 3",
                "difficulty": 1,
                "points": 4.5,
                "tags": ["COUNT", "SELECT"],
            },
        ]
        response_data = response.json()
        for data in response_data:
            data.pop("id", None)
        self.assertEqual(response_data, expected_data)

    # TODO:
    # def test_filter_exercise():

    def test_get_solution(self):
        response = self.client.get("/api/solution/pc/1/1")
        self.assertEqual(response.status_code, 200)
        expected_data = {
            # "id": 1,
            "exercise": 1,
            "snumber": 1,
            "sql": "select collect\nfrom collect\nwhere date<date '2006-06-15' - interval '-6 months'\nexcept\nselect collect\nfrom collectphoto;",
            "description": "",
        }
        response_data = response.json()
        response_data.pop("id", None)
        self.assertEqual(response.json(), expected_data)

    def test_list_solution(self):
        topic_short = "pc"
        enumber = 1
        response = self.client.get(
            "/api/solutions?topic_short={}&enumber={}".format(topic_short, enumber)
        )
        self.assertEqual(response.status_code, 200)
        # exercise in the dict is id of exercise
        # like above, id is not always the same
        exercise = m.Exercise.objects.get(topic="pc", enumber=1).id
        expected_data = [
            {
                # "id": 1,
                "exercise": exercise,
                "snumber": 1,
                "sql": "select collect\nfrom collect\nwhere date<date '2006-06-15' - interval '-6 months'\nexcept\nselect collect\nfrom collectphoto;",
                "description": "",
            }
        ]
        response_data = response.json()
        response_data[0].pop("id", None)
        self.assertEqual(response_data, expected_data)

    def test_get_user_exercise(self):
        response = self.client.get("/api/user_exercise/pc/2")
        self.assertEqual(response.status_code, 200)
        exercise = m.Exercise.objects.get(topic="pc", enumber=2).id
        expected_data = {
            # "id": 1,
            "exercise": exercise,
            "is_correct": None,
            "favourite": False,
            "buffer_save": "",
        }
        response_data = response.json()
        response_data.pop("id", None)
        self.assertEqual(response_data, expected_data)

    def test_list_user_exercise(self):
        # create userexercises
        exer1 = m.Exercise.objects.get(topic="pc", enumber=1)
        exer2 = m.Exercise.objects.get(topic="pc", enumber=2)
        # set is_correct to true and false
        m.UserExercise.objects.create(user=self.user, exercise=exer1, is_correct=False)
        m.UserExercise.objects.create(user=self.user, exercise=exer2, is_correct=True)
        response = self.client.get("/api/user_exercises?topic_short=pc")
        self.assertEqual(response.status_code, 200)
        expected_exer1 = exer1.id
        expected_exer2 = exer2.id
        expected_data = [
            {
                #'id': 1,
                "exercise": expected_exer1,
                "is_correct": False,
                "favourite": False,
            },
            {  #'id': 2,
                "exercise": expected_exer2,
                "is_correct": True,
                "favourite": False,
            },
        ]
        response_data = response.json()
        for data in response_data:
            data.pop("id", None)
        self.assertEqual(response_data, expected_data)

    def test_list_favourite(self):
        exer1 = m.Exercise.objects.get(topic="pc", enumber=1)
        exer3 = m.Exercise.objects.get(topic="pc", enumber=3)
        # set favourite to true
        m.UserExercise.objects.create(user=self.user, exercise=exer1, favourite=True)
        m.UserExercise.objects.create(user=self.user, exercise=exer3, favourite=True)
        response = self.client.get("/api/favourite_list?topic_short=pc")
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "enumber": 1,
                "difficulty": 1,
            },
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "enumber": 3,
                "difficulty": 1,
            },
        ]

        self.assertEqual(response.json(), expected_data)

    def test_get_topics_overview(self):
        # create userexercises
        exer1 = m.Exercise.objects.get(topic="pc", enumber=1)
        exer2 = m.Exercise.objects.get(topic="pc", enumber=2)
        # set is_correct to true and false
        m.UserExercise.objects.create(user=self.user, exercise=exer1, is_correct=False)
        m.UserExercise.objects.create(user=self.user, exercise=exer2, is_correct=True)
        response = self.client.get("/api/topics_overview")
        self.assertEqual(response.status_code, 200)
        expected_data = [{"topic": "pc", "count_exercises": 3, "count_correct": 1}]
        self.assertEqual(response.json(), expected_data)

    # def test_(self):
    #     response = self.client.get('')
    #     self.assertEqual(response.status_code, 200)
    #     expected_data = ""
    #     self.assertEqual(response.json(), expected_data)

    def test_filter_topic(self):
        # test ititles
        ititle = "phot"
        test_url = "/api/filter/filter_topics?ititles={}".format(ititle)
        response = self.client.get(test_url)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "short": "pc",
                "title": "Photo Collection",
                "datamodel_representation": "/pc/pc.drawio.svg",
                "tag": "Beginner",
            }
        ]
        self.assertEqual(response.json(), expected_data)
        # test ttag
        ttag = "Beginner"
        test_url = "/api/filter/filter_topics?tags={}".format(ttag)
        response = self.client.get(test_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_data)
        # test ititles with ttag
        test_url = "/api/filter/filter_topics?tags={}&ititles={}".format(ttag, ititle)
        response = self.client.get(test_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_data)

    def test_filter_exercises(self):
        # test right topic
        queries = []
        ititle = "phot"
        test_url = "/api/filter/filter_exercises?"
        test_query = "itopic_titles={}".format(ititle)
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "exercises": [
                    {"enumber": 1, "is_correct": None, "favourite": False},
                    {"enumber": 2, "is_correct": None, "favourite": False},
                    {"enumber": 3, "is_correct": None, "favourite": False},
                ],
            }
        ]
        self.assertEqual(response.json(), expected_data)
        # test ttag
        ttag = "Beginner"
        test_query = "ttags={}".format(ttag)
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_data)
        # test ititles with ttag
        test_query = "ttags={}&itopic_titles={}".format(ttag, ititle)
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_data)

        # test etags
        etag1 = "SELECT"
        etag2 = "DATE"
        test_query = "etags={}&etags={}".format(etag1, etag2)
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "exercises": [
                    {"enumber": 1, "is_correct": None, "favourite": False},
                    {"enumber": 2, "is_correct": None, "favourite": False},
                ],
            }
        ]
        self.assertEqual(response.json(), expected_data)

        # test enumbers
        test_query = "enumbers=1&enumbers=2"
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "exercises": [
                    {"enumber": 1, "is_correct": None, "favourite": False},
                    {"enumber": 2, "is_correct": None, "favourite": False},
                ],
            }
        ]
        self.assertEqual(response.json(), expected_data)

        # test difficulties
        test_query = "diffs=2"
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        expected_data = []
        self.assertEqual(response.json(), expected_data)

        test_query = "diffs=1"
        queries += [test_query]
        response = self.client.get(test_url + test_query)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "exercises": [
                    {"enumber": 1, "is_correct": None, "favourite": False},
                    {"enumber": 2, "is_correct": None, "favourite": False},
                    {"enumber": 3, "is_correct": None, "favourite": False},
                ],
            }
        ]
        self.assertEqual(response.json(), expected_data)

        # all
        test_url = reduce(lambda a, b: a + "&" + b, queries, test_url)
        response = self.client.get(test_url)
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                "topic_short": "pc",
                "topic_title": "Photo Collection",
                "exercises": [
                    {"enumber": 1, "is_correct": None, "favourite": False},
                    {"enumber": 2, "is_correct": None, "favourite": False},
                ],
            }
        ]
        self.assertEqual(response.json(), expected_data)

        response = self.client.get(test_url + "&ititles=asdf")
        self.assertEqual(response.status_code, 200)
        expected_data = []
        self.assertEqual(response.json(), expected_data)


class UserData(TestCase):
    fixtures = [
        "ltiapi/fixtures/user.yaml",
        "common_test.yaml",
        "pc_test.yaml",
    ]

    def setUp(self):
        self.user = LTIUser.objects.first()
        self.client.force_login(self.user)

    def test_userdata(self):
        expect = {
            "username": "johndoe",
            "course_locale": "en",
            "course_title": "Example Course (Testprof)",
            # on purpose not set in test.json
            "course_return_url": None,
            # johndoe is staff
            "lecturer": True,
        }
        response = self.client.get("/api/userdata")
        self.assertDictEqual(response.json(), expect)
        self.user.is_staff = False
        self.user.save()
        expect["lecturer"] = False
        response = self.client.get("/api/userdata")
        self.assertDictEqual(response.json(), expect)

    def test_stats_exercises(self):
        # stats api only available to lectures and su
        self.user.is_staff = True
        # create userexercises
        exer1 = m.Exercise.objects.get(topic="pc", enumber=1)
        exer2 = m.Exercise.objects.get(topic="pc", enumber=2)
        # set is_correct to true and false
        m.UserExercise.objects.create(user=self.user, exercise=exer1, is_correct=False)
        m.UserExercise.objects.create(user=self.user, exercise=exer2, is_correct=True)
        response = self.client.get("/api/stats/exercises")
        self.assertEqual(response.status_code, 200)
        expected_data = {"total": 3, "started": 0, "correct": 1, "wrong": 1}
        self.assertEqual(response.json(), expected_data)
        # filtering was tested above.
