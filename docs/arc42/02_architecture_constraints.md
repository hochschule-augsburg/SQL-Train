<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Architecture Constraints
## Technical constraints
| Constraint | Explanation, background |
| ----------- | ----------- |
| Modern Technology | For the SPA SQL-Train requires modern hardware using up-to-date Browsers. |
| LTI Tool    | The Website is only usable via an LMS that supports LTI |
| pg-stud     | A university using deploying our tool has to provide per student a PostgreSQL database with trust for the host of the Server running the tool |
| Internationalization | Database content and structure is not being localized instead english is the default as localized database would cause problems. |


## Organizational constraints
| Constraint | Explanation, background |
| ----------- | ----------- |
| Team | 8 Students with varying experience and knowledge: 5x IN4, 1x WI4, 2x IN6 |
| Schedule | Start of development March 2023, first executable beta May 2023, project presentation 21.06.2023 |
| Small budget | Used software and tools need to be free of charge. |
| Development Tools | Wireframes are done with Figma. For conceptional database modeling Agila Mod is used |
| Open Source Release | We want the project to be beneficial for other institutions using an LMS. This creates the need to keep private configuration details in strongly separated files. |
| Development Method | A mix of Agile and Kanban is used, with 2 week sprints and two meetings a week. |

## Conventions
| Convention | Explanation, background |
| ----------- | ----------- |
| Architecture documentation | Terminology and structure according to the english arc42 template |
| Source Code | Python: black formatter with default template<br />React: prettier.io as configured |
| Bug Tracking | Notion Bug Story and Discord Message |
| Version Control | New Features will be developed in a separate git branch. On completion the feature-branch will be merged into "dev". Stable Versions of "dev" can be merged into the "main" branch, which is used in the production instance. |