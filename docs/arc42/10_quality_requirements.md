<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Quality Requirements

## Quality Tree

```mermaid
flowchart LR
	QualityGoals(Quality Goals)
	QualityGoals --> Functionality(Functionality)
	QualityGoals --> Perfomance(Perfomance)
	QualityGoals --> Reliability(Reliability)
	QualityGoals --> Usability(Usability)
	QualityGoals --> Security(Security)
	QualityGoals --> Maintainability(Maintainability)

	Functionality --> Completeness(Completeness)
	Completeness --- 1((1))
	Functionality --> Correctness(Correctness)
	Correctness --- 2((2))


	Perfomance --> Responsiveness(Responsiveness)
	Responsiveness --- 3((3))
	Perfomance --> Scalability(Scalability)
	Scalability --- 4((4))

	Reliability --> Availability(Availability)
	Reliability --> Fault-Tolerance(Fault-Tolerance)

	Usability --> Compliance(Compliance)
	Usability --> Operability(Operability)
	Usability --> Ease-of-Use(Ease-of-Use)
	Ease-of-Use --- 5((5))
	Usability --> Aesthetics(Aesthetics)
	Aesthetics --- 6((6))

	Security --> Integrity(Integrity)
	Security --> Confidentiality(Confidentiality)
	Security --> Authentication&Authorization(Authentication & Authorization)
	Authentication&Authorization(Authentication & Authorization) --- 7((7))

	Maintainability -->Modularity(Modularity)
	Modularity --- 8((8))
	Maintainability -->Extensibility(Extensibility)
	Extensibility --- 9((9))

```

## Quality Scenarios

| ID   | Description                                                  |
| ---- | ------------------------------------------------------------ |
| 1    | SQL-Train offers a wide variety of SQL-Statements <br />- select with join, subselect, ...<br />- alter table<br />- delete table<br />- update table |
| 2    | Exercises and their solutions have been checked for correctness by the developers and by Users. |
| 3    | SQL-Train checks the exercise and shows the result in <1 second |
| 4    | SQL-Train can be scaled by using multiple docker containers and a load balancers. |
| 5    | - The badge on the topic-buttons gives a first impression of the difficulty of the topic<br /> - The color of the exercise-buttons provide a good overview of exercises states (untouched/wrong/correct)<br /> - Users can easily find the right exercises with the help of the search- / filter-options<br /> - Users have the option to mark exercises and directly jump to marked exercises<br /> - Users have the option to resize the panes according to their needs<br /> - The horizontal-menu makes it possible to jump between exercises without changing the page |
| 6    | - straighforward navigation<br /> - minimalist and sleek design, no unnecessary elements<br /> - many features without making it confusing |
| 7    | The page is only accessible via the LMS or by a django administration user. |
| 8    | - small, self-contained components that encapsulate their own logic and UI |
| 9    | - new features / elements can be added easily without only few changes in the rest of the code |

- new Student DB
- switching away from postgres
- clearing the data from previous semesters
- introducing new production Version of SQL-Train