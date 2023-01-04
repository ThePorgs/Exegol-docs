==============
Python Wrapper
==============

The Exegol project regroups many things (docker images, offline resources, custom configurations, aliases, history commands, multi-architecture support and many others). In order to make all the tech involved easy to use, and provide some unique entrypoint to the whole setup, a Python wrapper was created.

The Python wrapper handles all Docker and Git operations, can manage multiple images and containers at once and give the user the best experience possible, suited for beginners as well as advanced people.

The wrapper knows multiple actions.

* Install an image : ``exegol install``
* Create/start/enter a container : ``exegol start``
* Show info on containers and images : ``exegol info``
* Stop a container : ``exegol stop``
* Remove a container : ``exegol remove``
* Uninstall an image : ``exegol uninstall``
* Get help and advanced usage : ``exegol --help``
* Help and examples can be obtained for each action directly from the wrapper with the following command: ``exegol <action> -h`` (action: ``install``/``start``/``stop``/etc.).

All actions are documented in the **exegol-wrapper** part of this doc (e.g. :doc:`info </exegol-wrapper/info>`, :doc:`start </exegol-wrapper/start>`, :doc:`version </exegol-wrapper/version>`, ...)

Below is a, non-exhaustive, list of what the wrapper supports:

=================================================== =============
 Feature                                             Description
=================================================== =============
:ref:`Display sharing<feature_display_sharing>`     Sharing of the graphic environment between the container and the host
:ref:`Workspace<feature_workspace>`                 Persistent and shared workspace with the host
:ref:`Update-fs<feature_update_fs>`                 Permission sharing between the container and the host
:ref:`OpenVPN connection<feature_ovpn>`             Opening an isolated VPN tunnel dedicated to the exegol container
:ref:`Shell logging<feature_shell_logging>`         Recording of sessions (input and output) in log files with date and time
:ref:`Shared network<feature_shared_network>`       Sharing the host's network interfaces
:ref:`Shared timezones<feature_shared_tz>`          Sharing the host's timezone configuration
:ref:`Exegol-resources<feature_exegol_resources>`   Easy access to a collection of resources and tools
:ref:`My-resources<feature_my_resources>`           User space dedicated to customization
:ref:`Volume sharing<feature_volume_sharing>`       Support for specific volume addition
:ref:`Port sharing<feature_port_sharing>`           Support for port publishing
:ref:`Env. variables<feature_env>`                  Support for environment variable configuration
:ref:`Device sharing<feature_device_sharing>`       Support for hardware sharing
:ref:`Capabilities<feature_capabilities>`           Support for adding specific capabilities
:ref:`Privileged<feature_privileged>`               Support of the privileged mode
:ref:`Multi-architecture<feature_multi_arch>`       Support for AMD64 and ARM64 architectures
:ref:`Local image<feature_image_building>`          Customized local image building
:ref:`Remote image<feature_image_pulling>`          Pre-built image available for download
:ref:`Command execution<feature_exec>`              Execution of specific command
:ref:`Daemon execution<feature_exec_daemon>`        Support of the command execution in the background
:ref:`Temporary containers<feature_exec_tmp>`       Support for command execution in a dedicated and temporary environment
=================================================== =============

.. note::

   Exegol uses Docker images and containers. Understanding the difference is essential to understand Exegol.

   * **image**: think of it as an immutable template. They cannot be executed as-is and serve as input for containers. It's not possible to open a shell in an image.
   * **container**: a container rests upon an image. A container is created for a certain image at a certain time. It's possible to open a shell in a container. Careful though, once a container is created, updating the image it was created upon won't have any impact on the container. In order to enjoy the new things, a new container must be created upon that updated image.

Features
========

The Exegol wrapper has many features to automatically and transparently manage different configurations to facilitate the use and creation of docker containers.

.. _feature_display_sharing:

Display sharing
---------------

By default exegol configures the new container and host to allow the execution to the display of graphical window launched from an exegol container.

For example, if bloodhound is launched in an exegol container, the graphical window (GUI) will be displayed in the user's graphic environment.

This feature can be disabled manually with the option ``--disable-X11`` of the :ref:`start action <start_options>`.

.. _feature_workspace:

Workspace
---------

Exegol always creates within a container a **persistent** workspace (even after deleting the container) and **shared** with the host.

By default a folder will be created on the host and shared with the container. This folder will be created in ``~/.exegol/workspaces/`` with the name of the exegol container.

