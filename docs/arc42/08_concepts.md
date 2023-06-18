<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0.
-->

# Cross-cutting Concepts

## Internationalization (i18n)

### Reason

Since this project is open source, it is essential to ensure its usability for a
global audience. To achieve this, we aim to make the project easily adaptable
for localization. Additionally, the TH-A also has courses lectured in English,
which further emphasizing the need for internationalization.

### Implementation

All strings that are exclusively displayed to the user must be appropriately
marked for i18n. This requirement also extends to the data stored in the Django
DB, ensuring that it can be easily translated for different languages.

## Configurability

### Reason

Given that this project is open source, it should be flexible enough to be used
by other universities. To facilitate its adoption, the project aims to provide
necessary configuration options.

### Implementation

First and foremost, our application should be capable of running on any platform
(refer to the Deployment View). Additionally, we strive to make the styling and
general configuration of the project easily customizable through the use of the
`config.json` file in the root of the project.

## KISS - Keep It Simple and Stupid

### Feature Elimination

Adhering to KISS, we carefully evaluated and omitted unnecessary features. This
ensured a focused and efficient user interface aligned with the project's
objectives. Prioritizing essential features and eliminating complexity resulted
in a streamlined user experience and faster development.

## DRY - Don’t Repeat Yourself

### Code Reusability and Modularity

Promoting code reusability and modularity, we created reusable code components across the project. By encapsulating common functionalities into modules or functions, we avoided duplicating code, reducing inconsistencies and errors. This modular approach simplified maintenance and future enhancements.

### Data and Logic Abstraction

To adhere to the DRY principle, we emphasized data and logic abstraction
throughout the development process. By abstracting common data structures,
algorithms, and business logic into separate modules or classes, we achieved a
more efficient and maintainable codebase. This abstraction reduced the need to
repeat similar code blocks, as the reusable modules encapsulated the necessary
functionality. It also promoted code readability and facilitated easier
debugging and troubleshooting.
