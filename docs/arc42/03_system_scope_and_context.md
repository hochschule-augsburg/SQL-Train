<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# System and Context

## Business Context

```mermaid
C4Context
    title SQL-Train Business Context
    Person(student, "Student")
    System_Ext(lms, "LMS of University", "Moodle")
    System(sql-train-server, "SQL-Train-Server")
    SystemDb_Ext(pg-stud, "PG-Stud of University", "Database for all students")
    System(sql-train-client, "SQL-Train-Client")
    Person(lecturer, "Lecturer")

    Rel(sql-train-server, pg-stud, "Uses", "host trust")
    Rel(student, lms, "Login")
    Rel(lms, sql-train-server, "login data")
    Rel(student, sql-train-client, "Uses App")
    BiRel(sql-train-client, sql-train-server, "")
    Rel(lecturer, sql-train-client, "Analytics of course")
    Rel(lecturer, sql-train-server, "Creates exercises")
```

### Student (user)

Students use tool (run queries and check their answers).

### Lecturer (admin)

The Lecturer can add exercises to SQL-Train and get an overview of the students
usage of the tool.

### LMS (Moodle)

The LMS has to transmit the pg-stud username of the student.

### PG-Stud

SQL-Train enables the student to directly execute statements on the training
server pg-stud, made specifically for the students.

## Technical Context

```mermaid
C4Context
    title SQL-Train Business Context
    Person(student, "Student")
    System_Ext(lms, "LMS of University", "Moodle")
    System(sql-train-server, "SQL-Train-Server")
    SystemDb_Ext(pg-stud, "PG-Stud of University", "Database for all students")
    System(sql-train-client, "SQL-Train-Client")
    Person(lecturer, "Lecturer")

    Rel(sql-train-server, pg-stud, "Uses", "host trust")
    Rel(student, lms, "Login")
    Rel(lms, sql-train-server, "login data", "HTTPS/LTI")
    Rel(student, sql-train-client, "HTTPS")
    BiRel(sql-train-client, sql-train-server, "HTTPS/REST")
    Rel(lecturer, sql-train-client, "Analytics of course", "HTTPS")
    Rel(lecturer, sql-train-server, "Creates exercises", "HTTPS")
```

**\<optionally: Explanation of technical interfaces>**

LTI, psycopg2, rest?

**\<Mapping Input/Output to Channels>**



## Scope

### Evaluation

As one of our principle is to keep our project as simple as possible. We did not
implement any measures to hinder the student at cheating we just make it not
that straightforward.

### Grading

Since the tool is designed with the specific goal of helping students to learn
we did not implement a grading system. As mentioned above, we did not make it
hard for students to cheat on the exercises in any way, so any and all grading
would be irrelevant without a dedicated exam-mode that prohibits this. This
however was never an intended part of the project.
