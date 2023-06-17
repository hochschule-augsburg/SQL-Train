<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0

This file is based on arc42 template, originally created by Gernot Starke and Peter Hruschka, which can be found [here](https://arc42.org/download) and has been altered to fit our needs. arc42 is licensed under CC-BY-SA-4.0. 
-->

# Risks

## LTI-library

Using LTI within our project work is only possible by using a library for this
API otherwise the time we have would not suffice. As there are people who had
issues with all LTI-libraries we found, we could not rule out severe bugs in
these libraries.

### Contingency Planning

Either we have to use a different library or we have to switch to developing a
plugin for Moodle instead of using LTI

### Risk Mitigation

Through an early proof of concept, certainty is achieved as soon as possible.

# Technical Debts

## LTI-library

### No `Names and Roles Providing Service` and `Assessment and Grading System`

Unfortunately we could not establish functional OpenID Connect integration
between our tool and the Learning Management System (LMS). The issue appears to
stem from difficulties with the PyLTI1p3 library, which is responsible for
handling OpenID Connect functionality.

With our test server running Moodle 4.2, we encountered an error that hindered
the successful execution of OpenID Connect. The error message states:
`Exception - Argument 1 passed to mod_lti\local\ltiopenid\jwks_helper::fix_jwks_alg() must be of the type array, null given, called in [dirroot]/mod/lti/locallib.php on line 1335.`
This error points to an underlying problem in the code of PyLTI1p3.

### JWKS stored as clear text in DB

The current implementation of PyLTI1p3s Django API stores JWKS (JSON Web Key
Set) in clear text within the database. PyLTI1p3 does not offer encryption
capabilities or support the use of hardware-based security measures, making it
challenging to address this issue effectively.

However, it's important to evaluate the potential risks associated with this
situation. The JWKS primarily serves the purpose of authentication within the
learning management system (LMS), but it is worth noting that the LMS
functionality is not operational, and manual approval from the LMS administrator
is required to enable it. Consequently, the immediate risks stemming from the
exposed JWKS are relatively limited.

### Summary

To effectively address this technical debt, it is necessary to conduct a
comprehensive investigation into the underlying cause of the issue, which lies
within the PyLTI1p3 library.

However, considering the scope of this project work and the relatively low level
of risk involved, it is neither feasible nor essential or wanted by the
stakeholder.

## Accessability

The font on the navbar has too low contrast to be considered good. To make our
site more unique we intentionally opted out of the recommended colorscheme of
black on orange and instead chose the less contrast color white for text.
