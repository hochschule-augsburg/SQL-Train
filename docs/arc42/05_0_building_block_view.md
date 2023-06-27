<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Building Block View

## Whitebox Overall System
```mermaid
C4Container
    title Overview diagram for SQL-Train
		
    SystemDb_Ext(pg-stud, "PG-Stud of University", "Database for all students")
	ContainerDb(djangodb, "Database for Django")
	Container(nginx, "Nginx")
    Person(student, "Student")
	Container(django_project, "sql-training", "backend", "Django+Ninja")
	Component(spa, "React App", "frontend", "App for students")
	System_Ext(lms, "LMS of University", "Moodle")

	Rel(nginx, django_project, "Proxy")
    Rel(django_project, djangodb, "Uses")
	Rel(django_project, pg-stud, "Uses", "host trust")
	Rel(student, lms, "Login")
	Rel(student, nginx, "redirects and gives data", "HTTPS")
	Rel(nginx, spa, "Serves", "HTTPS")
	Rel(spa, django_project, "Uses API", "HTTPS/Session")
```

### Motivation  

SQL-Train provides the student with SQL exercises. They can work on those on
their own database located in the university. The authorization is done via
LTI with the LMS of the university.

Contained Building Blocks  
* Frontend React Single Page Application
* Backend Django project with Ninja API

The remaining containers are explained in the [Deployment View](07_deployment_view.md).
