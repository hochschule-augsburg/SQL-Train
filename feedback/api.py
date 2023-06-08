# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.http import HttpResponse
from ninja import ModelSchema, Router
from ninja.errors import HttpError

from feedback import models as m
from feedback.schemas import Feedback

router = Router()

MAX_FEEDBACK = 3


@router.post("/")
def create_feedback(request: HttpResponse, data: Feedback):
    """Create Feedback. Only 3 Feedbacks are allowed."""
    request.session["num_of_feedback"] = request.session.get("num_of_feedback", 0) + 1
    if request.session["num_of_feedback"] > MAX_FEEDBACK:
        raise HttpError(401, "Too many Feedbacks")
    data_dict = data.dict()
    general = m.FeedbackMessage.objects.create(**data_dict.pop("general"))
    ui = m.FeedbackMessage.objects.create(**data_dict.pop("ui"))
    ux = m.FeedbackMessage.objects.create(**data_dict.pop("ux"))
    feedback = m.Feedback.objects.create(general=general, ui=ui, ux=ux, **data_dict)
    return {"id": feedback.id}
