<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Deployment View

## OS Infrastructure	

***VM with Docker***

![Alt text](./drawio/deployment.drawio.svg)

| Node/Artifact | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| sql-training  | VM / Server running our project.                             |
| nginx         | Webserver that enforces TLS, serves static files and implements rate limiting. |
| Docker        | Contains the django instance and the memcached service.      |
| Moodle        | LMS instance that offers students access to sql-train.       |
| pg-stud       | This Postgres server hosts the instance on which student exercises will be performed. |

The nodes shown above communicate via the intranet of the 

Motivation  
*\<explanation in text form>*

Quality and/or Performance Features  
*\<explanation in text form>*

Mapping of Building Blocks to Infrastructure  
*\<description of the mapping>*

## Network Topology

### *\<Infrastructure Element 1>*

*\<diagram + explanation>*

## Django Docker Container

## Get Started

### Setup nginx

#### Install
```bash
sudo apt-get install nginx
systemctl start nginx.service
```

#### Config

config file:
```bash
cp sql-training /etc/nginx/sites-available/sql-training.example.com
cp proxy_params /etc/nginx/ 
```

activate config:
```bash
ln -s /etc/nginx/sites-available/sql-training.examle.com /etc/nginx/sites-enabled/
systemctl restart nginx.service
```

### PostgreSQL

To setup the database for django choose a supported RDBMS (we recommmend PostgreSQL) and set conninfo in `.env`.
See https://help.ubuntu.com/community/PostgreSQL for a tutorial.

### Docker

```bash
# Set the environment variables from .env-example in .env
docker compose up --detach
```

### Initial configuration

```bash
docker exec -it django_container /bin/bash # open shell in container
python3 manage.py createsuperuser # Creates an admin user for the django admin page
python3 manage.py loaddata exercises_data/*.yaml # Due to copyright the exercises are not provided
```

