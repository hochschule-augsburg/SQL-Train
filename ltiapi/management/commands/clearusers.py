# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

# Taken from https://github.com/Hyperchalk/Hyperchalk/


import logging
from datetime import date, datetime

import djclick as click
import pytz

from ltiapi import models as m


@click.command()
@click.option(
    "--ss_end",
    default=datetime.strptime("09-30", "%m-%d"),
    show_default=True,
    type=click.types.DateTime(["%m-%d"]),
    help='"%m-%d" for the end of summer term',
)
@click.option(
    "--ws_end",
    default=datetime.strptime("03-14", "%m-%d"),
    show_default=True,
    type=click.types.DateTime(["%m-%d"]),
    help='"%m-%d" for the end of winter term',
)
def command(ss_end: datetime, ws_end: datetime):
    # users that were created before the end of the last semester will be deleted including their user-exercises
    # staff and superusers will not be affected
    ss_end = ss_end.date().replace(year=date.today().year)
    ws_end = ws_end.date().replace(year=date.today().year)

    users = ""
    # after end of summer-semester -> delete all users created beforehand
    if (date.today() > ws_end) and (date.today() > ss_end):
        ss_end_datetime = datetime(
            ss_end.year, ss_end.month, ss_end.day, 0, 0, 0, tzinfo=pytz.UTC
        )
        users = get_users_to_date(ss_end_datetime)
    # after end of winter-semester -> delete all users created beforehand
    elif date.today() > ws_end:
        ws_end_datetime = datetime(
            ws_end.year, ws_end.month, ws_end.day, 0, 0, 0, tzinfo=pytz.UTC
        )
        users = get_users_to_date(ws_end_datetime)
    # up to the end of the ws -> delete all users created in the summer-semester the year before
    elif date.today() < ws_end:
        ss_end_last_datetime = datetime(
            ws_end.year - 1, ws_end.month, ws_end.day, 0, 0, 0, tzinfo=pytz.UTC
        )
        users = get_users_to_date(ss_end_last_datetime)

    logging.info("Deleting users:")
    for user in users:
        logging.info(user.get_username())
        user.delete()
    logging.info(
        "Deleted all non-staff/-admin users up to the end of the last semester."
    )
    print(f"Deleted {len(users)} non staff/superusers.")


def get_users_to_date(semester_end):
    # return all users up to semester_end that are no superuser or staff
    return m.LTIUser.objects.filter(
        date_joined__lte=str(semester_end), is_superuser="False", is_staff="False"
    )
