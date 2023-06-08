# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from ninja import Router

from exercises import models as m
from pg_stud.evaluation import check_mand_deny_list, check_results
from pg_stud.pg_conn_pool import PgConnPool
from pg_stud.schemas import (
    CheckAnswerOut,
    ExerciseSpeciIn,
    Message,
    QueryIn,
    QueryOut,
    Result,
)
from pg_stud.utils import (
    do_reset_db,
    execute,
    execute_check,
    install_db,
    is_installed,
    update_user_exercise,
)

router = Router()


@router.post("execute_query/", response=QueryOut)
def execute_query(request: HttpRequest, data: QueryIn):
    """Executes Query without checking correctness and saves buffer
    Does not reset DB
    """
    topic = get_object_or_404(m.Topic, short=data.topic_short)
    exercise = get_object_or_404(m.Exercise, topic=topic, enumber=data.enumber)
    user_query = data.query

    with PgConnPool().get_pool(request.user).connection() as conn:
        query_result = execute(conn, user_query, topic)

    update_user_exercise(request.user, exercise, user_query)

    return QueryOut(result=Result(result=query_result))


@router.post("check_answer_correct/", response=CheckAnswerOut)
def check_answer_correct_api(request: HttpRequest, data: QueryIn):
    """Executes Query with checking correctness, saves buffer and correctness
    This also resets the DB.
    """
    topic = get_object_or_404(m.Topic, short=data.topic_short)
    exercise = get_object_or_404(m.Exercise, topic=topic, enumber=data.enumber)
    user_query = data.query

    # Reset DB
    with PgConnPool().get_pool(request.user).connection() as conn:
        do_reset_db(conn, topic, exercise)

    # Execute user query
    with PgConnPool().get_pool(request.user).connection() as conn:
        user_result = Result(result=execute(conn, user_query, topic))

    solu_result = Result(result=[{"no_output": ""}])
    correct = False
    # Evaluate
    if exercise.is_select:
        solution = m.Solution.objects.filter(exercise=exercise).first()
        with PgConnPool().get_pool(request.user).connection() as conn:
            solu_result.result = execute(conn, solution.sql, topic)
        correct = check_results(user_result, solu_result, exercise)
    else:
        with PgConnPool().get_pool(request.user).connection() as conn:
            correct = execute_check(conn, exercise.eval_statement, topic)
    message = check_mand_deny_list(user_query, exercise)
    correct = False if message else correct

    update_user_exercise(request.user, exercise, user_query, correct)

    return CheckAnswerOut(
        correct=correct,
        message=message,
        user_result=user_result,
        solu_result=solu_result,
    )


@router.post("solution_result/", response=QueryOut)
def solution_result(request: HttpRequest, data: ExerciseSpeciIn):
    """Returns the output of the Solution number 1 after reseting the DB"""
    topic = get_object_or_404(m.Topic, short=data.topic_short)
    exercise = get_object_or_404(m.Exercise, topic=topic, enumber=data.enumber)
    solution = m.Solution.objects.filter(exercise=exercise).first()

    with PgConnPool().get_pool(request.user).connection() as conn:
        do_reset_db(conn, topic, exercise)

    if exercise.is_select:
        with PgConnPool().get_pool(request.user).connection() as conn:
            solution_result = execute(conn, solution.sql, topic)
    else:
        solution_result = [{"no_output": ""}]

    return QueryOut(result=Result(result=solution_result))


@router.post("check_or_install_db/", response=Message)
def check_or_install_db(request: HttpRequest, data: ExerciseSpeciIn):
    """If the schema for the topic is not installed the db will be installed.
    enumber is being ignored"""
    topic = get_object_or_404(m.Topic, short=data.topic_short)

    with PgConnPool().get_pool(request.user).connection() as conn:
        conn.autocommit = False  # let script decide when to commit

        if is_installed(conn, topic):
            return Message(message="Already Installed!")

        with conn.cursor() as cursor:
            install_db(cursor, topic)
            conn.commit()

    return Message(message="Installed Successfully!")


@router.post("reset_db/", response=Message)
def reset_db(request: HttpRequest, data: ExerciseSpeciIn):
    """Resets DB to specific exercise"""
    topic = get_object_or_404(m.Topic, short=data.topic_short)
    exercise = get_object_or_404(m.Exercise, topic=topic, enumber=data.enumber)

    with PgConnPool().get_pool(request.user).connection() as conn:
        do_reset_db(conn, topic, exercise)

    return Message(message="Reseted Successfully!")
