# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from typing import Any, Dict, List, Optional

import psycopg

# disabled because C compiler is needed for install for better performance uncomment
# import psycopg_c
from django.utils.translation import gettext_lazy as _
from psycopg import sql
from psycopg.connection import Connection
from psycopg.cursor import Cursor

from exercises import models as m
from ltiapi.models import LTIUser


def set_search_path(cursor: Cursor, topic: m.Topic) -> None:
    """Sets cursor's search_path to the schema of the topic"""
    # Reset by default after session end
    cursor.execute(
        sql.SQL("SET search_path TO {};").format(sql.Identifier(topic.short))
    )


def is_installed(conn: Connection, topic: m.Topic) -> bool:
    """Checks if the schema of the topic is install on the user database
    Args:
        conn: Connection with autocommit off
    """
    query = """SELECT EXISTS(SELECT 1 FROM information_schema.schemata
                 WHERE schema_name = %s);"""
    with conn.cursor() as cursor:
        cursor.execute(query, (topic.short,))
        conn.commit()
        result = cursor.fetchone()
        return result[0]  # type: ignore


def install_db(cursor: Cursor, topic: m.Topic) -> None:
    """Installs the topic's linked script by executing it in a schema named after
    the topic"""
    cursor.execute(sql.SQL("CREATE SCHEMA {};").format(sql.Identifier(topic.short)))
    set_search_path(cursor, topic)
    with open(topic.datamodel_script.path) as script:
        cursor.execute(script.read())


def uninstall_db(cursor: Cursor, topic: m.Topic) -> None:
    """Uninstalls the topic schema by droping it."""
    cursor.execute(
        sql.SQL("DROP SCHEMA {} CASCADE").format(sql.Identifier(topic.short))
    )


def execute(conn: Connection, query: str, topic: m.Topic) -> List[Dict[str, Any]]:
    """Executes a query on the connection.
    If the query has an error the only key "error_in_query" is filled with the
       error message.
    If the query outputs nothing the only key "no_output" is set with the message
       from Postgres
    """
    with conn.cursor(row_factory=psycopg.rows.dict_row) as cursor:
        try:
            set_search_path(cursor, topic)
            cursor.execute(query)
            conn.commit()
            result = cursor.fetchall()
            # When no row is returned
            if result == []:
                return [{"no_output": ""}]
            return result
        except psycopg.ProgrammingError as e:
            return [{"no_output": e.args}]
        except Exception as e:
            # error messages should always be english.
            return [{"error_in_query": e.args}]


def execute_check(conn: Connection, query: str, topic: m.Topic) -> bool:
    """Executes queries with only produce a boolean
    If an Exception occurs False is returned.
    """
    try:
        with conn.cursor() as cursor:
            set_search_path(cursor, topic)
            cursor.execute(query)
            out = cursor.fetchone()
            assert out is not None
            return out[0]
    except Exception:
        return False


def update_user_exercise(
    user: LTIUser,
    exercise: m.Exercise,
    buffer_save: str,
    is_correct: Optional[bool] = None,
):
    """Updates the specified UserExercise with buffer and optionally is_correct."""
    defaults: Dict[str, Any] = {"buffer_save": buffer_save}
    if is_correct is not None:
        defaults |= {"is_correct": is_correct}
    m.UserExercise.objects.update_or_create(
        user=user, exercise=exercise, defaults=defaults
    )


def do_reset_db(conn: Connection, topic: m.Topic, exercise: m.Exercise):
    """Resets db to specific exercise

    Args:
        conn (Connection): Connection, needs to be fresh
        topic (m.Topic): topic
        exercise (m.Exercise): exercise
    """
    conn.autocommit = False  # let script decide when to commit

    with conn.cursor() as cursor:
        # Uninstall
        if is_installed(conn, topic):
            uninstall_db(cursor, topic)
            conn.commit()
        # Install
        install_db(cursor, topic)
        conn.commit()
        # Execute past solutions
        past_solutions = m.Solution.objects.filter(
            snumber=1,
            exercise__topic=topic,
            exercise__enumber__lt=exercise.enumber,
            exercise__is_select=False,
        )
        for solution in past_solutions:
            execute(conn, solution.sql, topic)
            conn.commit()
