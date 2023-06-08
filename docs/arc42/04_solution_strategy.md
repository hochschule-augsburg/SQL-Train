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
