# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.contrib.sessions.middleware import SessionMiddleware
from django.test import Client, RequestFactory, TestCase
from ninja.errors import HttpError

from feedback.api import create_feedback
from feedback.schemas import Feedback
from ltiapi.models import LTIUser

# Create your tests here.


class TestFeedback(TestCase):
    # run "python manage.py test" to execute test
    # create a LTI user and login
    def setUp(self):
        self.user = LTIUser.objects.create_user(username="mitro", password="testpw")
        self.factory = RequestFactory()
        self.client = Client()
        self.client.login(username="mitro", password="testpw")

    def test_create_feedback(self):
        feedback = Feedback(
            **{
                "general": {"stars": 5, "praise": "abc", "criticism": "def"},
                "ui": {"stars": 5, "praise": "abc", "criticism": "def"},
                "ux": {"stars": 5, "praise": "abc", "criticism": "def"},
                "improvements": "ghi",
            }
        )

        request = self.factory.post("/api/feedback/", feedback.dict())

        request.user = self.user
        middleware = SessionMiddleware(lambda x: x)
        middleware.process_request(request)
        request.session.save()

        for _ in range(3):
            response = create_feedback(request, feedback)
            self.assertListEqual(list(response.keys()), ["id"])

        with self.assertRaises(HttpError):
            create_feedback(request, feedback)
