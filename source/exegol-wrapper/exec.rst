:code:`exec` action
===================

This action allows you to run a single command in a single container instead of loading a full interactive shell.

When this action is used it is possible to execute a command in:

* an **existing** and **persistent** container

    * the name of an exegol **container** must be provided, this container will be created in interactive mode if it does not already exist
* a **temporary** container created especially to execute the command and **automatically deleted** at the end of the execution

    * the name of an exegol **image** must be provided from which a temporary container will be created

The executed command can be run:

* in the **background** mode

    * exegol **terminates immediately** after the command is launched and does not wait for its execution to be completed
* in **standard mode**

    * exegol will **wait** for the end of the command execution to finish the action

.. tip::
    In standard execution mode, it is possible to ask exegol to display in your terminal the **output** (stdout/stderr) of the command sent by adding the parameter ``-v``

Options
-------

Because the exec action can also create containers, it shares the same parameters as the :ref:`start action<start_options>`.


However, there are additional parameters unique to the use of the action exec:

========================= =============
 Option                   Description
========================= =============
 ``CONTAINER or IMAGE``   This option indicates the **container** name to use to execute the command. If the ``--tmp`` parameter is used, this name will be used to target an **image**.
 ``COMMAND``              Single command to execute in the container.
 ``-b``, ``--background`` Executes the command in background as a daemon.
 ``--tmp``                Creates a dedicated and temporary container to execute the command.
========================= =============

Command examples
----------------

.. code-block:: bash

    # Execute the command bloodhound in the container demo:
    exegol exec demo bloodhound

    # Execute the command 'nmap -h' with console output in the container demo:
    exegol exec -v demo 'nmap -h'

    # Execute a command in background within the demo container:
    exegol exec -b demo bloodhound

    # Execute the command bloodhound in a temporary container based on the full image:
    exegol exec --tmp full bloodhound

    # Execute a command in background with a temporary container:
    exegol exec -b --tmp full bloodhound

