<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

## Get Started
## Version Compatibility
| Python | Node | Libpq |
|--------|------|-------|
| >=3.9  | >=16 | >=15  |


### Setup

```bash
npm install --prefix frontend/
npm run build --prefix frontend/
python -m venv venv
python -m pip install -r requirements.txt
```

### Create Database Schema

```bash
python manage.py makemigrations
python manage.py migrate
```

### Load Example Data

In order to populate the website with exercises, some example data has been provided that can be loaded into the database.

_Unfortunately we cannot release the exercises because we don't have the right. You have to provide your own._
```bash
python manage.py loaddata common pc ddb studdb
```

### Create Admin Account

To use the website locally, you need to create a superuser (admin) account that will allow you to manage the database. 
```bash
python manage.py createsuperuser
```

### Start Application

To start the backend and frontend you have to use the following two commands.
After launching the frontend for the first time, you need to log in to [localhost:8000/admin](localhost:8000/admin) using the superuser account you just created in order to establish a connection to the website.

```bash
python manage.py runserver
npm run watch --prefix frontend/
```

## Daily Workflow

For daily workflow, fewer steps are required than in the setup mentioned. If there are changes to the data model, 
a database migration needs to be created first and then applied. If there are changes to the API, the frontend needs 
to know how the controller endpoints and transport objects have changed, as our frontend relies on these to make calls. 
The first three commands should have been executed before pushing, for safety to ensure functionality and synchronization between frontend and backend.

```bash
python manage.py makemigrations
python manage.py migrate
npm run apiGenerate --prefix frontend/
```

```bash
python manage.py runserver
npm run dev --prefix frontend
```

## Troubleshooting

If errors occur, these could be potential solutions.

#### A)

```bash
rm db.sqllite3
python manage.py migrate
python manage.py loaddata exercises_data/common.yaml
```

#### B)

Sometimes `ltiapi/migrations/0001_initial.py` has to be deleted than you have to `makemigrations` and `migrate`.
