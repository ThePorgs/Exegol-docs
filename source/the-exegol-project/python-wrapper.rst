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

====================== =============
 Feature                Description
====================== =============
 Display sharing        :ref:`Sharing of the graphic environment between the container and the host <feature_display_sharing>`
 Workspace              :ref:`Persistent and shared workspace with the host <feature_workspace>`
 Update-fs              :ref:`Permission sharing between the container and the host <feature_update_fs>`
 OpenVPN connection     :ref:`Opening an isolated VPN tunnel dedicated to the exegol container<feature_ovpn>`
 Shell logging          :ref:`Recording of sessions (input and output) in log files with date and time <feature_shell_logging>`
 Shared network         :ref:`Sharing the host's network interfaces <feature_shared_network>`
 Shared timezones       :ref:`Sharing the host's timezone configuration <feature_shared_tz>`
 Exegol-resources       :ref:`Easy access to a collection of resources and tools <feature_exegol_resources>`
 My-resources           :ref:`User space dedicated to customization <feature_my_resources>`
 Volume sharing         :ref:`Support for specific volume addition <feature_volume_sharing>`
 Port sharing           :ref:`Support for port publishing <feature_port_sharing>`
 Env. variables         :ref:`Support for environment variable configuration <feature_env>`
 Device sharing         :ref:`Support for hardware sharing <feature_device_sharing>`
 Privileged             :ref:`Support of the privileged mode <feature_privileged>`
 Multi-architecture     :ref:`Support for AMD64 and ARM64 architectures <feature_multi_arch>`
 Local image            :ref:`Customized local image building <feature_image_building>`
 Remote image           :ref:`Pre-built image available for download<feature_image_pulling>`
 Command execution      :ref:`Execution of specific command <feature_exec>`
 Daemon execution       :ref:`Support of the command execution in the background <feature_exec_daemon>`
 Temporary containers   :ref:`Support for command execution in a dedicated and temporary environment <feature_exec_tmp>`
====================== =============


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

This feature can be disabled manually in the action start options.

.. _feature_workspace:

Workspace
---------

Exegol always creates within a container a **persistent** workspace (even after deleting the container) and **shared** with the host.

By default a folder will be created on the host and shared with the container. This folder will be created in ``~/.exegol/workspaces/`` with the name of the exegol container.

.. tip::
    The default location of workspace volumes can be changed in the :ref:`configuration of Exegol<exegol_configuration>`.

The user can also create an Exegol container with an **existing custom workspace folder** (with already existing data) regardless of its location in the file system. See the :ref:`action start options <start_options>` for more details.

.. _feature_update_fs:

Update-fs
~~~~~~~~~

The root user is used by default in Exegol containers which poses problems of permissions when accessing the project documents from the host.
To remedy this without compromising, a **shared permission system** exists allowing the host user to have read and write access to files created from the container.

This system is automatically activated when a new workspace is created.


.. warning::
    When the user uses an existing custom folder as workspace, this system is **disabled** by default! This feature can be **enabled by default** by changing the :ref:`configuration of Exegol<exegol_configuration>`.

    Its activation is possible manually (see the :ref:`action start options <start_options>`) but it will lead to the **modification** of file, folder and its sub-folders **permissions** (g+rw for files and g+rws for folders).

    If the user does not have the rights to perform such an operation, a **sudo command** will be proposed to the user that he will have to **execute manually** to apply the necessary permissions for the proper functioning of the functionality.

.. _feature_ovpn:

OpenVPN connection
------------------

Exegol supports OpenVPN tunnel configuration to **automatically** establish a VPN tunnel at container **startup**.

Exegol supports certificate authentication (all files should preferably be included in a single ovpn file) but also user/password authentication through an authentication file (to allow non-interactive and transparent authentication).

.. tip::
    A folder can also be used in the case of a **multi-file configuration** (with **relative** paths!) and the configuration file must have the ``.ovpn`` extension (Only **one** .ovpn file will be loaded by exegol).

