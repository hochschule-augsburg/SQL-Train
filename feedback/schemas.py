# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from ninja import ModelSchema

from feedback import models as m


class FeedbackMessage(ModelSchema):
    class Config:
        model = m.FeedbackMessage
        model_exclude = ["id"]


class Feedback(ModelSchema):
    general: FeedbackMessage
    ui: FeedbackMessage
    ux: FeedbackMessage

    class Config:
        model = m.Feedback
        model_exclude = ["id", "datetime"]
