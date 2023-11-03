==============
Install Exegol
==============

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
* docker (`Linux <https://docs.docker.com/engine/install/debian/>`__) or Docker Desktop (`macOS <https://docs.docker.com/desktop/install/mac-install/>`__ | `Windows <https://docs.docker.com/desktop/install/windows-install/>`__)
* at least 20GB of free storage

Additional dependencies may be required depending on the host OS.

..  tabs::

    ..  tab:: Linux

        No additional dependencies for Linux environments.

        .. tip::

           From Linux systems, Docker can be installed quickly and easily with the following command-line:

           .. code-block:: bash

              curl -fsSL "https://get.docker.com/" -o get-docker.sh
              sh get-docker.sh

        .. warning::

           By default, ``sudo`` will be required when running docker, hence needed as well for Exegol. For security reasons, it should stay that way, but it's possible to change that. In order to run exegol from the user environment without ``sudo``, the user must have the appropriate rights. You can use the following command to grant them to the current user:

           .. code-block:: bash

              # add the sudo group to the user
              sudo usermod -aG docker $(id -u -n)

              # "reload" the user groups with the newly added docker group
              newgrp docker

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

        .. tip::

            `OrbStack <https://orbstack.dev/>`__ for **Mac** is supported by Exegol wrapper from ``v4.2.0``.

            This support is still in beta, feel free to open issues on `GitHub <https://github.com/ThePorgs/Exegol/issues/new/choose>`__ if you encounter any bugs.

    ..  group-tab:: Windows

        To support graphical applications (:ref:`display sharing functionality <feature_display_sharing>`, e.g. Bloodhound, Wireshark, Burp, etc.), additional dependencies and configuration are required:

        * Windows **10** (up to date), or Windows **11**, is required
        * You have **Docker Desktop** installed on your Windows host
        * Docker Desktop must be configured to run on **WSL2** engine (`how to <https://learn.microsoft.com/en-us/windows/wsl/install>`_)
        * `WSLg <https://github.com/microsoft/wslg#installing-wslg>`_ must be installed to support graphical application
        * at least one WSL distribution must be **installed** as well (e.g. Debian), with **Docker integration** enabled (see screenshot below)


        .. figure:: /assets/install/windows_dockerdesktop_wsl_config.png
            :align: center
            :alt: Windows Docker Desktop WSL integration configuration

            Windows Docker Desktop WSL integration configuration

        In a Windows environment, the Exegol wrapper can be installed **either** in a **WSL shell** or directly in your Windows environment with **Powershell**.

        .. warning::

            Please note that it is **not** advisable to use Exegol from both environments at the same time, as this could lead to conflicts and Exegol does not officially support this configuration.

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

        If you have access to docker directly as a user, you can install the requirements only for your current user
        otherwise the requirements must be installed as root to run Exegol with sudo.

        .. tabs::

            .. tab:: With sudo

                .. code-block:: bash

                   sudo python3 -m pip install --requirement "Exegol/requirements.txt"

            .. tab:: Directly as user

                .. code-block:: bash

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

                Once this is taken care of, the exegol wrapper can then can be added as a PowerShell command alias. Exegol can then be used with ``exegol <action>`` instead of ``python3 /path/to/Exegol/exegol.py <action>``.

                To create the alias file correctly, open a PowerShell and place yourself in the folder where exegol is located (applicable only for `from source` installations) and run the following commands:

                Create `$PROFILE` file if it doesn't exist:

                .. code-block:: powershell

                    if (!(Test-Path -Path $PROFILE)) {
                        New-Item -ItemType File -Path $PROFILE -Force
                    }
                
                Create alias for Exegol in `$PROFILE`:

                .. code-block:: powershell

                    echo "Set-Alias -Name exegol -Value '$(pwd)\exegol.py'" >> $PROFILE

                .. warning::

                   To automatically load aliases from the ``.ps1`` file, PowerShell's ``Get-ExecutionPolicy`` must be set to ``RemoteSigned``.

                   If the configuration is not correct it can be configured as **administrator** with the following command:

                   .. code-block:: powershell

                      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

                .. tip::
                    If you have installed Python3 manually and Windows opens the **Microsoft store** on the python page as soon as you type ``python3.exe``, try this:

                    It is possible to disable this behavior in the Windows settings: ``Apps > Apps & features > App execution aliases`` and disable aliases for ``python.exe`` and ``python3.exe``.

