Install
========

Installing Exegol starts with installing the entrypoint to the whole project: the Python wrapper. Once the wrapper is installed, everything else can be managed from it.

.. hint::

   It is strongly advised to install Exegol on a Linux host, especially when planning on using Exegol for internal penetration tests. This is because Docker Desktop on Windows and macOS lacks a few features, mainly due to how these operating systems run Docker containers within an internal VM that doesn't share the host's network interfaces and USB accessories.

Once the wrapper is installed, the second step in setting up Exegol on a device is to install at least one Exegol image, either with ``exegol start`` (documentation
:doc:`here </exegol-wrapper/start>`), or with ``exegol install`` (documentation
:doc:`here </exegol-wrapper/install>`). Both actions will guide the user in installing an image if needed.

.. _install_requirements:

Requirements
~~~~~~~~~~~~

The following elements are required before Exegol can be installed, whatever the host's operating system is:

* git (`Linux <https://github.com/git-guides/install-git#install-git-on-linux>`__ | `macOS <https://github.com/git-guides/install-git#install-git-on-mac>`__ | `Windows <https://github.com/git-guides/install-git#install-git-on-windows>`__)
* python3 (`Linux <https://docs.python.org/3/using/unix.html#on-linux>`__ | `macOS <https://www.python.org/downloads/macos/>`__ | `Windows <https://www.python.org/downloads/windows/>`__)
* docker (`Linux <https://docs.docker.com/engine/install/debian/>`__ | `macOS <https://docs.docker.com/desktop/install/mac-install/>`__ | `Windows <https://docs.docker.com/desktop/install/windows-install/>`__)
* at least 20GB of free storage

.. tip::

   From UNIX-like systems, Docker can be installed quickly and easily with the following command-line

   .. code-block:: bash

      curl -fsSL "https://get.docker.com/" -o get-docker.sh

.. warning::

   To run exegol from the user environment without `sudo`, the user must have privileged rights equivalent to root.
   To grant yourself these rights, you can use the following command

   .. code-block:: bash

      sudo usermod -aG docker $(id -u -n)

   For more information, official Docker documentation shows `how to manage docker as a non root user <https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-userm>`_.

.. _install_linux_mac:

Linux & macOS
~~~~~~~~~~~~~

The installation of Exegol on Linux and macOS are very similar. It can either be installed from pip (easiest, most user-friendly, but with a few missing features) or from sources (easy as well, fully featured).


1. Installation
`````````````````````````````````
.. _exegol-install:

..  tabs::

    ..  tab:: Installing with pip

        Exegol's wrapper can be installed from pip. While this is the easiest and most user-friendly technique, for more advanced users it is advised to install from sources, as it allows to switch from release to dev branches easily and the auto-update feature is supported.

        .. code-block:: bash

           python3 -m pip install exegol

        .. hint::

           Remember that pip installs binaries in ``~/.local/bin``, which then must be in the ``PATH`` environment variable. Adding ``export PATH=$HOME/.local/bin:$PATH`` to ``~/.zshrc`` or ``~/.bashrc`` (or equivalent) will do just that.


    ..  tab:: Installing from sources

        Exegol's wrapper can also be installed from sources (with Git). The wrapper then knows how to self-update, and switching from release and development branches is possible and very easy.

        .. code-block:: bash

           git clone "https://github.com/ShutdownRepo/Exegol"
           python3 -m pip install --user --requirement "Exegol/requirements.txt"


2. Adding Exegol to the ``PATH``
````````````````````````````````

Once this is taken care of, the exegol wrapper can then be added to the ``PATH`` with a symlink for direct access. This allows to call exegol from wherever, instead of to use the absolute path. Exegol can then be used with ``exegol <action>`` instead of ``python3 /path/to/Exegol/exegol.py <action>``.

.. code-block:: bash

   sudo ln -s "$(pwd)/exegol.py" "/usr/local/bin/exegol"

.. _install_windows:

Windows
~~~~~~~

Installing Exegol on Windows systems is very to similar to the Linux/macOS install. There is however and additional requirements: WSL2 (`how to <https://learn.microsoft.com/en-us/windows/wsl/install>`_).

For "GUI applications" support to work (i.e. X11 display sharing):

* Windows 11 is needed
* Docker must run on WSL2 engine
* `WSLg <https://github.com/microsoft/wslg#installing-wslg>`__ must be installed
* at least one WSL distribution must be installed as well (e.g. Debian), with Docker integration enabled

1. Wrapper installation
```````````````````````

The wrapper can then be installed with pip or from sources like on Linux/macOS. You can :ref:`follow the instructions here<exegol-install>`.

2. Adding an alias
``````````````````

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
