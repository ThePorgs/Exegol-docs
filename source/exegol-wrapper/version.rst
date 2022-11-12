======================
:code:`version` action
======================

The ``version`` action is mostly used for debugging purposes, it only displays information about the Exegol setup on the system.

In debug mode (``-vvv``), it also displays information about the system and wrapper installation context.

Options
=======

The options available for the version action are the global options that affect the behavior of all exegol actions.

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

    # Show version information
    exegol version

    # Show version and system information
    exegol version -vvv
