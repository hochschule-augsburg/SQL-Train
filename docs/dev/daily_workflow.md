<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Daily Workflow

## Start Server and build

```bash
python manage.py runserver
npm run watch --prefix frontend
```

## Update api

```bash
python manage.py runserver&
npm run apiGenerate --prefix frontend/
```
