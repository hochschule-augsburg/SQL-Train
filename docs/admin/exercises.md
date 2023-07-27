<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Exercises

## Add

Go the the admin page and add objects of the model Topic, Exercise and Solution.
The create dialog contains help texts for each field.

## CRUD

Simple CRUD operations can be done via the intuitive admin page.

## Loading data form storage

You can load data form dump django databases and also edit them if you like.

### Dump

```bash
python manage.py dumpdata --format yaml --natural-primary --natural-foreign -e exercises.UserExercise -o OUTPUT.yaml exercises
```

### Load

```bash
python manage.py loaddata OUTPUT.yaml
```
