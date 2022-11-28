:code:`install` action
======================

This action can be used to install an Exegol image. At least one Exegol image is required to create and start a container and enjoy Exegol.

When this action is used, the image can either be:

* **downloaded** (i.e. "pulled" in Docker terms) from `the official Dockerhub registry <https://hub.docker.com/repository/docker/nwodtuhs/exegol>`_. In this case, a compressed and pre-built image is downloaded in the form of layers, and then uncompressed.
* **built** locally by following the instructions of a Dockerfile offered on `the Exegol-images GitHub repo <https://github.com/ThePorgs/Exegol>`_. Here again, no need to download the dockerfile manually, all of them are already at ``/path/to/Exegol/exegol-docker-build/``.

.. hint::

    The ``install`` action can be used without any particular argument or option. the wrapper will then enter in an interactive TUI (Text-based User Interface) mode where the user will be asked to choose what image to install or build.

    .. code-block:: bash

       exegol install

Options
-------

=================== =============
 Option              Description
=================== =============
 ``IMAGE``           Optional positional argument to indicate the image to install (if downloading), or the name of the image to build (if building locally).
 ``BUILD_PROFILE``   Optional positional argument to indicate the source profile to use if building locally.
 ``--build-log``     Write logs to the path specified if building locally.
=================== =============


Command examples
----------------

.. code-block:: bash

   #Install or build interactively an exegol image
   exegol install

   #Install or update the full image
   exegol install full

   #Build interactively a local image named myimage
   exegol install myimage

   #Build the myimage image based on the full profile and log the operation
   exegol install myimage full --build-log "/tmp/build.log"