==========================
Frequently asked questions
==========================

Below are the frequently asked questions regarding either features, the overall project or troubleshooting matters.

.. contents::
    :local:

..
  Frequently asked questions should be questions that actually got asked.
  Formulate them as a question and an answer.
  Consider that the answer is best as a reference to another place in the documentation. (format of this FAQ taken from `RTD's own FAQ <https://docs.readthedocs.io/en/stable/faq.html>`_)

What tools are installed in Exegol?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The list of tools is dynamically generated for all Exegol images and available :doc:`here </exegol-image/tools>`.

Unable to connect to Docker
~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are multiple checks to do to make sure Docker works properly.

.. tabs::

    .. tab:: Docker service

        The Docker service must installed up and running.

        - For Windows users: Docker Desktop for Windows must be up and running.
        - For macOS users: Docker Desktop for Mac (or `OrbStack <https://orbstack.dev/>`_) must be up and running.

    .. tab:: Docker permissions

        Make sure the Docker permissions are consistent with the Exegol permissions. For instance, if you need ``sudo`` rights to use Docker, you'll most likely need ``sudo`` to run Exegol smoothly. See :doc:`the Exegol install guidance</getting-started/install>`.

    .. tab:: Docker socket

        The following command can be used to see the docker socket that is used by default: ``docker context ls``.

        * For `OrbStack <https://orbstack.dev/>`_ users (on macOS), the "orb socket" must be used.
        * For Docker Desktop users (macOS/Windows), the "Docker desktop socket" must be used.
        * For Linux users, the default socket should work.

        Switching context can be done with ``docker context use <context>``.
        For instance, switching from a Docker Desktop to OrbStack could be done with ``docker context use orbstack``.

    .. tab:: Symbolic link

        The following symbolic link must exist ``/var/run/docker.sock`` and point to the correct socket. Below is an example of what it should look like.

        .. code-block::

            (Host) ~ $ ls -la /var/run/docker.sock
            lrwxr-xr-x  1 root  daemon  38 Jul 28 09:02 /var/run/docker.sock -> /Users/someuser/.orbstack/run/docker.sock

        If the link does not exist, it could be created with the following command ``ln -sf /Users/someuser/.orbstack/run/docker.sock /var/run/docker.sock``. This is an example for `OrbStack <https://orbstack.dev/>`_. The command must be adapted to the user's context.

Can I contribute to the project?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes, please refer to the :doc:`contributors section </community/contributors>`.

Can I run Exegol on a macOS?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes. And both CPU architectures are supported (Intel X86_64 (AMD64) and Apple Silicon M1/M2 (ARM64).

.. tip::

    We strongly advised macOS users to replace Docker Desktop with `OrbStack <https://orbstack.dev/>`_, allowing host network mode to work for instance, this it's not supported by Docker Desktop for Mac.


Can I use a VPN with Exegol?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes. And you have multiple choices.

* **The "YOLO" choice**: at the container creation (i.e. when "starting" a container for the first time), give all permissions to the container so that you're able to run openvpn in it and start the vpn. The command should look like ``exegol start <container_name> <image_name> --privileged``.
* **The better choice**: use the ``--vpn`` option at the container creation: ``exegol start <container_name> <image_name> --vpn <myconf.ovpn>``. It's the easiest and more secure choice. See the ``start`` help :doc:`here </exegol-wrapper/start>`).

.. warning::

    Creating a **privileged** container (c.f. the "YOLO" choice) exposes you to higher security risks. This should be avoided.

Can I customize Exegol?
~~~~~~~~~~~~~~~~~~~~~~~

Yes, please refer to the :doc:`"my-resources" documentation </exegol-image/my-resources>` that explains how to automatically setup your changes to your Exegol containers.
Also, see the :doc:`"wrapper's advanced-uses" documentation </exegol-wrapper/advanced-uses>` to see how to edit Exegol's conf among other things.
You could also want to :ref:`make your own Exegol image <custom_image>`

.. _custom_image:

Can I make my own Exegol image?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes. You will need to create a dockerfile (e.g. ``CUSTOM.dockerfile``) at the root of the exegol-images module next to the other dockerfiles (i.e. ``/path/to/Exegol/exegol-docker-build/``) containing the instructions you want the build process to follow.

Then, run something like ``exegol install "myimagename" "CUSTOM"`` to build the image locally. See the ``install`` documentation: :doc:`install action </exegol-wrapper/install>`.

How to install Exegol on an external drive?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Exegol's wrapper is lightweight, but it's Docker images can take up some space, and users may not have enough room in their internal HDD/SSD, hence the question. This usually comes down to "how can I install Docker on an external drive?", and the answer depends on the host.

.. tip::

    Use a fast drive, otherwise Exegol will get real slow.

For macOS and Windows users, this can be configured in the Docker Desktop dashboard (in ``Settings > Resources > Advanced > Disk image location``).

.. image:: /assets/faq/docker_desktop_disk_image_location.png
    :align: center
    :alt: Disk Image Location Setting (Docker Desktop)

How to add a new tool?
~~~~~~~~~~~~~~~~~~~~~~

"Adding a tool" can mean many things. Depending on that, you'll get a different answer. So let's answer most of them.

If you want to add a tool:

* **in the official Exegol images**: refer to the :ref:`contribution guidance <adding_a_tool>`.
* **in your own custom local image**: refer to the :ref:`contribution guidance <adding_a_tool>` as well, but instead of creating a Pull Request at the end to offer your contribution, just build the image locally with the wrapper and enjoy your custom local image.
* **in a live container**: that's your container, you can do whatever you whish in it ;)
* **automatically in all containers at their creation**: refer to the :doc:`"my-resources" documentation </exegol-image/my-resources>`.

How do I get X11 to work on a non-Linux host?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

X11, or X Window System, is a graphical windowing system that provides a framework for creating and managing graphical user interfaces (GUIs) in Unix-like operating systems.

X11 sharing between an Exegol container and a host allows a graphical application running within the container to display its GUI on the host's X11 server. This means you can run graphical applications in Exegol containers and have them appear as if they were running directly on the host machine. It enables the execution of GUI-based applications in isolated containers while interacting with them through the host's graphical interface.

For macOS users, XQuartz is needed. It's listed in the :ref:`install requirements <install_requirements>`.

.. note::

    Exegol's wrapper automatically starts XQuartz on macOS hosts when needed. But if for some reason it gets manually closed by the users while a container is running, X11 sharing will not work. Restarting the container with ``exegol restart <container>`` will restart XQuartz automatically if needed.

Can I install docker directly on my WSL2 distro instead of Docker Desktop ?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes, it's possible to install docker directly on WSL2 rather than using Docker Desktop, but you'll be restricted to your WSL2 environment and its constraints.

Although Docker Desktop is incomplete, it does offer a few advantages (exegol can be used from powershell / cmd, windows folder sharing with the exegol workstation, etc).
We therefore recommend **Docker Desktop as the official support** for Exegol.

We do **not** guarantee wrapper stability with a directly installed WSL docker.

.. TODO: add a note, when the Desktop feature is in prod, that explains the ups and dows of X11 vs. Desktop mode.