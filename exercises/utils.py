# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

from django.db import models
from django_ace import AceWidget


class SQLField(models.TextField):
    def formfield(self, **kwargs):
        return super().formfield(
            **{
                "max_length": self.max_length,
                **(
                    {
                        "widget": AceWidget(
                            mode="sql",
                            theme="twilight",
                            wordwrap=True,
                            width="620px",
                            height="300px",
                            minlines=None,
                            maxlines=None,
                            showprintmargin=False,
                            showinvisibles=False,
                            usesofttabs=True,
                            tabsize=None,
                            fontsize=None,
                            toolbar=False,
                            readonly=False,
                            showgutter=False,
                            behaviours=True,
                        )
                    }
                ),
                **kwargs,
            }
        )
