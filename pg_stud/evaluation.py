# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

"""This module is for evaluation of user queries and results"""
from functools import reduce
from typing import Any, Dict, List, Optional

from django.utils.translation import gettext_lazy as _
from ninja import Schema

from exercises import models as m
from ltiapi.models import LTIUser
from pg_stud.schemas import Result


def check_mand_deny_list(user_query: str, exercise: m.Exercise) -> str:
    mand_message = _("Following keywords are missing in your query: ")
    deny_message = _(
        "Following keywords in your query are not allowed in this exercise: "
    )

    user_query = user_query.lower()
    mandatory_list = exercise.get_mandatory_list()
    deny_list = exercise.get_deny_list()

    # check if words are contained
    mand_words: List[str] = reduce(
        lambda a, b: a + [b] if b.lower() not in user_query else a, mandatory_list, []
    )
    deny_words: List[str] = reduce(
        lambda a, b: a + [b] if b.lower() in user_query else a, deny_list, []
    )
    # build message
    message = (mand_message + str(mand_words) if mand_words else "") + (
        deny_message + str(deny_words) if deny_words else ""
    )

    return message


def check_results(user: Result, solution: Result, exercise: m.Exercise) -> bool:
    # mark column names not the same on each
    user.miss_cols = list(user.result[0].keys() - solution.result[0].keys())
    solution.miss_cols = list(solution.result[0].keys() - user.result[0].keys())

    # If the user table does differ too much from the solution it is not
    #  being parsed
    if abs(len(user.result) - len(solution.result)) > 30:
        return False

    # Go through rows of user and solution and mark the other if not present
    for i, row in enumerate(solution.result):
        if row not in user.result:
            solution.miss_rows.append(i)
    for i, row in enumerate(user.result):
        if row not in solution.result:
            if i not in user.miss_rows:
                user.miss_rows.append(i)

    # shortcut without equal
    if (
        len(user.miss_cols)
        + len(user.miss_rows)
        + len(solution.miss_cols)
        + len(solution.miss_rows)
        > 0
    ):
        return False
    elif not exercise.check_order:
        return True

    return user.result == solution.result
