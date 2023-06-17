<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Configuration

To make SQL-Train more versatile and compatible with various server
configurations and school structures, we paid attention to provide customization
options through configuration files. There are two parts to the configuration:

- `config.json`: This file is used during the build process for styling and data
  customization.
- `.env`: This file is used at runtime for Docker and Django configuration.

Configuration is split into two parts:

1. `config.json` Used a buildtime for styling and data
2. `.env` Used at runtime for docker and Django configuration

## config.json

- `THEME_COLORS`: This section enables you to style SQL-Train according to your
  preferences by specifying custom theme colors.
- `FEEDBACK.SHOW`: By modifying this setting, you can control whether the
  feedback drawer is displayed or not.
- `LMS_URL`: Students will be prompted to log in to the Learning Management
  System (LMS) located at the URL.
- `LTI`: This section defines the properties displayed during LTI registration.

## .env

Please refer to the provided `.env-example` file for an example configuration
and documentation. The .env file primarily contains Django configuration options
for SQL-Train. For detailed information about the available Django settings, it
is recommended to consult the Django documentation before making any
modifications.

```{literalinclude} ../../.env-example

```