.. tip::
    The default location of workspace volumes can be changed in the :ref:`configuration of Exegol<exegol_configuration>`.

The user can also create an Exegol container with an **existing custom workspace folder** (with already existing data) regardless of its location in the file system.

See the options ``-w WORKSPACE_PATH`` and ``-cwd`` of the :ref:`start action <start_options>` for more details.

.. _feature_update_fs:

Update-fs
~~~~~~~~~

The root user is used by default in Exegol containers which poses problems of permissions when accessing the project documents from the host.
To remedy this without compromising, a **shared permission system** exists allowing the host user to have read and write access to files created from the container.

This system is **automatically activated** when a **new** default workspace is created.


.. warning::
    When the user uses an existing custom folder as workspace, this system is **disabled** by default! This feature can be **enabled by default** by changing the :ref:`configuration of Exegol<exegol_configuration>`.

    Its activation is possible manually (see the option ``--update-fs`` of the :ref:`start action <start_options>`) but it will lead to the **modification** of the folder and its sub-folders **permissions** (as ``g+rws``).

    If the user does not have the rights to perform such an operation, a **sudo command** will be proposed to the user that he will have to **execute manually** to apply the necessary permissions for the proper functioning of the functionality (as ``chgrp`` + ``g+rws``).

.. tip::
    When the default configuration of this feature is changed and the update will be **enabled by default**, the option ``--update-fs`` can still be used to manually **disable** the feature in specific cases.

.. _feature_ovpn:

OpenVPN connection
------------------

Exegol supports OpenVPN tunnel configuration to **automatically** establish a VPN tunnel at container **startup**.

Exegol supports certificate authentication (all files should preferably be included in a single ovpn file) but also user/password authentication through an authentication file (to allow non-interactive and transparent authentication).

.. tip::
    A folder can also be used in the case of a **multi-file configuration** (with **relative** paths!) and the configuration file must have the ``.ovpn`` extension (Only **one** .ovpn file will be loaded by exegol).

See the options ``--vpn VPN`` and ``--vpn-auth VPN_AUTH`` of the :ref:`start action <start_options>` for more details.

.. tip::
    In case of problem, to troubleshoot a VPN connection, the log of OpenVPN can be retrieved within the container in the ``/var/log/exegol/vpn.log`` file

.. _feature_shell_logging:

Shell logging
-------------

Within the framework of a mission, it is necessary to **log all actions** performed during a pentest, red team etc.
To meet this need, Exegol has a feature to **automatically record everything** that is displayed (stdout / stderr) but also all entries (stdin).

See the option ``--log`` of the :ref:`start action <start_options>` to enable the feature.

.. hint::
    When the option is enabled upon **creation** of a new container, all shells created for this container **will be automatically logged**.

    If the container was created **without** this option, the shells can still be logged **individually** by adding the option in the **start** command of **each** shell.

The date and time of each command is displayed thanks to the PS1 of ``zsh``.

The logs are automatically saved in the ``/workspace/logs`` folder. Each log file is **automatically compressed** with ``gzip`` at the end of the session to optimize disk space.
The automatic compression of log files can be **disabled** manually with the :ref:`start action <start_options>` ``--log-compress`` parameter or change the default behavior in the :ref:`Exegol configuration file <exegol_configuration>`.

.. hint::
    When the default configuration of the log compression is changed from the config file and the feature will be **disabled by default**, the option ``--log-compress`` can still be used to manually **enable** the feature in specific cases.

.. warning::
    The logs should **NOT** be consulted from the exegol container but **from the host** to avoid loops and duplication of data in the logs.

There are (since exegol images version ``3.0.0``) different methods of shell logging.
The shell logging method can be selected manually with the :ref:`start action <start_options>` ``--log-method`` parameter or by default in the :ref:`configuration file of Exegol <exegol_configuration>`.

