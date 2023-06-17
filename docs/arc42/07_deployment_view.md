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

## Network Topology

The nodes shown above communicate via the intranet of the TH-A. 

Moodle is accessible from outside of the TH-A, for sql-train, rdbs and pg-stud it was explicitly decided not to make them available from outside the internal network.