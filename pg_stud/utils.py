# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from collections import Counter
from itertools import chain
from typing import Any, Dict, Iterable, List, Optional

# disabled because C compiler is needed for install for better performance uncomment
# import psycopg_c
from django.utils.translation import gettext_lazy as _
from psycopg import ProgrammingError, rows, sql
from psycopg.connection import Connection
from psycopg.cursor import BaseCursor, Cursor

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

    Returns:
        If the query has an error [{'error_in_query': e.args}] is returned.
        For non-SELECT-like queries which do not produce output
          [{'no_output': e.args}] is returned.
        When no row is returned because there was no entry found a list with a
         dict column to "" is returned
        >>> execute(conn, "SELECT * FROM table")
        [{"column1": "1", "column2": "2"}, {"column1": "3", "column2": None}]
        >>> execute(conn, "BAD SQL STATEMENT")
        [{"error_in_query": "Syntaxfehler bei »ERROR« LINE 1: ERROR ^"}]
        >>> execute(conn, "SELECT * FROM table where column1='not_exists'")
        [{"column1": "", "column2": ""}]
    """
    with conn.cursor(row_factory=dict_row) as cursor:
        try:
            set_search_path(cursor, topic)
            cursor.execute(query)
            conn.commit()
            result = cursor.fetchall()
            if result == []:
                # When no row is returned because there was no entry found
                return [{col.name: "" for col in cursor.description}]
            return result
        except ProgrammingError as e:
            # For statements like 'CREATE TABLE' which do not produce a result
            return [{"no_output": e.args}]
        # except Exception as e:
        #     # error messages should always be english.
        #     return [{"error_in_query": e.args}]


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


def dict_row(cursor: BaseCursor[Any, Any]) -> rows.RowMaker[rows.DictRow]:
    """Row factory to represent rows as dictionaries. Copied from psycopg3
    With support for columns with the same name.

    The dictionary keys are taken from the column names of the returned columns.
    """
    names = rows._get_names(cursor)

    if names is None:
        return rows.no_result

    columns = numerate_duplicates(names)

    def dict_row_(values: rows.Sequence[Any]) -> Dict[str, Any]:
        return dict(zip(columns, values))  # type: ignore[arg-type]

    return dict_row_


def numerate_duplicates(input_list: Iterable[str]):
    return flatten_list(
        k if v == 1 else [f"{k}{i}" for i in range(v)]
        for k, v in Counter(col for col in input_list).items()
    )


def flatten_list(input_list: Iterable[List[Any] | Any]):
    """Flattens a list."""
    new_list = []
    for list_element in input_list:
        if type(list_element) is list:
            new_list += flatten_list(list_element)
        else:
            new_list += [list_element]

    return new_list
