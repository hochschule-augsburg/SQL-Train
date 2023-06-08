# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

import colorsys
import json

from django.http import HttpRequest
from django.urls import reverse


def absolute_reverse(request: HttpRequest, *args, **kwargs):
    return request.build_absolute_uri(reverse(*args, **kwargs))


def hex2rgb(hexcode):
    return tuple(int(hexcode.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))


def lighten_color(color: str, amount=0.5):
    """
    Lightens the given color by multiplying (1-luminosity) by the given amount.
    Input can be matplotlib color string, hex string, or RGB tuple.

    Examples:
    >> lighten_color('g', 0.3)
    >> lighten_color('#F034A3', 0.6)
    >> lighten_color((.3,.55,.1), 0.5)
    """
    c = hex2rgb(color)

    c = colorsys.rgb_to_hls(c[0], c[1], c[2])
    return colorsys.hls_to_rgb(c[0], 1 - amount * (1 - c[1]), c[2])


def load_theme_colors():
    with open("frontend/src/config.json") as frontend_config:
        theme_colors = {
            "theme_" + k.lower(): v
            for k, v in json.load(frontend_config)["THEME_COLORS"].items()
        }
    theme_colors[
        "theme_primary_hover"
    ] = f"rgb{lighten_color(theme_colors['theme_primary'], 1.3)}"
    return theme_colors
