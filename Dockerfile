# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

# base image
FROM nikolaik/python-nodejs:python3.11-nodejs19-bullseye

# set work dir
WORKDIR /sql-training

# env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# logging:
RUN mkdir -p /var/log/sql-training/

# install cron and debug tools
RUN apt update
RUN apt install -y cron vim iproute2
RUN crontab -l | { cat; echo "* 4 * * * (cd /sql-training; /usr/bin/python3 /sql-training/manage.py clearsessions 2>&1)"; } | crontab -
RUN crontab -l | { cat; echo "0 1 16 3 * (cd /sql-training; /usr/bin/python3 /sql-training/manage.py clearusers 2>&1)"; } | crontab -
RUN crontab -l | { cat; echo "0 1 1 10 * (cd /sql-training; /usr/bin/python3 /sql-training/manage.py clearusers 2>&1)"; } | crontab -

# set up everything needed for django
RUN python3 -m pip install --upgrade pip
COPY . .
RUN pip install -r requirements.txt
RUN npm install --prefix frontend/
RUN npm run build --prefix frontend/
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate


# open container port
EXPOSE 8000

# start with entry-point.sh
RUN chmod +x /sql-training/entry-point.sh
CMD ["/sql-training/entry-point.sh"]

