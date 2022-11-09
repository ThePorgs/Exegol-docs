=====================
:code:`remove` action
=====================

The objective of the remove action is to remove one or more Exegol container.

If the deleted container used an outdated image, the wrapper will (by default) try to delete it automatically (unless this default behavior is changed in the :ref:`exegol configuration file<exegol_configuration>`).

When deleting the container, the wrapper will check if the content of the ``/workspace`` volume is empty.
If the workspace is **empty**, exegol will **automatically delete** the folder on the host otherwise it will **explicitly ask the user** if the workspace content should be **deleted**.

Options
=======

The options of the remove action are limited to selecting the container(s) to be removed and forcing the removal without asking the user for interactive confirmation.

========================= =============
 Option                   Description
========================= =============
CONTAINER                 Tag used to target one or more Exegol containers
``-F``, ``--force``       Remove container without interactive user confirmation.
========================= =============


Command examples
================

.. code-block:: bash

    # Remove interactively one or more containers:
    exegol remove

    # Remove the demo container:
    exegol remove demo

    # Remove the demo, test and dev container without asking for user confirmation:
    exegol remove -F demo test dev
