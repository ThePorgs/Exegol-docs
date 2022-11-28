=======
Install
=======

Installing Exegol starts with installing the entrypoint to the whole project: the Python wrapper. Once the wrapper is installed, everything else can be managed from it.

.. hint::

   It is strongly advised to install Exegol on a Linux host, especially when planning on using Exegol for internal penetration tests. This is because Docker Desktop on Windows and macOS lacks a few features, mainly due to how these operating systems run Docker containers within an internal VM that doesn't share the host's network interfaces and USB accessories.

Once the wrapper is installed, the second step in setting up Exegol on a device is to install at least one Exegol image, either with ``exegol start`` (documentation
:doc:`here </exegol-wrapper/start>`), or with ``exegol install`` (documentation
:doc:`here </exegol-wrapper/install>`). Both actions will guide the user in installing an image if needed.

.. contents::

.. _install_requirements:

Requirements
============

The following elements are required before Exegol can be installed, whatever the host's operating system is:

* git (`Linux <https://github.com/git-guides/install-git#install-git-on-linux>`__ | `macOS <https://github.com/git-guides/install-git#install-git-on-mac>`__ | `Windows <https://github.com/git-guides/install-git#install-git-on-windows>`__)
* python3 (`Linux <https://docs.python.org/3/using/unix.html#on-linux>`__ | `macOS <https://www.python.org/downloads/macos/>`__ | `Windows <https://www.python.org/downloads/windows/>`__)
* docker (`Linux <https://docs.docker.com/engine/install/debian/>`__ | `macOS <https://docs.docker.com/desktop/install/mac-install/>`__ | `Windows <https://docs.docker.com/desktop/install/windows-install/>`__)
* at least 20GB of free storage

Additional dependencies may be required depending on the host OS.

..  tabs::

    ..  tab:: Linux

        No additional dependencies for Linux environments.

        .. tip::

           From Linux systems, Docker can be installed quickly and easily with the following command-line:

           .. code-block:: bash

              curl -fsSL "https://get.docker.com/" -o get-docker.sh

        .. warning::

           To run exegol from the user environment without `sudo`, the user must have privileged rights equivalent to root.
           To grant yourself these rights, you can use the following command

           .. code-block:: bash

              sudo usermod -aG docker $(id -u -n)

           For more information, official Docker documentation shows `how to manage docker as a non root user <https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-userm>`_.

    ..  tab:: macOS

        To support graphical applications (:ref:`display sharing functionality <feature_display_sharing>`, e.g. Bloodhound, Wireshark, Burp, etc.), additional dependencies and configuration are required:

        * `XQuartz <https://www.xquartz.org/>`__ must be installed
        * The XQuartz config ``Allow connections from network clients`` must be set to true
        * Docker Desktop must be configured with default File Sharing (see screenshot below)

        .. figure:: /assets/install/macOS_xquartz_config.png
            :align: center
            :alt: macOS XQuartz configuration requirement

            macOS XQuartz configuration requirement

        .. figure:: /assets/install/macOS_resources_req.png
            :align: center
            :alt: macOS Docker Desktop resources requirement

            macOS Docker Desktop resources requirement

    ..  group-tab:: Windows

        To support graphical applications (:ref:`display sharing functionality <feature_display_sharing>`, e.g. Bloodhound, Wireshark, Burp, etc.), additional dependencies and configuration are required:

        * Windows **11** is needed
        * Docker must run on **WSL2** engine (`how to <https://learn.microsoft.com/en-us/windows/wsl/install>`_)
        * `WSLg <https://github.com/microsoft/wslg#installing-wslg>`_ must be installed
        * at least one WSL distribution must be **installed** as well (e.g. Debian), with **Docker integration** enabled

.. _exegol_install:

Installation
============

The installation of Exegol on Linux, macOS and Windows are very similar. It can either be installed from pip (easiest, most user-friendly, but with a few missing features) or from sources (easy as well, fully featured).


1. Installation of exegol
-------------------------

..  tabs::

    ..  group-tab:: Installing with pip

        Exegol's wrapper can be installed from pip.
        While this is the easiest and most user-friendly technique, for more advanced users it is advised to install from sources, as it allows to switch from release to dev branches easily and the auto-update feature is supported.

        .. code-block:: bash

           python3 -m pip install exegol


    ..  group-tab:: Installing from sources

        Exegol's wrapper can also be installed from sources (with Git). The wrapper then knows how to self-update, and switching from release and development branches is possible and very easy.

        .. code-block:: bash

           git clone "https://github.com/ThePorgs/Exegol"
           python3 -m pip install --user --requirement "Exegol/requirements.txt"


2. Adding Exegol to the ``PATH``
--------------------------------

..  tabs::

    ..  group-tab:: Installing with pip

        If your pip installation is correct and functional, you have nothing more to do and you can already use the command ``exegol``.

        If not, remember that pip installs binaries in a **dedicated** local folder, which then **must** be in the ``PATH`` environment variable.
        Try to fix your pip installation: `Linux <https://stackoverflow.com/a/62823029>`__ | `MacOS <https://stackoverflow.com/a/43368894>`__ | `Windows <https://builtin.com/software-engineering-perspectives/pip-command-not-found>`__


    ..  group-tab:: Installing from sources

        ..  tabs::
            .. tab:: Linux & MacOS

                Once this is taken care of, the exegol wrapper can then be added to the ``PATH`` with a symlink for direct access. This allows to call exegol from wherever, instead of to use the absolute path. Exegol can then be used with ``exegol <action>`` instead of ``python3 /path/to/Exegol/exegol.py <action>``.

                .. code-block:: bash

                   sudo ln -s "$(pwd)/exegol.py" "/usr/local/bin/exegol"

            ..  group-tab:: Windows

                Once this is taken care of, the exegol wrapper can then can be added as a PowerShell command alias and saved for persistence
                in ``$HOME\PowershellAliasesExport.txt``
                then loaded from ``$PROFILE`` script at PowerShell startup. Exegol can then be used with ``exegol <action>`` instead of ``python3 /path/to/Exegol/exegol.py <action>``.

                To create the alias file correctly, open a powershell and place yourself in the folder where exegol is located (applicable only for `from source` installations) and run the following commands:

                .. code-block:: powershell

                   $AliasFile = "$HOME\PowershellAliasesExport.txt"
                   Set-Alias -Name exegol -Value "$(pwd)\exegol.py"
                   Get-Alias -Name "exegol" | Export-Alias -Path $AliasFile
                   echo "Import-Alias '$AliasFile'" >> $PROFILE

                .. warning::

                   To automatically load aliases from the ``.ps1`` file, PowerShell's ``Get-ExecutionPolicy`` must be set to ``RemoteSigned``.

                   If the configuration is not correct it can be configured as **administrator** with the following command:

                   .. code-block:: powershell

                      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

                .. tip::
                    If you have installed Python3 manually and Windows opens the **Microsoft store** on the python page as soon as you type ``python3.exe``, try this:

                    It is possible to disable this behavior in the Windows settings: ``Apps > Apps & features > App execution aliases`` and disable aliases for ``python.exe`` and ``python3.exe``.

3. Installation of the first Exegol image
-----------------------------------------

Once the exegol wrapper is installed, you can download your first docker image with the following command:

.. code-block:: bash

   exegol install

