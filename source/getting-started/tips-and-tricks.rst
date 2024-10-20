=============
Tips & tricks
=============

Below are some of the tips and tricks that are good to keep in mind when using Exegol.

.. contents::
    :local:

Change a container's time
~~~~~~~~~~~~~~~~~~~~~~~~~

Changing a container's time with ``date`` requires elevated permissions on the container, and messes up with the host's time.
There is however and alternative, using ``faketime`` (see `faketime ubuntu manpage <https://manpages.ubuntu.com/manpages/trusty/man1/faketime.1.html>`_) that allows to change the time of the container easily, without needing particular permissions, without affecting the host. This is especially useful when working with Kerberos targets that are out of sync.

Faketime manipulates the system time for a given child command. For example with ``zsh``, a new shell is opened with a spoofed time that will only be spoofed for this extact shell session and commands executed in it.

.. code-block:: bash

    faketime 'YYYY-MM-DD hh:mm:ss' zsh

.. note::

    Here is an example of how ``faketime`` can be used.

    When doing Active Directory attacks against Kerberos targets, a clock skew error could be raised such as ``KRB_AP_ERR_SKEW``. This means the authenticating machine (operator) and the destination (Key Distribution Center, a.k.a. KDC) are not in sync, clock-wise.

    Running any `Impacket <https://github.com/fortra/impacket>`_ with the ``-debug`` flag will print the server time. The operator can then use ``faketime`` to open a new ``zsh`` shell with the right time and timezone and conduct the scenario as previously intended.

    The following command can be used to print the time in UTC format and compare it with the server time: ``date --utc``.

    *Note: careful with the timezones. If they differ between the operator and the KDC, the delta needs to be taken into account*

Share files or notes with targets and collaborators
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following tools or commands can be used to pop a temporary file or http server: ``updog``, ``goshs``, ``http-server``, ``http-put-server``, ``ftp-server``, ``smbserver.py``.

In order to **shares notes** during an engagement, ``trilium`` (https://github.com/zadam/trilium) can be used.

Dynamic history commands
~~~~~~~~~~~~~~~~~~~~~~~~

Many commands in the pre-filled history rely on environment variables such as ``$DOMAIN``, ``$USER``, ``$PASSWORD``, etc.
Those variables can be set manually or by using the ``profile.sh`` file in ``/opt/tools/Exegol-history/``.
The proper lines can be filled and uncommented, and then the shell can be reloaded with ``exec zsh`` in order to apply the changes.
This allows users to easily look for, and use, commands in the history, without changing the values every time.

The best reverse shells
~~~~~~~~~~~~~~~~~~~~~~~

* ``shellerator`` can be used to generate a reverse shell command dynamically
* on the attacker's side, a reverse shell obtained through a ``netcat`` tunnel can be improved (see `ropnop.com <https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/>`_ or `0xffsec.com <https://0xffsec.com/handbook/shells/full-tty/>`_)
* simple alternative way to have an upgrade netcat reverse shell: use ``rlwrap <netcat listener command>``
* instead of using ``netcat`` and "upgrade" the shell manually, ``pwncat-cs`` (`calebstewart/pwncat <https://github.com/calebstewart/pwncat>`_) can be used to obtain an even better reverse shell experience (especially with UNIX-like targets).

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


Useful aliases
~~~~~~~~~~~~~~


.. tip::

    To see every alias in your exegol image, run the command:

    .. code-block::

        alias

.. tip::

    You can see the complete command configured for an alias with the command:

    .. code-block::

        alias <alias_name>

.. warning::

    Some aliases are not available before image ``3.1.5``.

Here's a list of useful aliases designed to save you time:

Network related
---------------

* ``ipa``: List network interfaces in short and colorful way
* ``ipr``: List network routes in short and colorful way
* ``pc``: Shortcut to ``proxychains``
* ``ncvz``: Shortcut to test an open TCP port

Shell
-----

* ``ws``: Shortcut to ``cd /workspace``
* ``_``: Shortcut to ``sudo``
* ``xcopy``: Copy a file to clipboard
* ``xpaste``: Create a file from clipboard
* ``xshow``: Print clipboard
* ``sed-empty-line``: Removes empty lines
* ``sed-comment-line``: Removes commented lines
* ``history-dump``: Export full history of commands with **date and time** of execution


Quick service
-------------

* ``http-put-server``: Python web server ``put`` capable
* ``http-server``: Shortcut to classic Python web server
* ``php-server``: Server a PHP webserver on current directory using port 8080


Tools optimization
------------------

* ``hcat``: Automatic hashcat format solver with fuzzy finder wordlist
* ``hjohn``: Automatic john the ripper format solver with fuzzy finder wordlist
* ``scan-range``: Nmap shortcut to find host in a specified network range
* ``nse``: Find nmap NSE script
* ``urlencode``: Encodes arguments in URL format
* ``urldecode``: Decodes arguments from URL format
