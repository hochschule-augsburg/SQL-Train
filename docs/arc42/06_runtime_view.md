<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Runtime View

## LTI Login+Launch

As one of our most important Feature is the login via LMS this sequence diagram
illustrates the process.

```mermaid
sequenceDiagram
    participant B as Browser
    participant M as Moodle
		participant T as Tool
		M->>M: Provide OICD third party login
		B-)T: Open link
		T->>T: is platform issuer valid?
		T-)M: access token request
		M--)T: resource launch token
		T-)M: GET JWT
		M--)T: JWT
		T->>T: verify LMS
		T--)B: render
```

Sources:

- https://andyfmiller.com/2018/12/28/launching-an-lti-1-3-resource-link-using-openid-connect-third-party-login/
- https://documentation.brightspace.com/EN/integrations/ipsis/LTI%20Advantage/LTI_launch_auth.htm

## pg_stud API

This section describes the usage of the REST API with perspective of the
frontend and backend.

### Execute Query

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant D as Database
		F->>B: Execute Query
		B->>B: Retrieve Topic
    B->>B: Retrieve Exercise
    B->>D: Execute Query
    D-->>B: Query Result
    B-)D: Update User Exercise
    B-->>F: Return QueryOut object
```

### Check Answer

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend with Logic
    participant D as Database

    F->>B: Check Answer Correct
    B->>B: Retrieve Topic
    B->>B: Retrieve Exercise
    B-)D: Reset DB
    B->>D: Execute User Query
    D-->>B: User Result
    alt exercise.is_select
        B->>D: Evaluate Solution Query
        D-->>B: Solution Result
        B->>B: Check Results
    else
        B->>D: Execute Check
        D-->>B: Correct
    end
    B-)D: Update User Exercise
    B-->>F: Check Answer Out
```

### Show Solution

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant D as Database
		F->>B: Execute Query
		B->>B: Retrieve Topic
    B->>B: Retrieve Exercise
    B->>D: Execute Query
    D-->>B: Query Result
    B-)D: Update User Exercise
    B-->>F: Return QueryOut object
    F->>B: Handle List Solution
    alt topic_short
    alt enumber
    B-->>F: Solution List from Exercise
    end
    B-->>F: Solution List from Topic
    else
    B-->>F: All Solutions
    end
    F->>B: Handle Solution Result
    B->>B: Get Topic
    B->>B: Get Exercise
    B->>B: Get Solution
    B-)D: Reset Database
    B->>D: Execute Solution
    D-->>B: Solution Result
    B-->>F: Query Output
```

### Reset Database

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend with Logic
    participant D as Database
    F->>B: Handle Reset Database
    B->>B: Retrieve Topic
    B->>B: Retrieve Exercise
    B-)D: Reset DB
    B-->>F: Message
```
