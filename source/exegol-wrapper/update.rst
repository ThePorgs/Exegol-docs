=====================
:code:`update` action
=====================

The exegol wrapper has an ``update`` action dedicated to update the different **modules** of the project but also the docker **images**.

The action will start by checking if updates of the wrapper are available,
then it will be the source files of installation and build of docker images (to build local images)
and finally the last module :ref:`exegol-resources<exegol-resources>`.
This last module is optional, it is not installed and can be downloaded and updated at any time.

.. tip::
    For modules installed with git, it is possible to checkout (change branch to dev for example) with the ``-v`` option
    which will interactively ask the user in which branch he wants to update.

After the verification of the modules updates, it's time to check the images.
If no parameters have been provided, an interactive selection can be made by the user to select the images to be updated.

.. hint::
    Older versions of images will be automatically deleted if they are no longer used by any container.
    This automatic deletion behavior is a default configuration that can be modified in the :ref:`configuration file<exegol_configuration>`.

Options
=======

The options of the update action are limited to selecting the image(s) to be update.

========================= =============
 Option                   Description
========================= =============
IMAGE                     Tag used to target one or more Exegol images
========================= =============

Additional options exist to skip the module update part or the image update part.

========================= =============
 Option                   Description
========================= =============
``--skip-git``            Skip git updates (wrapper, image sources and exegol resources).
``--skip-images``         Skip images updates (exegol docker images).
========================= =============


Command examples
================

.. code-block:: bash

    # Update interactively an exegol image:
    exegol update

    # Update the full image:
    exegol update full

    # Update the full image without update exegol modules:
    exegol update --skip-git full

    # Update exegol modules and have the option to change branch without updating docker image:
    exegol update -v --skip-images