See the :ref:`action start options <start_options>` for more details.

.. _feature_shell_logging:

Shell logging
-------------

Within the framework of a mission, it is necessary to **log all actions** performed during a pentest, red team etc.
To meet this need, Exegol has a feature to **automatically record everything** that is displayed (stdout / stdout) but also all entries (stdin).

The date and time of each command is displayed thanks to the PS1 of ``zsh``.

The logs are automatically saved in the ``/workspace/logs`` folder. Each log file is **automatically compressed** with ``gunzip`` at the end of the session to optimize disk space.

.. warning::
    The logs should **NOT** be consulted from the exegol container but **from the host** to avoid loops and duplication of data in the logs.

.. warning::
    Shell logging saves **EVERYTHING** including keyboard shortcuts, display refreshes, etc.
    Complex graphical environments (such as tmux) can make it difficult to read the logs.

.. tip::
    Logs in ``.gz`` format can be viewed directly without unpacking them with the ``zcat <log file>`` command!

.. _feature_shared_network:

Shared network
--------------

By default, containers created by Exegol are in ``host`` mode which means that the **network interfaces** of the host are **shared** with the container.

This configuration is useful to:

* dynamically open ports and services
* have a low level access on a physical network (some operation might need privileged mode)
* share a unique ip address on the target network
* share a MAC address on the target network (to be considered as a single physical machine)

This mode can be disabled with the :ref:`start action options <start_options>` to create a dedicated and isolated network instead.

.. tip::
    When host network sharing is disabled, ports can be  to expose services on the host machine's networks

.. warning::
    This mode is only available on **Linux** installations!
    Windows and MacOS installations are subject to the constraints and limitations of `Docker Desktop <https://docs.docker.com/network/network-tutorial-host/#prerequisites>`__ .

    You can still use the port :ref:`publishing feature <feature_port_sharing>` instead

.. _feature_shared_tz:

Shared timezones
----------------

For convenience and precision in the date and time of the logs of each command, exegol allows to share the timezone of the host in the container.

This feature is active by default and can be disabled with the :ref:`start action options <start_options>`.

.. _feature_exegol_resources:

Exegol-resources
----------------

To save time and have at hand many tools, scripts and other resources, exegol maintains a repository :ref:`exegol-resources <exegol-resources>` contains many updated tools that are available to the host and exegol containers.

This module is not mandatory and can be downloaded later.

.. hint::
    If an antivirus is present on your host, be careful to exclude the destination folder of the ``exegol-resources`` module before downloading it.

This feature is active and shared by default and can be disabled with the :ref:`start action options <start_options>`.

.. _feature_my_resources:

My-resources
------------

The my-resources feature is a space dedicated to the user and shared with all the containers. This space allows to store configurations and to install personal tools.

More details on the functionality of the wrapper :ref:`here <My-resources-wrapper>` and how to take advantage of the customization system :doc:`here </exegol-image/my-resources>`.

.. _feature_volume_sharing:

Volume sharing
--------------

WIP

.. _feature_port_sharing:

Port sharing
------------

WIP

.. _feature_env:

Env. variables
--------------

WIP

.. _feature_device_sharing:

Device sharing
--------------

WIP

.. warning::
    Not supported by `Docker Desktop <https://docs.docker.com/desktop/faqs/#can-i-pass-through-a-usb-device-to-a-container>`__.


.. _feature_privileged:

Privileged
----------

WIP

.. _feature_multi_arch:

Multi-architecture
------------------

WIP

.. _feature_image_building:

Local image building
--------------------

WIP

.. _feature_image_pulling:

Remote image pulling
--------------------

WIP

.. _feature_exec:

Command execution
------------------

WIP

.. _feature_exec_daemon:

Daemon execution
~~~~~~~~~~~~~~~~

WIP

.. _feature_exec_tmp:

Temporary containers
~~~~~~~~~~~~~~~~~~~~

WIP
