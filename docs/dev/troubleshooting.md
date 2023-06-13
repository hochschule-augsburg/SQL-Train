<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Troubleshooting

If errors occur, these could be potential solutions.

## A)

```bash
rm db.sqllite3
python manage.py migrate
python manage.py loaddata exercises_data/common.yaml
```

## B)

Sometimes `ltiapi/migrations/0001_initial.py` has to be deleted than you have to `makemigrations` and `migrate`.
