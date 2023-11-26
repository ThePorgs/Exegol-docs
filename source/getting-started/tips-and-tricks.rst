===============
Tips and tricks
===============

Below are some of the tips and tricks that are good to keep in mind when using Exegol.

.. contents::
    :local:

Change a container's time
~~~~~~~~~~~~~~~~~~~~~~~~~

Changing a container's time with ``date`` requires elevated permissions on the container, and messes up with the host's time.
There is however and alternative, using ``faketime`` (see `faketime ubuntu manpage <https://manpages.ubuntu.com/manpages/trusty/man1/faketime.1.html>`_) that allows to change the time of the container easily, without needing particular permissions, without affecting the host. This is especially useful when working with Kerberos targets that are out of sync.

Faketime manipulates the system time for a given child command (e.g. ``zsh``).

.. code-block:: bash

    faketime 'YYYY-MM-DD hh:mm:ss' zsh

Share files or notes with targets and collaborators
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following tools or commands can be used to pop a temporary file or http server: ``updog``, ``goshs``, ``http-server``, ``http-put-server``, ``ftp-server``, ``smbserver.py``.
In order to shares notes during an engagement, ``trilium`` (https://github.com/zadam/trilium) can be used.

Dynamic history commands
~~~~~~~~~~~~~~~~~~~~~~~~

Many commands in the pre-filled history rely on environment variables such as ``$DOMAIN``, ``$USER``, ``$PASSWORD``, etc.
Those variables can be set manually or by using the ``profile.sh`` file in ``/opt/tools/Exegol-history/``.
The proper lines can be filled and uncommented, and then the shell can be reloaded with ``exec zsh`` in order to apply the changes.
This allows users to easily look for, and use, commands in the history, without changing the values every time.

Keyboard shortcuts
~~~~~~~~~~~~~~~~~~

* ``ctrl+q``: when writing a command, let's say a user misses an information (e.g. IP address). The shortcut can be used to save the half-typed command, look for the value, and then finish the command. The user doesn't have to cancel the command, look for the info, and write the command all over again. This is known as the ``push-line`` feature (see `sgeb.io <https://sgeb.io/posts/bash-zsh-half-typed-commands/>`_).
* ``ctrl + r``: look for something in the history
* ``ctrl + t``: look for a file or directory with a fuzzy finder
* ``ctrl + a``: move to the beginning of the line
* ``ctrl + e``: move to the end of the line
* ``ctrl + ←``: move one word backward
* ``ctrl + →``: move one word forward
* ``ctrl + l``: clear the screen


