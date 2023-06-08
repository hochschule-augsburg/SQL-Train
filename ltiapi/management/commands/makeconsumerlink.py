# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later
#
# This file was copied and altered from its original location
# at <https://github.com/Hyperchalk/Hyperchalk/>.

from typing import Optional
from urllib.parse import urlunsplit

import djclick as click
from django.urls import reverse

from ltiapi import models as m
from ltiapi.utils import build_absolute_uri_without_request
from sql_training import settings


@click.command()
@click.option("--name", prompt="Name for the consumer (just for the admin)")
@click.option("--protocol", default="https")
def command(name, protocol):
    link = m.OneOffRegistrationLink(consumer_name=name)
    link.save()
    link_uri = build_absolute_uri_without_request(
        reverse("lti:register-consumer", args=[link.pk]), protocol=protocol
    )
    print(
        f"Please hand the following link to the administrator of the LTI consumer: {link_uri}"
    )
