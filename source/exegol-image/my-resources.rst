============
My resources
============

"My-resources" brings great features allowing users to make Exegol their own and customize it even further. This feature relies on a simple volume shared between the host and all exegol containers, and an advanced integration in the Exegol images directly.

.. warning::
    The "my-resources" feature will do what it's told to do. If users choose to use that feature to replace files or configuration, those replacements should take place. So if there are some additions to Exegol you're not getting, it could be because you have a "my-resources" setup that replaces it.

To learn more about the volume options, details are available :ref:`here <My-resources-wrapper>`.

Below are the features offered by "My-resources", allowing users to extend Exegol beyond what is initially included (`tools <todo>`_, `resources </exegol-resources/resources>`_).

..
    _TODO: add ref to images tools list

* :ref:`Custom tools <Custom-tools>`: users can place their own custom standalone tools, binaries and scripts in the "my-resources" volume. This volume is accessible from all containers at ``/opt/my-resources``.
* :ref:`Supported setups <Supported-setups>`: users can customize their exegol environments automatically and transparently without having to manually setting things up for each and every new Exegol container they create. In this functionality, a pre-set list of supported custom configuration is set, and will improve with time. It's the easier and most user-friendly approach to customizing a few configurations.
* :ref:`User setup <User-setup>`: In this functionality, a shell script can be populated with every command a user wishes its containers to run at their creation.

.. contents::
    :local:

.. _Custom-tools:

Custom tools
------------
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

In the container, the ``/opt/my-resources/bin/`` folder (``~/.exegol/my-resources/bin/`` on the host) is automatically added to the ``PATH`` of the zsh shell. The user can then add tools in that folder in order to use them from the container.

.. hint::

   The most simple approach would be to add standalone binaries, but users could also add symbolic links that would point to somewhere else in ``/opt/my-resources/``.

   .. code-block:: bash

      # Example for a standalone binary on your host
      cp /path/to/tool ~/.exegol/my-resources/bin/
      # or for a standalone binary on your exegol container
      cp /path/to/tool /opt/my-resources/bin/

      # Example for a symbolic link from your host
      git -C ~/.exegol/my-resources/ clone "https://github.com/someauthor/sometool"
      ln -s ../sometool/script.py ~/.exegol/my-resources/bin/script.py
      # or from your exegol container
      git -C /opt/my-resources/ clone "https://github.com/someauthor/sometool"
      ln -s /opt/my-resources/sometool/script.py /opt/my-resources/bin/script.py


.. _Supported-setups:

Supported setups
----------------

Configuration files stored in the ``/opt/my-resources/setup/`` directory will be deployed on the containers and allow users to customize Exegol even further.
By default, the number of officially supported configuration files is limited, and it depends on the version of the image itself, not the wrapper.

.. hint::
    In order to see what configuration files are supported in your version, the ``/opt/supported_setups.md`` documentation file can be read from any container.

This documentation will reference in detail all the supported customizations available over time, and the corresponding minimum image version required for each one.

If a user wants to deploy tools and configurations that are not supported, or more advanced, they can opt for the :ref:`User setup solution <User-setup>`.

.. _custom_apt:

:code:`apt` (packages, sources, keys)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

A system exists to easily install arbitrary APT packages in any new exegol container.

* Custom APT **repositories** can be added in exegol by filling in the ``/opt/my-resources/setup/apt/sources.list`` file
* Importing custom repositories usually requires importing **GPG keys** as well, which can be done by entering trusted GPG keys download URLs in the ``/opt/my-resources/setup/apt/keys.list`` file
* To install **APT packages** automatically (after updating the repository including the custom ones), just enter a list of package names in the ``/opt/my-resources/setup/apt/packages.list`` file

:code:`bloodhound` (customqueries, config)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.1.0`` of the ``ad`` and ``full`` images.

A system exists to easily add one or **several** bloodhound customqueries files, or change its configuration file in any new exegol container.

To automatically:

* overwrite the ``~/.config/bloodhound/config.json`` configuration file, simply create the file ``/opt/my-resources/setup/bloodhound/config.json``
* replace the default exegol customqueries, place one or several valid customqueries files into the folder ``/opt/my-resources/setup/bloodhound/customqueries_replacement/``.
* merge with the default exegol customqueries by placing one or several valid customqueries files into the folder ``/opt/my-resources/setup/bloodhound/customqueries_merge/``

