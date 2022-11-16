.. Exegol documentation master index file

Exegol: professional hacking setup
==================================

.. raw:: html

    <div align="center">
      <img alt="latest commit on master" width="600" src="https://raw.githubusercontent.com/ShutdownRepo/Exegol-docs/main/.assets/rounded_social_preview.png">
      <br><br>
      <a href="https://hub.docker.com/r/nwodtuhs/exegol" title=""><img src="https://img.shields.io/docker/cloud/automated/nwodtuhs/exegol"></a>
      <a href="docker build" title="https://hub.docker.com/r/nwodtuhs/exegol"><img src="https://img.shields.io/docker/cloud/build/nwodtuhs/exegol"></a>
      <img alt="max compressed image size" src="https://img.shields.io/docker/image-size/nwodtuhs/exegol/nightly?label=image%20(compressed)%20max%20size">
      <br>
      <a href="https://pypi.org/project/Exegol" title=""><img src="https://img.shields.io/pypi/v/Exegol?color=informational"></a>
      <a href="https://pepy.tech/project/exegol" title=""><img src="https://static.pepy.tech/personalized-badge/exegol?period=total&units=international_system&left_color=grey&right_color=brightgreen&left_text=Downloads"></a>
      <a href="https://pypi.org/project/Exegol" title=""><img src=""></a>
      <img alt="Python3.7" src="https://img.shields.io/badge/Python-3.7+-informational">
      <br><br>
      <img alt="latest commit on master" src="https://img.shields.io/github/last-commit/ShutdownRepo/Exegol/master?label=latest%20release">
      <img alt="latest commit on dev" src="https://img.shields.io/github/last-commit/ShutdownRepo/Exegol/dev?label=latest%20dev">
      <br>
      <img alt="current version" src="https://img.shields.io/badge/linux-supported-success">
      <img alt="current version" src="https://img.shields.io/badge/windows-supported-success">
      <img alt="current version" src="https://img.shields.io/badge/mac-supported-success">
      <br><br>
      <a href="https://twitter.com/intent/follow?screen_name=_nwodtuhs" title="Follow"><img src="https://img.shields.io/twitter/follow/_nwodtuhs?label=Shutdown&style=social"></a>
      <a href="https://twitter.com/intent/follow?screen_name=Dramelac_" title="Follow"><img src="https://img.shields.io/twitter/follow/Dramelac_?label=Dramelac&style=social">
      <br><br>
      <a href="https://discord.gg/BcgXnRpqxd" title="Join us on Discord"><img src="https://raw.githubusercontent.com/ShutdownRepo/Exegol-docs/main/.assets/discord_join_us.png" width="150">
      </a><br><br>
    </div>

Exegol is a community-driven hacking environment, powerful and yet simple enough to be used by anyone in day to day engagements. Exegol is the best solution to deploy powerful hacking environments securely, easily, professionally.

Exegol fits pentesters, CTF players, bug bounty hunters, researchers, beginners and advanced users, defenders, from stylish macOS users and corporate Windows pros to UNIX-like power users.

.. warning::

   This documentation is a work in progress. We are actively writing it, but if there are things you'd like to be documented in priority, feel free to request in on the `GitHub Repo <https://github.com/ShutdownRepo/Exegol-docs>`_ or in the `Discord server <https://discord.gg/BcgXnRpqxd>`_.

The Exegol project
------------------

Exegol is many things in one. Try it, and you'll stop using your old, unstable and risky environment, no more monolithic system that gets messier, buggier and more at risk with time.

* :doc:`Python wrapper </the-exegol-project/python-wrapper>`: makes everyone's life easier. This entrypoint to the whole Exegol project handles all docker and git operations so you don't have to. **Now's the time to have a clean environment** with one Docker container per engagement without the effort. Exegol handles multiple images and multiple containers. GUI apps, Wi-Fi, USB accessories, volume mounting and many more features are supported and easier to use than ever.
* :doc:`Docker images </the-exegol-project/docker-images>`: a set of pre-built docker images and dockerfiles that include a neat choice of tools, zsh plugins for power users, pre-filled history ready to use with environment variables, awesome resources, custom configs and many more. Images can either be built locally or pulled from the official Dockerhub registry.
* :doc:`Offline resources </the-exegol-project/offline-resources>`: Tired of always having to search github for your favorite privesc enumeration script? Exegol includes a set of resources, shared with all exegol containers and your host, including LinPEAS, WinPEAS, LinEnum, PrivescCheck, SysinternalsSuite, mimikatz, Rubeus, PowerSploit and many more.

Getting started
---------------

Wanna try Exegol and join our great community? You need to :ref:`install requirements <install_requirements>` first, then proceed to the OS-specific instructions: :ref:`Linux<exegol_install>` | :ref:`macOS<exegol_install>` | :ref:`Windows<exegol_install>`

Community
---------

Have a bug report or feature request? Either open an issue on the `Exegol repo`_ or open a ticket on the `Exegol discord`_ (preferred, easier, more flexible).

Wanna chat? Need help? Join us on the `Exegol discord`_!

.. _Exegol repo: https://github.com/ShutdownRepo/Exegol
.. _Exegol discord: https://discord.gg/BcgXnRpqxd

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Getting started

   getting-started/install.rst
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
   exegol-wrapper/advanced-uses.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Exegol image

   exegol-image/credentials.rst
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
   community/credits.rst