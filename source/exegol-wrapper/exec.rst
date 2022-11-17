:code:`exec` action
===================

This action allows to run a single command in a single container instead of loading a full interactive shell.

When this action is used it is possible to execute a command either in:

* a **temporary** container created especially to execute the command, and **automatically deleted** at the end of the execution: the name of an exegol **image** must be provided from which a temporary container will be created
* a standard Exegol container (already existing, or not): the name of an exegol **container** must then be provided. This container will be created in interactive mode if it does not already exist

The executed command can be executed either:

* in the **background** mode (i.e. like a daemon): exegol **terminates immediately** after the command is launched and does not wait for its execution to be completed. No process is left hanging (useful when running GUI apps for instance).
* in **standard mode**: exegol will **wait** for the end of the process to stop the container (and delete it if

.. tip::
    In standard execution mode, it is possible to ask exegol to display the command **output** (stdout/stderr) in the terminal by adding ``-v`` parameter.

.. _exec_options:

Options
-------

Since the exec action can also create containers, it shares the same parameters as the :ref:`start action<start_options>`.

There are also additional parameters, unique to the ``exec`` action:

=========================== =============
 Option                      Description
=========================== =============
 ``CONTAINER`` or ``IMAGE``  This option indicates the **container** name to use to execute the command. If the ``--tmp`` parameter is used, this name will be used to target an **image**.
 ``COMMAND``                 Single command to execute in the container.
 ``-b``, ``--background``    Executes the command in background as a daemon.
 ``--tmp``                   Creates a dedicated and temporary container to execute the command.
=========================== =============

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

    # Execute Wireshark in background, in a privileged temporary container:
    exegol exec --background --tmp --privileged "nightly" "wireshark"

    # Execute the command wireshark with network admin privileged:
    exegol exec -b --tmp --cap NET_ADMIN full wireshark

