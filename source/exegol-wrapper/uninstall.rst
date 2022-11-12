========================
:code:`uninstall` action
========================

The purpose of the ``uninstall`` action is to remove one or more Exegol images.

.. warning::
    The wrapper will try to delete the selected exegol images but this can only work if the selected images are **not used by any container** anymore. A container based on an image that doesn't exist anymore cannot run.

Options
=======

The options of the ``uninstall`` action are limited to selecting the image(s) to be removed, and forcing the removal without asking the user for interactive confirmation.

========================= =============
 Option                   Description
========================= =============
``IMAGE``                 Tag used to target one or more Exegol images
``-F``, ``--force``       Remove image without interactive user confirmation.
========================= =============


Command examples
================

.. code-block:: bash

    # Remove interactively one or more containers:
    exegol uninstall

    # Remove the "full" container:
    exegol uninstall "full"

    # Remove the "full", "ad" and "web" container without asking for user confirmation:
    exegol uninstall -F "full" "ad" "web"
