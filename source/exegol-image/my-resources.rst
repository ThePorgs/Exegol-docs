============
My Resources
============

My-resources is a multiple functionality. It is basically a 'simple' shared volume between the host and all exegol containers but with several uses.
To learn more about the volume options, details are available :ref:`here <My-resources-wrapper>`.

Usages
======

My resources allows users to have a persistent volume and common to all exegol instances. This volume is accessible within the container at the following path: ``/opt/my-resources``.
It is therefore possible to store in it any type of data, configuration, tool, etc. all that the user needs to work effectively and that is not already available in exegol nor in :doc:`exegol-resources </exegol-resources/intro>`.

..
    _TODO: add ref to images tool list


* Any tool can be downloaded in this folder and ready to use
* Personal tools, script and any type of executable can be added to the PATH of your exegol container by adding a symlink in the ``bin`` folder of my-resources.
* Custom configurations can also be added to personalize your exegol environment according to your habits. See :ref:`custom setup <Custom-setup>` section to learn how to customize your exegol environment.

.. _Custom-setup:

Custom setup
============

A sub-feature of my-resources is the custom configuration.
A customization system has been added to allow the user to customize his exegol environment automatically and transparently without having to redo a setup manually when creating each new container.

Supported setups
----------------

Configuration files stored in the ``/opt/my-resources/setup/`` directory will be deployed on the containers and allow users to customize Exegol further.
By default, the number of officially supported configuration files is limited, and it depends on the version of the image.

.. hint::
    In order to see what configuration files are supported in your version, the ``/opt/supported_setups.md`` documentation file can be read from any container.

This documentation references in detail all the official customizations available with the minimum image version required.

If a user wants to deploy tools and configurations that are not supported, or more advanced, the ``load_user_setup.sh`` script can be used, more information :ref:`below <user_setup>`.

:code:`bin` PATH
~~~~~~~~~~~~~~~~
.. seealso::
    Available from version `3.0.0` of any exegol image.

The folder ``/opt/my-resources/bin`` is automatically added to the PATH of the zsh shell of your container, free to the user to add scripts and other symlink to its unique tools stored somewhere in ``/opt/my-resources``

.. _custom_apt:

apt
~~~
.. seealso::
    Available from version `3.0.0` of any exegol image.

A system exists to easily install APT packages in any new exegol container.

* Custom APT **repositories** can be added in exegol by filling in the ``/opt/my-resources/setup/apt/sources.list`` file
* Importing custom repositories usually requires importing **GPG keys** as well, which can be done by entering trusted GPG keys download URLs in the ``/opt/my-resources/setup/apt/keys.list`` file
* To install **APT packages** automatically (after updating the repository including the custom ones), just enter a list of package names in the ``/opt/my-resources/setup/apt/packages.list`` file

zsh
~~~
.. seealso::
    Available from version `3.0.0` of any exegol image.

To not change the configuration for the proper functioning of exegol but allow the user to add aliases and custom commands to zshrc,
additional configuration files will be automatically loaded by zsh to take into account the customization of the user .

* **aliases**: Any custom alias can be defined in the ``/opt/my-resources/setup/zsh/aliases`` file. This file is automatically loaded by zsh.
* **zshrc**: It is possible to add commands at the end of the zshrc routine in ``/opt/my-resources/setup/zsh/zshrc`` file.

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.


vim
~~~
.. seealso::
    Available from version `3.0.0` of any exegol image.

Exegol supports overloading its **vim** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.vimrc`` configuration file, simply create the file ``/opt/my-resources/setup/vim/vimrc``
* vim configuration folders are also automatically synchronized:
    * ``/opt/my-resources/setup/vim/autoload/*`` --> ``~/.vim/autoload/``
    * ``/opt/my-resources/setup/vim/backup/*`` --> ``~/.vim/backup/``
    * ``/opt/my-resources/setup/vim/colors/*`` --> ``~/.vim/colors/``
    * ``/opt/my-resources/setup/vim/plugged/*`` --> ``~/.vim/plugged/``
    * ``/opt/my-resources/setup/vim/bundle/*`` --> ``~/.vim/bundle/``

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.

tmux
~~~~
.. seealso::
    Available from version `3.0.0` of any exegol image.

Exegol supports overloading its **tmux** configuration to allow all users to use their personal configuration.

* To automatically overwrite the ``~/.tmux.conf`` configuration file, simply create the file ``/opt/my-resources/setup/tmux/tmux.conf``

.. tip::
    It is possible to install **plugins** with the APT customization system, details :ref:`here <custom_apt>`.

.. _user_setup:

User setup
----------
.. seealso::
    Available from version `3.0.0` of any exegol image.

The ``/opt/my-resources/setup/load_user_setup.sh`` script is executed on the first startup of each new container that has the `my-resources` feature enabled.

Arbitrary code can be added in this file, in order to customize Exegol (dependency installation, configuration file copy, etc).

.. warning::
    It is strongly advised **not** to overwrite the configuration files provided by exegol (e.g. /root/.zshrc, /opt/.exegol_aliases, ...), official updates will not be applied otherwise.
