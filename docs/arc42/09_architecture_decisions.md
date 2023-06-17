<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Architecture Decisions

## Backend

### Language

When we began our project, one of our first decisions was to choose the backend
language. We had several options that supported LTI: Python, Java, node.js, C#,
and PHP. Since our developers had previous experience with the Python and Java,
we preferred these languages.

We ultimately went with Python because it offered more freedom and faster
development. Python also has a wide range of libraries, an active community and
is well-suited for prototyping.

We disregarded Java due to its verbosity and the associated development overhead
it entailed.

### Framework

We evaluated several Python web frameworks, including Django, Flask and FastAPI.
Among these options, both Django and Flask offered official LTI support.
However, considering the strength of Django's community and its reputation as a
well-established framework, we ultimately chose Django for our project.

### Frontend

**React** <br>

We chose React as our frontend framework on top of TypeScript due to the reusable components, and its community support. Additionally, TypeScript enhances development productivity by providing static typing and better code maintainability. To communicate with the backend we used OpenAPI, which is a specification language for HTTP APIs. OpenAPI integration allows for communication between the frontend and backend, ensuring consistent and documented API interactions.

**1. Redux** <br>

Redux is a predictable state management library that complements React well. By centralizing the application's state in a single store, Redux simplifies data flow and enables predictable updates to the UI. With Redux, we were able to manage complex application states, handle asynchronous actions, and ensure data consistency throughout our application.

**2. Components** <br>

As for the component architecture, we embraced the principles of reusability and modularity. We structured our application into small, self-contained components that encapsulate their own logic and UI. This approach allowed us to break down our application into manageable pieces, promoting code reusability and maintainability. With component-based architecture, we could easily scale and maintain our application by composing and reusing components across different parts of the system.
