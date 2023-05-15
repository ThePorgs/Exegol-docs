import datetime
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Exegol'
copyright = f'{datetime.datetime.now().year}, Shutdown & Dramelac'
author = 'Shutdown & Dramelac'
release = '4.1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ['myst_parser',
              'sphinx_tabs.tabs',
              'sphinx_copybutton',
              "sphinxcontrib.jquery"]

templates_path = ['_templates']
exclude_patterns = []



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

html_favicon = '_static/logo_round.ico'

# Tabs options
sphinx_tabs_disable_tab_closing = True
