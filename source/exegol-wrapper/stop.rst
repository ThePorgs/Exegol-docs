===================
:code:`stop` action
===================

The objective of the stop action is to stop one or more Exegol container.

If these containers have a VPN configuration, shutting down the container will cause the VPN tunnel to be disconnected.

Options
=======

The options of the stop action are limited to selecting the container(s) to be stopped.

========================= =============
 Option                   Description
========================= =============
CONTAINER                 Tag used to target one or more Exegol containers
========================= =============


Command examples
================

.. code-block:: bash

    # Stop interactively one or more containers:
    exegol stop

    # Stop the demo container:
    exegol stop demo

    # Stop the demo, test and dev container:
    exegol stop demo test dev
