<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Deployment View

## Infrastructure Level 1

**_VM with Docker_**

![Level 1 Deployment Diagram](./drawio/deployment.drawio.svg)

| Node/Artifact | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| sql-training  | VM / Server running our project.                             |
| nginx         | Webserver that enforces TLS, serves static files and implements rate limiting. |
| Docker        | Contains the django instance and the memcached service.      |
| Moodle        | LMS instance that offers students access to sql-train.       |
| pg-stud       | This Postgres server hosts the instance on which student exercises will be performed. |
| rdbs          | Central postgres instance that contains the application data of sql-train.s |

### Important decisions

**Docker**

To keep our project independent from the underlying operating system we dicided to use a debian based docker image to run sql-train.

**nginx**

For easy maintainability and configuration we decided to use nginx on the host directly to manage the incoming requests and enforce TLS encryption as well as rate limiting for requests to prevent attacks on the system.

**rdbs**

As the TH-A provides a centralized PostgreSQL to be used for server applications we kept the location of the rdbs configurable and recommend such a server as we use.

### Performance and optimization decisions

**PostgreSQL Connection Pooling**

For each user a pool with multiple connections is created. The goal is to ensure that multiple SQL statements can be performed in the least possible time, e.g. checking the solution as well as the users statement.

Connection pooling is also used by the Django ORM.

**django ASGI**

To ensure that sql-train can handle future extension with asynchronous requests we used Gunicorn and Uvicorn. Instead of directly starting a django instance we use Gunicorn, a server and process manager. In combination with Uvicorn workers this allows us to run ASGI applications. 

## Network Topology

The nodes shown above communicate via the intranet of the TH-A. 

For our use case the LMS Moodle is accessible from outside of the TH-A, for sql-train, rdbs and pg-stud it was explicitly decided not to make them available from outside the internal network.