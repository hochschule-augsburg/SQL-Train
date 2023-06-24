from django.http import HttpRequest
from django.shortcuts import render

import exercises.models as m


def data_model(request: HttpRequest, topic: str):
    return render(
        request,
        "exercises/dataModel.html",
        {
            "topic": topic,
            "datamodel_url": m.Topic.objects.get(short=topic).datamodel_representation,
        },
    )