.. tip::
    To be considered for replacing or merging, the customqueries files must be **valid** and bear the ``.json`` extension. The file names do not matter.
    The output will be saved into the single file ``~/.config/bloodhound/customqueries.json``.

:code:`firefox` (policy)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.1.6`` of any exegol image.

A system exists to easily personalise firefox in any new exegol container.

The file ``/usr/lib/firefox-esr/distribution/policies.json`` can be used as a template in order to create your own Firefox policy. Your policy can then be copied to the location ``/opt/my-resources/setup/firefox/policies.json`` to apply it in the next container deployment (https://support.mozilla.org/en-US/kb/customizing-firefox-using-policiesjson), all available directives can be found here: https://mozilla.github.io/policy-templates/.

.. hint::
    Your custom policy will overwrite the default policy created by Exegol.

The default policy applied by Exegol will do the following actions:

`Add a few bookmarks`

.. code-block:: json

    {
      "policies": {
        "ManagedBookmarks": [
          {
            "toplevel_name": "Exegol Bookmarks"
          },
          {
            "url": "https://exegol.readthedocs.io/en/latest/",
            "name": "Exegol Doc"
          },
          {
            "name": "References / Guides",
            "children": [
              {
                "url": "https://www.thehacker.recipes/",
                "name": "THR"
              },
              [...]
              {
                "url": "https://lolol.farm/",
                "name": "LOLOL Farm"
              }
            ]
          }
        ]
    }

`Install a few extensions`

.. code-block:: json

    {
      "policies": {
        "ExtensionSettings": {
          "foxyproxy@eric.h.jung": {
            "installation_mode": "force_installed",
            "install_url": "https://addons.mozilla.org/firefox/downloads/latest/foxyproxy-standard/latest.xpi"
          },
          [...]
        }
    }

`Disable a few Firefox features such as the telemetry`

.. code-block:: json

    {
      "policies": {
        "DisableTelemetry": true,
        "DisplayBookmarksToolbar": "always",
        "UserMessaging": {
          "WhatsNew": false,
          "ExtensionRecommendations": false,
          "FeatureRecommendations": false,
          "UrlbarInterventions": false,
          "SkipOnboarding": true,
          "MoreFromMozilla": false
        }
    }

`Apply the CA of Burpsuite`

.. code-block:: json

    {
      "policies": {
        "Certificates": {
            "Install": ["/opt/tools/firefox/cacert.der"]
        }
    }

In order to install a specific addon in your own policy, you can go to the Firefox addon webpage, and search for the addon GUID in the page HTML source code by searching for the JSON field ``"guid":``, for example for the Dark Reader addon, the GUID is ``addon@darkreader.org``, you can then add the extension in your policy file:

.. code-block:: json

    "ExtensionSettings": {
        "addon@darkreader.org": {
            "installation_mode": "force_installed",
            "install_url": "https://addons.mozilla.org/firefox/downloads/latest/addon@darkreader.org/latest.xpi"
        },
    }

To add a bookmark you can add a children to an existing folder in the ``ManagedBookmarks`` directive:

.. code-block:: json

    {
        "url": "https://www.thehacker.recipes/",
        "name": "THR"
    }

or you can add a new folder:

.. code-block:: json

    {
        "name": "New folder",
        "children": [
            {
            "url": "https://regex101.com/",
            "name": "Regex101"
            }
        ]
    }

:code:`firefox` (addons, CA) (deprecated)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. warning::
    This covers the previous method for personalizing Firefox; the current approach utilizes :ref:`policy <\`firefox\` (policy)>`.

.. seealso::
    Available from version ``3.0.2`` to ``3.1.5`` of any exegol image.

A system exists to easily install arbitrary firefox addons in any new exegol container.

The ``/opt/my-resources/setup/firefox/addons.txt`` file allows the user to list addons to install from online sources. It must be filled with their links in Mozilla's shop (for example https://addons.mozilla.org/fr/firefox/addon/foxyproxy-standard/ ).

The ``.xpi`` files in ``/opt/my-resources/setup/firefox/addons/`` folder will be installed as well.

.. seealso::
    Below, available from version ``3.2.0`` of any exegol image.

The ``.der`` files in ``/opt/my-resources/setup/firefox/CA/`` folder will be trusted .


:code:`python3` (pip3)
~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

A system exists to easily install arbitrary PIP3 packages in any new exegol container.

The ``/opt/my-resources/setup/python3/requirements.txt`` file allows the user to list a set of packages to install with constraints just like a classic **requirements.txt** file.


:code:`tmux` (conf)
~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

Exegol supports overloading its **tmux** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.tmux.conf`` configuration file, simply create the file ``/opt/my-resources/setup/tmux/tmux.conf``

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.

:code:`zellij` (conf)
~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``X.X.X`` of any exegol image.

Exegol supports overloading its **zellij** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.config/zellij/config.kdl`` configuration file, simply create the file ``/opt/my-resources/setup/zellij/config.kdl``

:code:`vim` (vimrc, configs)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

Exegol supports overwriting its **vim** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.vimrc`` configuration file, simply create the file ``/opt/my-resources/setup/vim/vimrc``
* vim configuration folders are also automatically synchronized:
    * ``/opt/my-resources/setup/vim/autoload/*`` --> ``~/.vim/autoload/``
    * ``/opt/my-resources/setup/vim/backup/*`` --> ``~/.vim/backup/``
    * ``/opt/my-resources/setup/vim/colors/*`` --> ``~/.vim/colors/``
    * ``/opt/my-resources/setup/vim/plugged/*`` --> ``~/.vim/plugged/``
    * ``/opt/my-resources/setup/vim/bundle/*`` --> ``~/.vim/bundle/``

.. tip::
    It is possible to install **plugins** with :ref:`the APT customization system <custom_apt>`.

:code:`neovim` (.config/nvim)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Will be available from version ``3.1.2`` of any exegol image.

Exegol supports overwriting its **neovim** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.config/nvim/`` configuration, copy your config in  ``/opt/my-resources/setup/nvim/``

.. tip::
    It is possible to install **plugins dependencies** with :ref:`the APT customization system <custom_apt>`.

:code:`zsh` (aliases, zshrc, history)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

To not change the configuration for the proper functioning of exegol but allow the user to add aliases and custom commands to zshrc,
additional configuration files will be automatically loaded by zsh to take into account the customization of the user .

* **aliases**: any custom alias can be defined in the ``/opt/my-resources/setup/zsh/aliases`` file. This file is automatically loaded by zsh.
* **zshrc**: it is possible to add commands at the end of the zshrc routine in ``/opt/my-resources/setup/zsh/zshrc`` file.
* **history**: it is possible to automatically add history commands at the end of ``~/.zsh_history`` from the file ``/opt/my-resources/setup/zsh/history``.

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.

:code:`arsenal` (cheats)
~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.1.5`` of any exegol image.

Exegol supports adding a custom cheatsheets file (rst or md file) for Arsenal (https://github.com/Orange-Cyberdefense/arsenal) by moving them in the folder ``/opt/my-resources/setup/arsenal-cheats/``.

.. tip::
    You can create a structure with folders if you want some organization

.. _User-setup:

User setup
----------
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

The ``/opt/my-resources/setup/load_user_setup.sh`` script is executed on the first startup of each new container that has the "my-resources" feature enabled. Arbitrary code can be added in this file, in order to customize Exegol (dependency installation, configuration file copy, etc).

.. warning::
    It is strongly advised **not** to overwrite the configuration files provided by exegol (e.g. ``/root/.zshrc``, ``/opt/.exegol_aliases``, ...), official updates will not be applied otherwise.

Troubleshooting
---------------

In case of problem, the customization system logs all actions in the ``/var/log/exegol/load_setups.log`` file.

If the whole installation went smoothly the log file will be compressed by gunzip and will have the name ``/var/log/exegol/load_setups.log.gz``

.. tip::
    Logs in ``.gz`` format can be viewed directly **without unpacking** them with the ``zcat``, ``zgrep``, ``zdiff`` or ``zmore`` command!