.. tabs::

    .. tab:: asciinema (default)

        The shell logging method **asciinema** is available from exegol images version ``3.0.0``.
        This new mode allows to consult sessions in **video** format taking into account the interactive environment.
        It is also possible to **manually upload** and **share** recordings, useful for **demonstrations** for example

        Here is a quick demonstration:

        .. raw:: html

            <div align="center">
                <script id="asciicast-lZfOEQuCKonM2htTJEz9QDWPo" src="https://asciinema.org/a/lZfOEQuCKonM2htTJEz9QDWPo.js" async></script>
            </div>

        .. tip::
            Logs in ``.gz`` format can be replay directly **without unpacking** them with the command: ``gunzip -c <filename_shell.asciinema.gz> | asciinema play -``

        .. hint::
            To display the whole session **without** the "video" mode, it is possible to use the command: ``asciinema cat <filename_shell.asciinema>``

        .. warning::
            Major disadvantage of this method, to view the logs from your host, you must **install** ``asciinema`` on your **host** machine to replay or share your records.

        .. tip::
            When you share or play an ``asciinema`` video, you can **copy** and **paste** any command/text it contains.

    .. tab:: script
        **script** is the "classic" method of session logging, it was also the only option available before version ``3.0.0`` of exegol images.
        This method simply records **all** incoming (stdin) and outgoing (stdout/stderr) shell actions in a file.

        .. tip::
            Logs in ``.gz`` format can be viewed directly **without unpacking** them with the ``zcat``, ``zgrep``, ``zdiff`` or ``zmore`` command!

        .. warning::
            Shell logging saves **EVERYTHING** including keyboard shortcuts, display refreshes, etc.

            Complex graphical environments (such as tmux) can make it difficult to read the logs.


.. _feature_shared_network:

Shared network
--------------

By default, containers created by Exegol are in ``host`` mode which means that the **network interfaces** of the host are **shared** with the container.

This configuration is useful to:

* dynamically open ports and services
* have a low level access on a physical network (some operation might need privileged mode)
* share a unique ip address on the target network
* share a MAC address on the target network (to be considered as a single physical machine)

This mode can be disabled with the option ``--disable-shared-network`` of the :ref:`start action <start_options>` to create a dedicated and isolated network instead.

.. tip::
    When host network sharing is disabled, ports can be  to expose services on the host machine's networks.

.. warning::
    This mode is only available on **Linux** installations!
    Windows and MacOS installations are subject to the constraints and limitations of `Docker Desktop <https://docs.docker.com/network/network-tutorial-host/#prerequisites>`__ .

    You can still use the port :ref:`publishing feature <feature_port_sharing>` instead.

.. _feature_shared_tz:

Shared timezones
----------------

For convenience and precision in the date and time of the logs of each command, exegol allows to share the timezone of the host in the container.

This feature is active by default and can be disabled with the option ``--disable-shared-timezones`` of the :ref:`start action <start_options>`.

.. _feature_exegol_resources:

Exegol-resources
----------------

To save time and have at hand many tools, scripts and other resources, exegol maintains a repository :ref:`exegol-resources <exegol-resources>` contains many updated tools that are available to the host and exegol containers.

This module is not mandatory and can be downloaded later.

.. hint::
    If an antivirus is present on your host, be careful to exclude the destination folder of the ``exegol-resources`` module before downloading it.

This feature is active and shared by default and can be disabled with the option ``--disable-exegol-resources`` of the :ref:`start action <start_options>`.

.. _feature_my_resources:

My-resources
------------

The my-resources feature is a space dedicated to the user and shared with all the containers. This space allows to store configurations and to install personal tools.

More details on the functionality of the wrapper :ref:`here <My-resources-wrapper>` and how to take advantage of the customization system :doc:`here </exegol-image/my-resources>`.

.. _feature_volume_sharing:

Volume sharing
--------------

For specific needs, the exegol wrapper allows to add additional custom volumes (type bind mounts) when creating an exegol container.

See the option ``--volume VOLUMES`` of the :ref:`action start <start_options>` for more details.

.. _feature_port_sharing:

Port sharing
------------

When the host network is not shared, it is still possible to **publish** specific ports to expose **services** or **port** ranges.

.. hint::
    This configuration is **compatible** even with installations based on Docker Desktop.

This feature allows the user to select:

* a specific network interface (for example 127.0.0.1) or by default all interfaces (0.0.0.0).
* the port to open on the host interface.
* the destination port to be linked in the container.
* the protocol to use, docker supports ``TCP``, ``UDP`` and ``SCTP`` protocols (default is TCP).

See the option ``--port PORTS`` of the :ref:`start action <start_options>` for more details.

.. _feature_env:

Env. variables
--------------

Exegol can configure custom environment variables defined by the user.

When the environment variables are defined at the first time of the container creation, these variables will be:

* accessible in the container by all processes
* present during the whole lifetime of the container

The environment variables can be defined when opening a shell in an **existing** container and will be available **only** in the user's shell until it is closed.

See the option ``--env ENVS`` of the :ref:`start action <start_options>` for more details.

