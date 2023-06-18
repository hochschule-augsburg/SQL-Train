<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Solution Strategy

The following table contrasts the quality goals of SQL-Train (Section 1.2) with
matching architecture approaches and thus provides easy access to the solution.

```{list-table}
:header-rows: 1

- * Quality Goal
  * Matching approaches in the solution

- * Didactic Value
  * Beta version to receive feedback
- * User-friendly UI
  * - Figma wireframes & prototypes<br/>
    - Beta version to receive feedback from students
- * Quick Responses
  * - PostgreSQL Connection Pool<br/>
    - nginx to serve static files
    - Lighthouse report
- * Easy Login
  * Use of LTI with LMS and host trust with pg-stud
- * Internationalization
  * `i18next`, Django i18n and `modeltranslations`
- * Straightforward Deployment
  * Docker configured through environment variables
- * Security
  * Assessment via a separate report
- * Maintainability
  * - Code review
    - Linters
    - Documentation
- * Accessibility
  * Lighthouse report
```

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
