.. Exegol documentation master index file

Exegol: professional hacking setup
==================================

.. meta::
   :description lang=en: Professional hacking setup

.. image:: /assets/rounded_social_preview_with_border.png
   :align: center
   :scale: 50
   :alt: Exegol logo

Exegol is a community-driven hacking environment, powerful and yet simple enough to be used by anyone in day to day engagements. Exegol is the best solution to deploy powerful hacking environments securely, easily, professionally.

Exegol fits pentesters, CTF players, bug bounty hunters, researchers, beginners and advanced users, defenders, from stylish macOS users and corporate Windows pros to UNIX-like power users.

The Exegol project
------------------

Exegol is many things in one. Try it, and you'll stop using your old, unstable and risky environment, no more monolithic system that gets messier, buggier and more at risk with time.

* :doc:`Python wrapper </the-exegol-project/python-wrapper>`: makes everyone's life easier. This entrypoint to the whole Exegol project handles all docker and git operations so you don't have to. **Now's the time to have a clean environment** with one Docker container per engagement without the effort. Exegol handles multiple images and multiple containers. GUI apps, Wi-Fi, USB accessories, volume mounting and many more features are supported and easier to use than ever.
* :doc:`Docker images </the-exegol-project/docker-images>`: a set of pre-built docker images and dockerfiles that include a neat choice of tools, zsh plugins for power users, pre-filled history ready to use with environment variables, awesome resources, custom configs and many more. Images can either be built locally or pulled from the official Dockerhub registry.
* :doc:`Offline resources </the-exegol-project/offline-resources>`: Tired of always having to search github for your favorite privesc enumeration script? Exegol includes a set of resources, shared with all exegol containers and your host, including LinPEAS, WinPEAS, LinEnum, PrivescCheck, SysinternalsSuite, mimikatz, Rubeus, PowerSploit and many more.

Getting started
---------------

Wanna try Exegol and join our great community? You need to `install requirements`_ first, then proceed to the OS-specific instructions: `Linux`_ | `macOS`_ | `Windows`_

.. _Linux: getting-started/installation.html#linux-macos
.. _macOS: getting-started/installation.html#linux-macos
.. _Windows: getting-started/installation.html#windows
.. _install requirements: getting-started/installation.html#Requirements

Community
---------

Have a bug report or feature request? Either open an issue on the `Exegol repo`_ or open a ticket on the `Exegol discord`_ (preferred, easier, more flexible).

Wanna chat? Need help? Join us the `Exegol discord`_!

.. _Exegol repo: https://github.com/ShutdownRepo/Exegol
.. _Exegol discord: https://discord.gg/BcgXnRpqxd

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Getting started

   getting-started/installation.rst
   getting-started/updates.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: The Exegol Project

   the-exegol-project/python-wrapper.rst
   the-exegol-project/docker-images.rst
   the-exegol-project/offline-resources.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Exegol wrapper

   exegol-wrapper/install.rst
   exegol-wrapper/start.rst
   exegol-wrapper/info.rst
   exegol-wrapper/exec.rst
   exegol-wrapper/update.rst
   exegol-wrapper/stop.rst
   exegol-wrapper/remove.rst
   exegol-wrapper/uninstall.rst
   exegol-wrapper/version.rst
   exegol-wrapper/advanced-usage.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Exegol image

   exegol-image/intro.rst
   exegol-image/my-resources.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Exegol resources

   exegol-resources/intro.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Community

   community/users.rst
   community/contributors.rst
   community/maintainers.rst
   community/sponsors.rst