3. (Optional) Using Exegol auto-completion
------------------------------------------

Exegol supports auto-completion in many shell environments but there is a configuration to add for this feature to work.

.. tip::

    If you have a source installation, make sure you have installed (or updated) the ``requirements.txt`` packages before using the completer.

.. important::

    The following configurations must be made in your **host** environment.

..  tabs::
    ..  tabs::
        .. tab:: Bash

            You can enable Exegol auto-completion for your **current user** with your ``.bashrc`` or you can enable the auto-completion **system-wide** with ``bash-completion``.

            ..  tabs::

                .. tab:: Via bash-completion

                    To setup the auto-completion system-wide you first need to install ``bash-completion`` on your system (if not already installed).

                    .. code-block:: bash

                        sudo apt update && sudo apt install bash-completion

                    At this point you should have a ``/etc/bash_completion.d/`` folder. It's in there that you can add any auto-completion module that you want.

                    To generate and install the exegol completion configuration you can execute the following command with ``register-python-argcomplete``:

                    .. code-block:: bash

                        register-python-argcomplete --no-defaults exegol | sudo tee /etc/bash_completion.d/exegol > /dev/null

                .. tab:: Via .bashrc

                    Add the following command in your ``~/.bashrc`` config:

                    .. code-block:: bash

                        eval "$(register-python-argcomplete --no-defaults exegol)"


            .. tip::
                If you have multiple tools using ``argcomplete`` you can also use the `global completion <https://kislyuk.github.io/argcomplete/#global-completion>`__ method (need bash >= 4.2).

        .. tab:: Zsh

            To activate completions for zsh you need to have ``bashcompinit`` enabled in zsh:

            .. code-block:: bash

                autoload -U bashcompinit
                bashcompinit

            Afterwards you can enable completion by adding the following command in your ``~/.zshrc`` config:

            .. code-block:: bash

                eval "$(register-python-argcomplete --no-defaults exegol)"

        .. tab:: Fish

            To activate completions for fish use:

            .. code-block:: bash

                register-python-argcomplete --no-defaults --shell fish exegol | source

            or create new completion file, e.g:

            .. code-block:: bash

                register-python-argcomplete --no-defaults --shell fish exegol > ~/.config/fish/completions/exegol.fish

        .. tab:: Tcsh

            To activate completions for tcsh use:

            .. code-block:: bash

                eval `register-python-argcomplete --no-defaults --shell tcsh exegol`

        .. tab:: PowerShell

            To activate completions for PowerShell, first generate completion file :

            .. code-block:: powershell

                python $HOME\AppData\Roaming\Python\Python311\Scripts\register-python-argcomplete --no-defaults --shell powershell exegol > $HOME\Documents\WindowsPowerShell\exegol_completion.psm1

            .. important::

                `Python311` can be modified and depends on the version of Python you have installed
            
            Then import this completion file in `$PROFILE`:

            .. code-block:: powershell

                echo "Import-Module '$HOME\Documents\WindowsPowerShell\exegol_completion.psm1'" >> $PROFILE
            
            .. tip::
                
                You can have Zsh style completion in PowerShell using this:

                .. code-block:: powershell

                    echo "Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete" >> $PROFILE

4. Installation of the first Exegol image
-----------------------------------------

Once the exegol wrapper is installed, you can download your first docker image with the following command:

.. code-block:: bash

   exegol install

