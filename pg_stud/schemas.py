# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from typing import Any, Dict, List, Optional

from ninja import Schema


class Result(Schema):
    """Schema for result data and marking for wrong columns and rows.
    Leave miss_* to default if no marking is needed"""

    result: List[Dict[str, Any]]
    miss_cols: List[str] = []
    miss_rows: List[int] = []


class QueryIn(Schema):
    topic_short: str
    enumber: int
    query: str


class QueryOut(Schema):
    result: Result


class CheckAnswerOut(Schema):
    correct: bool
    message: Optional[str] = None
    user_result: Result
    solu_result: Result


class ExerciseSpeciIn(Schema):
    topic_short: str
    enumber: int


class Message(Schema):
    message: str
