#!/bin/bash

# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

cron &
(cd /sql-training; python manage.py collectstatic --no-input)
python -m gunicorn sql_training.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers=2 
