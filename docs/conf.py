# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: CC0-1.0

# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os
import sys

sys.path.insert(0, os.path.abspath("../"))

project = "SQL-Train"
copyright = "2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele"
author = "Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "myst_parser",
    "sphinxcontrib.mermaid",
    "autodoc2",
    "sphinx_favicon",
    "sphinx_tippy",
]


templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_book_theme"
html_static_path = ["_static"]
html_theme_options = {"show_nav_level": 2}

favicons = [
    {
        "sizes": "32x32",
        "href": "favicon-32.png",
    },
]

# MySt

myst_fence_as_directive = ["mermaid"]
# optional to use https://sphinxcontrib-mermaid-demo.readthedocs.io/en/latest/#directive-options
myst_enable_extensions = ["attrs_block"]

# Autodoc

autodoc2_packages = [
    "../exercises",
    "../feedback",
    "../ltiapi",
    "../pg_stud",
    "../sql_training",
]

autodoc2_render_plugin = "myst"

autodoc2_output_dir = "apidocs-backend"