.. _feature_device_sharing:

Device sharing
--------------

For the needs of some applications running on physical hardware (such as proxmark3), exegol can supply the container with one or more physical devices.

See the option ``--device DEVICES`` of the :ref:`start action <start_options>` for more details.

.. warning::
    This feature is only available on **Linux** installations!

    Windows and MacOS installations are subject to the constraints and limitations of `Docker Desktop <https://docs.docker.com/desktop/faqs/#can-i-pass-through-a-usb-device-to-a-container>`__.

.. _feature_capabilities:

Capabilities
------------

Exegol supports adding **Linux capabilities** to the Exegol **container** to perform tasks that require **administrative** rights **without** allowing everything.

This feature gives control to the user to configure his container but giving administrator rights remains a dangerous practice and should be used by experienced users only.

For more details on the capabilities supported by docker `check here <https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities>`_.

.. warning::
    Not all Linux capabilities are allowed by the Exegol wrapper, here is the list of available capabilities:

    SYS_RAWIO, SYS_MODULE, NET_BROADCAST, NET_ADMIN, SYS_CHROOT, MKNOD, NET_RAW, SYS_ADMIN, SETFCAP, SYS_PTRACE

    For all other needs, consider the :ref:`privileged <feature_privileged>` mode.

.. _feature_privileged:

Privileged
----------

For particular needs, it is sometimes necessary to have **privileged rights** to perform certain actions.
If Exegol does **not** allow you to have specifically the rights necessary, you can configure your container in privileged mode to get **full administrator rights**.

.. warning::
    This configuration is particularly **dangerous** because it gives the container **full admin control** over the **kernel** of the **host** machine.

    Use this option **only** if you know **exactly** what you are doing!!

    If the need is specifically identified, consider adding :ref:`capabilities <feature_capabilities>` instead!

See the option ``--privileged`` of the :ref:`start action <start_options>` for more details.

.. _feature_multi_arch:

Multi-architecture
------------------

Exegol supports ``ARM64`` architecture (in addition to the classic ``AMD64``) since version ``4.1.0`` of the wrapper and ``3.0.0`` of the images.

This support allows you to fully use exegol on hardware equipped with an **ARM** processor (such as Mac M1 / M2 but also some Raspberry Pi).

.. warning::
    Exegol only supports **64-bit ARM** architecture! If your ARM processor supports 64-bit, make sure your **OS** is also installed in **64-bit version** to use exegol!

.. tip::
    For experienced users or developers, it is possible to explicitly modify the architecture used by the Exegol wrapper with the :ref:`general option <general_options>` ``--arch ARCH``.

    But be **careful**, the modification of this parameter can lead to **malfunctions**!

.. _feature_image_building:

Local image building
--------------------

The wrapper allows users to locally build their images from the ``exegol-images`` sources.

More information in the :ref:`advanced uses <local_build>` section.

.. _feature_image_pulling:

Remote image pulling
--------------------

To save time, pre-built images are available for download from DockerHub.
These images can be downloaded and installed / updated from the exegol wrapper with the :doc:`install </exegol-wrapper/install>` and :doc:`update </exegol-wrapper/update>` actions.

.. _feature_exec:

Command execution
------------------

The Exegol wrapper does not only allow the opening of interactive shells, it is also possible to execute **single commands** in several ways.

.. tip::
    To see the execution logs of the command, the user must add the parameter ``-v``.

The details of this functionality are detailed in the :doc:`exec </exegol-wrapper/exec>` action.

.. _feature_exec_daemon:

Daemon execution
~~~~~~~~~~~~~~~~

One of the execution modes can be in the **background** like a daemon service.
In this way the wrapper executes the **user's command**, for example an application such as bloodhound.
The wrapper **launches** the task in an exegol container and **finishes immediately** without occupying the user's terminal, leaving the application **open**.

See the option ``--background`` of the :ref:`exec action <exec_options>` for more details.

.. _feature_exec_tmp:

Temporary containers
~~~~~~~~~~~~~~~~~~~~

Another feature of the :doc:`exec </exegol-wrapper/exec>` action is the execution in a **temporary** container.

In this mode, a **temporary** container will be created and **dedicated** to the execution of the command specified by the user.

This mode can be useful to run a given command with the most **up-to-date** image already installed on the host, for any **test** or for special **privacy** needs.

See the option ``--tmp`` of the :ref:`exec action <exec_options>` for more details.
