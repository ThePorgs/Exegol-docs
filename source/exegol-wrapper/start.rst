:code:`start` action
====================

This action can be used to start a container. At least one Exegol image is required to create and start a container and enjoy Exegol. Installing an image can be done with ``exegol install`` (documentation
:doc:`here </exegol-wrapper/install>`).

When this action is used, the following process is applied:

* if no Exegol image is installed, the user is asked to specify which one to install of build, and the process continues
* then, if the container to start doesn't already exist, it is created based on an Exegol image and a few settings to specify, and the process continues
* then, the container is started and a shell is opened

Interactive TUI
---------------

The ``start`` action can be used without any additional argument or option. the wrapper will then enter in an interactive TUI (Text-based User Interface) mode where the user will be asked to choose a few settings.

.. code-block:: bash

   exegol start

Options
-------

=================== =============
 Option              Description
=================== =============
 todo                todo
=================== =============


Command examples
----------------

.. code-block:: bash

   # Start interactively a container
   exegol start

   # Create a demo container using full image
   exegol start demo full

   # Spawn a shell from demo container
   exegol start demo

   # Create a container test with a custom shared workspace
   exegol start test full -w "./project/pentest/"

   # Create a container test sharing the current working directory
   exegol start test full -cwd

   # Create a container htb with a VPN
   exegol start htb full --vpn "~/vpn/lab_Dramelac.ovpn"

   # Create a container app with custom volume
   exegol start app full -V "/var/app/:/app/"

   # Get a tmux shell
   exegol start --shell tmux

   # Use a Proxmark
   exegol start -d "/dev/ttyACM0"

   # Use an HackRF One
   exegol start -d "/dev/bus/usb/"

