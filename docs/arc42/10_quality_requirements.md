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


	Perfomance --> Responsiveness(Responsiveness)
	Responsiveness --- 2((2))
	Perfomance --> Scalability(Scalability)

	Reliability --> Availability(Availability)
	Reliability --> Fault-Tolerance(Fault-Tolerance)

	Usability --> Compliance(Compliance)
	Usability --> Operability(Operability)
	Usability --> Ease-of-Use(Ease-of-Use)
	Ease-of-Use --- 3((3))
	Usability --> Aesthetics(Aesthetics)
	Aesthetics --- 4((4))

	Security --> Integrity(Integrity)
	Security --> Confidentiality(Confidentiality)
	Security --> Authentication&Authorization(Authentication & Authorization)

	Maintainability -->Modularity(Modularity)
	Modularity --- 5((5))
	Maintainability -->Extensibility(Extensibility)
	Extensibility --- 6((6))

```

## Quality Scenarios

| ID  |  Description |
| --- | ------------ |
| 1   | SQL-Train offers a wide variety of SQL-Statements <br />- select with join, subselect, ...<br />- alter table<br />- delete table<br />- update table|
| 2   | SQL-Train checks the exercise and shows the result in <1 second|
| 3   | - The badge on the topic-buttons gives a first impression of the difficulty of the topic<br /> - The color of the exercise-buttons provide a good overview of exercises states (untouched/wrong/correct)<br /> - Users can easily find the right exercises with the help of the search- / filter-options<br /> - Users have the option to mark exercises and directly jump to marked exercises<br /> - Users have the option to resize the panes according to their needs<br /> - The horizontal-menu makes it possible to jump between exercises without changing the page |
| 4   | - straighforward navigation<br /> - minimalist and sleek design, no unnecessary elements<br /> - many features without making it confusing|
| 5   | - small, self-contained components that encapsulate their own logic and UI|
| 6   | - new features / elements can be added easily without only few changes in the rest of the code|

- new Student DB
- switching away from postgres
- clearing the data from previous semesters
- introducing new production Version of SQL-Train