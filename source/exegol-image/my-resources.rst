============
My resources
============

"My-resources" brings great features allowing users to make Exegol their own and customize it even further. This feature relies on a simple volume shared between the host and all exegol containers, and an advanced integration in the Exegol images directly.
To learn more about the volume options, details are available :ref:`here <My-resources-wrapper>`.

Below are the features offered by "My-resources", allowing users to extend Exegol beyond what is initially included (`tools <todo>`_, `resources </exegol-resources/intro>`_).

..
    _TODO: add ref to images tools list

* :ref:`Custom tools <Custom-tools>`: users can store add their own custom standalone tools, binaries and scripts in the "my-resources" volume. This volume is accessible from all containers at ``/opt/my-resources``.
* :ref:`Supported setups <Supported-setups>`: users can customize their exegol environments automatically and transparently without having to manually setting things up for each and every new Exegol container they create. In this functionality, a pre-set list of supported custom configuration is set, and will improve with time. It's the easier and most user-friendly approach to customizing a few configurations.
* :ref:`User setup <User-setup>`: In this functionality, a shell script can be populated with every command a user wishes its containers to run at their creation.

.. contents::

.. _Custom-tools:

Custom tools
------------
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

In the container, the ``/opt/my-resources/bin/`` folder (``~/.exegol/my-resources/bin/`` on the host) is automatically added to the ``PATH`` of the zsh shell. The user can then add tools in that folder in order to use them from the container.

.. hint::

   The most simple approach would be to add standalone binaries, but users could also add symbolic links that would point to somewhere else in ``/opt/my-resources/``.

   .. code-block:: bash

      # Example for a standalone binary
      cp /path/to/tool ~/.exegol/my-resources/bin/

      # Example for a symbolic link
      git -C ~/.exegol/my-resources/ clone "https://github.com/someauthor/sometool"
      ln -s ~/.exegol/my-resources/sometool/script.py ~/.exegol/my-resources/bin/script.py


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

:code:`zsh` (aliases, zshrc)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

To not change the configuration for the proper functioning of exegol but allow the user to add aliases and custom commands to zshrc,
additional configuration files will be automatically loaded by zsh to take into account the customization of the user .

* **aliases**: any custom alias can be defined in the ``/opt/my-resources/setup/zsh/aliases`` file. This file is automatically loaded by zsh.
* **zshrc**: it is possible to add commands at the end of the zshrc routine in ``/opt/my-resources/setup/zsh/zshrc`` file.

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.


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

:code:`tmux` (conf)
~~~~~~~~~~~~~~~~~~~
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

Exegol supports overloading its **tmux** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.tmux.conf`` configuration file, simply create the file ``/opt/my-resources/setup/tmux/tmux.conf``

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.

.. _User-setup:

User setup
----------
.. seealso::
    Available from version ``3.0.0`` of any exegol image.

The ``/opt/my-resources/setup/load_user_setup.sh`` script is executed on the first startup of each new container that has the "my-resources" feature enabled. Arbitrary code can be added in this file, in order to customize Exegol (dependency installation, configuration file copy, etc).

.. warning::
    It is strongly advised **not** to overwrite the configuration files provided by exegol (e.g. ``/root/.zshrc``, ``/opt/.exegol_aliases``, ...), official updates will not be applied otherwise.
