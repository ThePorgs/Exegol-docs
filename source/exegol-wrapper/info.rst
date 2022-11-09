===================
:code:`info` action
===================

The info action aims to display all the information specific to Exegol on the current system.
This action can also be used by targeting a specific container to display its configuration in detail.

Verbosity options
=================

Different information / level of detail can be obtained with this action.

Standard verbosity level (default)
----------------------------------

Using: ``exegol info``

* List of available Exegol Images

    * Name of the image
    * Size of each image (disk space if the image is installed, otherwise its compressed size to download for installation)
    * Status of each image

        * Not installed (Image available for download from dockerhub)
        * Up to date (The latest version of the image is installed and ready to be used)
        * Update available (A new version is available for download on dockerhub)
        * Outdated (Old version of an image that has been updated since)
        * Local image (Locally built image)
        * Discontinued (if your image is no longer available on dockerhub)

* List of Exegol Containers

    * Name of each container
    * Container status (Stopped or running)
    * Image name (Exegol image used as a base to create the container)
    * Configurations (Display of non-default configurations)

Verbose level
-------------

Using: ``exegol info -v``

* Enumerate every user configuration (see details :ref:`here<exegol_configuration>`)

* List of every available Exegol Images (with all previous information plus)

    * Image ID
    * Build date
    * Image architecture (AMD64 / ARM64)

* List of Exegol Containers (with all previous information plus)
    * Container id
    * Full configuration
    * List of non-technical volumes
    * List of Devices
    * List of Ports (Applicable if network sharing with host is not enabled)
    * List of custom environment variables

Advanced level
--------------

Using: ``exegol info -vv``

* Enumerate every user configuration (see details :ref:`here<exegol_configuration>`)

* List the different exegol modules

    * Modules name
    * Their update status
    * Their git branch (if applicable)

* List of every available Exegol Images (with all previous information)

* List of Exegol Containers (with all previous information plus)

    * List of every volumes
    * List of every environment variables


Options
=======

The info action does not have many parameters, its use is relatively simple, it is only possible to target an exegol container to display its configuration.

========================= =============
 Option                   Description
========================= =============
``CONTAINER``             Tag used to display configuration details of a targeted Exegol container
========================= =============

The general settings are still available and affect the behavior of every exegol action.

========================= =============
 Option                   Description
========================= =============
``-h``, ``--help``        Show the help message of any action
``-v``, ``--verbose``     Verbosity level (-v for verbose, -vv for advanced, -vvv for debug)
``-q``, ``--quiet``       Show no information at all
``-k``, ``--insecure``    Allow insecure server connections for web requests, e.g. when fetching info from DockerHub (default: Secure)
``--offline``             Run exegol in offline mode, no request will be made on internet (default: Disable)
``--arch {arm64,amd64}``  Overwrite default image architecture (default: host's arch)
========================= =============



Command examples
================

.. code-block:: bash

    # Print containers and images essentials information:
    exegol info

    # Print the detailed configuration of the demo container:
    exegol info demo

    # Print verbose information:
    exegol info -v

    # Print advanced information:
    exegol info -vv

    # Print debug information:
    exegol info -vvv
