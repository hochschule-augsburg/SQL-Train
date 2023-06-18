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

### Component Architecture
One of the key aspects of adhering to the KISS concept was the implementation of small, self-contained components in the frontend. Each component was designed to encapsulate its own logic and user interface, promoting reusability and maintainability. By breaking down the frontend into modular components, we achieved a more organized and flexible codebase. This modular approach also facilitated easier testing, debugging, and future enhancements, as each component could be worked on independently.

### Sleek and Minimalistic Design
The design of the website was guided by the principles of sleekness and minimalism. We aimed for a clean and uncluttered interface that focused on delivering content in an elegant manner. By eliminating unnecessary visual elements and reducing complexity in the design, we achieved a visually appealing and user-friendly experience. The minimalist design approach helped to create a streamlined and intuitive user interface, enhancing the overall user experience.

### Feature Elimination
One of the core tenets of the KISS concept is the removal of unnecessary features. Throughout the development process, we carefully evaluated each proposed feature, considering its relevance and impact on the user experience. Features that didn't align with the project's core objectives or introduced unnecessary complexity were omitted. By prioritizing essential features and eliminating unnecessary ones, we ensured a more focused and efficient user interface.

## DRY - Don’t Repeat Yourself

### Code Reusability and Modularity
One of the fundamental aspects of the DRY concept is promoting code reusability and modularity. In our software development, we strived to create reusable code components that could be utilized across different parts of the project. By encapsulating common functionalities and logic into reusable modules or functions, we avoided duplicating code and reduced the chances of introducing inconsistencies or errors. This modular approach allowed for easier code maintenance and facilitated future enhancements.

### Data and Logic Abstraction
To adhere to the DRY principle, we emphasized data and logic abstraction throughout the development process. By abstracting common data structures, algorithms, and business logic into separate modules or classes, we achieved a more efficient and maintainable codebase. This abstraction reduced the need to repeat similar code blocks, as the reusable modules encapsulated the necessary functionality. It also promoted code readability and facilitated easier debugging and troubleshooting.

### Centralized State Management with Redux
To ensure a structured and organized approach to state management, we adopted Redux as our centralized state management solution. Redux provided a predictable state container that facilitated efficient data flow across components. By maintaining a single source of truth, we avoided scattering state management logic throughout the application, enhancing maintainability and reducing complexity.
