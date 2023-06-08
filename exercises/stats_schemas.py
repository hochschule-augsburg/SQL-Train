# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from ninja import Schema


class Stats(Schema):
    total: int
    started: int
    correct: int
    wrong: int


class Course(Schema):
    user_num: int
