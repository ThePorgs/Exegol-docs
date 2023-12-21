:code:`start` action
====================

This action can be used to start a container. At least one Exegol image is required to create and start a container and enjoy Exegol. Installing an image can be done with ``exegol install`` (documentation
:doc:`here </exegol-wrapper/install>`).

When this action is used, the following process is applied:

* if no Exegol image is installed, the user is asked to specify which one to install of build, and the process continues
* then, if the container to start doesn't already exist, it is created based on an Exegol image and a few settings to specify, and the process continues
* then, the container is started and a shell is opened

.. hint::

    The ``start`` action can be used without any additional argument or option. the wrapper will then enter in an interactive TUI (Text-based User Interface) mode where the user will be asked to choose a few settings.

    .. code-block:: bash

       exegol start

.. _start_options:

Options
-------

A single option exist to target an Exegol container.
If this container exists, it will be started if it is not already the case and a shell will be spawned to offer an interactive console to the user

========================= ===============================
 Option                   Description
========================= ===============================
``CONTAINER``             Tag used to target an Exegol container
========================= ===============================

Many options exist to customize the creation of exegol container.

.. tip::
    The default options of some commands can be changed in the :ref:`exegol configuration file<exegol_configuration>`.

Global options
~~~~~~~~~~~~~~

=========================================================== ===============================
 Option                                                     Description
=========================================================== ===============================
``IMAGE``                                                   Tag of the exegol image to use to create a new exegol container
``-w WORKSPACE_PATH``, ``--workspace WORKSPACE_PATH``       The specified host folder will be linked to the /workspace folder in the container.
``-cwd``, ``--cwd-mount``                                   This option is a shortcut to set the /workspace folder to the user's current working directory (pwd).
``-fs``, ``--update-fs``                                    Modifies the permissions of folders and sub-folders shared in your workspace to access the files created within the container using your host user account. (default: Disabled)
``-V VOLUMES``, ``--volume VOLUMES``                        Share a new volume between host and exegol (format: --volume /path/on/host/:/path/in/container/[:ro|rw]).
``-p PORTS``, ``--port PORTS``                              Share a network port between host and exegol (format: --port [<host_ipv4>:]<host_port>[:<container_port>][:<protocol>]. This configuration will disable the shared network with the host.
``--hostname HOSTNAME``                                     Set a custom hostname to the exegol container (default: exegol-<name>)
``--cap CAPABILITIES``                                      **(dangerous)** Capabilities allow to add specific privileges to the container (e.g. need to mount volumes, perform low-level operations on the network, etc).
``--privileged``                                            **(dangerous)** give extended privileges at the container creation (e.g. needed to mount things, to use wifi or bluetooth)
``-d DEVICES``, ``--device DEVICES``                        Add host device(s) at the container creation (example: -d /dev/ttyACM0 -d /dev/bus/usb/).
``--disable-X11``                                           Disable X11 sharing to run GUI-based applications. (default: Enabled)
``--disable-my-resources``                                  Disable the mount of the shared resources (/opt/my-resources) from the host (/home/dramelac/.exegol/my-resources) (default: Enabled)
``--disable-exegol-resources``                              Disable the mount of the exegol resources (/opt/resources) from the host (/home/dramelac/Documents/tools/Exegol/exegol-resources) (default: Enabled)
``--disable-shared-network``                                Disable the sharing of the host's network interfaces with exegol (default: Enabled)
``--disable-shared-timezones``                              Disable the sharing of the host's time and timezone configuration with exegol (default: Enabled)
=========================================================== ===============================

Virtual desktop
~~~~~~~~~~~~~~~

In addition to the X11 sharing functionality, Exegol can generate its own graphical environment and make it available to the user in a variety of ways.
By default, a web interface gives users access to their own containerized graphical desktop.

========================= ===============================
 Option                   Description
========================= ===============================
``--desktop``             Enable or disable the Exegol desktop feature (default: Disabled)
``--desktop-config``      Configure your exegol desktop (vnc or http) and its exposure (format: proto[:ip[:port]]) (default: http:127.0.0.1:<random>)
========================= ===============================

VPN
~~~

An additional feature of Exegol is the VPN tunnel option (OpenVPN).
Just provide an ovpn configuration to exegol and the container will take care of starting the tunnel at each startup.

========================= ===============================
 Option                   Description
========================= ===============================
``--vpn VPN``             Setup an OpenVPN connection at the container creation (example: --vpn /home/user/vpn/conf.ovpn)
``--vpn-auth VPN_AUTH``   Enter the credentials with a file (first line: username, second line: password) to establish the VPN connection automatically (example: --vpn-auth /home/user/vpn/auth.txt)
========================= ===============================

.. warning::
    All the options seen previously are taken into account **only** for the creation of a **new container**.
    It is **not possible** to modify the configuration of an existing container.
    These options will be **ignored** if a container with the same name already exists.

Shell logging
~~~~~~~~~~~~~

One of the functions of exegol very useful in a professional context is the shell logging.
This feature allows the user to record **everything** that happens in the exegol container (commands typed and responses).

=============================== ===============================
 Option                         Description
=============================== ===============================
``-l``, ``--log``               Enable shell logging (commands and outputs) on exegol to /workspace/logs/ (default: Disabled)
``--log-method``                Select a shell logging method used to record the session (default: ``asciinema``)
``--log-compress``              Enable or disable the automatic compression of log files at the end of the session (default: Enabled)
=============================== ===============================

.. tip::
    When the ``-l``/``--log`` option is enabled during the **creation** of a **new** container, all future shells will be **automatically logged** for this container.

Session specific
~~~~~~~~~~~~~~~~

The options specific to the start of the interactive session

=============================== ===============================
 Option                         Description
=============================== ===============================
``-e ENVS``, ``--env ENVS``     And an environment variable on Exegol (format: --env KEY=value). The variables configured during the creation of the container will be persistent in all shells. If the container already exists, the variable will be present only in the current shell.
``-s SHELL``, ``--shell SHELL`` Select a shell environment to launch at startup (default: zsh)
=============================== ===============================

.. tip::
    The environment variables configured with ``--env ENVS`` during the **creation** of a **new** container will be available to **all** processes of the container during the **entire life cycle** of the container.

Command examples
----------------

.. code-block:: bash

   # Start interactively a container
   exegol start

   # Create a demo container using full image
   exegol start demo full

   # Spawn a shell from demo container
   exegol start demo

   # Create a container test with a custom shared workspace
   exegol start test full -w "./project/pentest/"

   # Create a container test sharing the current working directory
   exegol start test full -cwd

   # Create a container htb with a VPN
   exegol start htb full --vpn "~/vpn/lab_Dramelac.ovpn"

   # Create a container app with custom volume
   exegol start app full -V "/var/app/:/app/"

   # Get a shell based on tmux
   exegol start --shell tmux

   # Share a specific hardware device (like Proxmark)
   exegol start -d "/dev/ttyACM0"

   # Share every USB device connected to the host
   exegol start -d "/dev/bus/usb/"

