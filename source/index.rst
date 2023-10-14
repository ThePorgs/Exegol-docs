.. Exegol documentation master index file

Exegol: professional hacking setup
==================================

.. raw:: html

    <div align="center">
      <img alt="exegol logo" width="600" src="https://raw.githubusercontent.com/ThePorgs/Exegol-docs/main/.assets/rounded_social_preview.png">
      <br><br>
      <a target="_blank" rel="noopener noreferrer" href="https://pypi.org/project/Exegol" title=""><img src="https://img.shields.io/pypi/v/Exegol?color=informational" alt="pip package version"></a>
      <img alt="Python3.7" src="https://img.shields.io/badge/Python-3.7+-informational">
      <img alt="latest commit on master" src="https://img.shields.io/docker/pulls/nwodtuhs/exegol.svg?label=downloads">
      <br><br>
      <img alt="latest commit on master" src="https://img.shields.io/github/last-commit/ThePorgs/Exegol/master?label=latest%20release">
      <img alt="latest commit on dev" src="https://img.shields.io/github/last-commit/ThePorgs/Exegol/dev?label=latest%20dev">
      <br><br>
      <img alt="current version" src="https://img.shields.io/badge/linux-supported-success">
      <img alt="current version" src="https://img.shields.io/badge/windows-supported-success">
      <img alt="current version" src="https://img.shields.io/badge/mac-supported-success">
      <br>
      <img alt="amd64" src="https://img.shields.io/badge/amd64%20(x86__64)-supported-success">
      <img alt="arm64" src="https://img.shields.io/badge/arm64%20(aarch64)-supported-success">
      <br><br>
      <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/intent/follow?screen_name=_nwodtuhs" title="Follow"><img src="https://img.shields.io/twitter/follow/_nwodtuhs?label=Shutdown&style=social" alt="Twitter Shutdown"></a>
      <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/intent/follow?screen_name=Dramelac_" title="Follow"><img src="https://img.shields.io/twitter/follow/Dramelac_?label=Dramelac&style=social" alt="Twitter Dramelac"></a>
      <br>
      <a target="_blank" rel="noopener noreferrer" href="https://www.blackhat.com/eu-22/arsenal/schedule/index.html#exegol-29180" title="Schedule">
       <img alt="Black Hat Europe 2022" src="https://img.shields.io/badge/Black%20Hat%20Arsenal-Europe%202022-blueviolet">
      </a>
      <a target="_blank" rel="noopener noreferrer" href="https://www.blackhat.com/asia-23/arsenal/schedule/#exegol-professional-hacking-setup-30815" title="Schedule">
       <img alt="Black Hat Asia 2023" src="https://img.shields.io/badge/Black%20Hat%20Arsenal-Asia%202023-blueviolet">
      </a>
      <a target="_blank" rel="noopener noreferrer" href="https://www.blackhat.com/us-23/arsenal/schedule/#exegol-professional-hacking-setup-31711" title="Schedule">
       <img alt="Black Hat USA 2023" src="https://img.shields.io/badge/Black%20Hat%20Arsenal-USA%202023-blueviolet">
      </a>
      <br><br>
      <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/cXThyp7D6P" title="Join us on Discord"><img src="https://raw.githubusercontent.com/ThePorgs/Exegol-docs/main/.assets/discord_join_us.png" width="150" alt="Join us on Discord"></a>
      <br><br>
    </div>

Exegol is a community-driven hacking environment, powerful and yet simple enough to be used by anyone in day to day engagements. Exegol is the best solution to deploy powerful hacking environments securely, easily, professionally. No more unstable, not-so-security-focused systems lacking major offensive tools. Kali Linux (and similar alternatives) are great toolboxes for learners, students and junior pentesters. But professionals have different needs, and their context require a whole new design.

.. image:: /assets/flawed_designs.png
   :align: center
   :alt: No more kali, parrot, blackarch

Exegol fits pentesters, CTF players, bug bounty hunters, researchers, beginners and advanced users, defenders, from stylish macOS users and corporate Windows pros to UNIX-like power users.

.. warning::

   This documentation is a work in progress. We are actively writing it, but if there are things you'd like to be documented in priority, feel free to request in on the `GitHub Repo <https://github.com/ThePorgs/Exegol-docs>`_ or in the `Discord server <https://discord.gg/cXThyp7D6P>`_.

The Exegol project
------------------

.. image:: /assets/overviews_techs.png
   :align: center
   :alt: Structure overview


Exegol is many things in one. Try it, and you'll stop using your old, unstable and risky environment, no more monolithic system that gets messier, buggier and more at risk with time.

* :doc:`Python wrapper </the-exegol-project/python-wrapper>`: makes everyone's life easier. This entrypoint to the whole Exegol project handles all docker and git operations so you don't have to. **Now's the time to have a clean environment** with one Docker container per engagement without the effort. Exegol handles multiple images and multiple containers. GUI apps, Wi-Fi, USB accessories, volume mounting and many more features are supported and easier to use than ever.
* :doc:`Docker images </the-exegol-project/docker-images>`: a set of pre-built docker images and dockerfiles that include a neat choice of tools, zsh plugins for power users, pre-filled history ready to use with environment variables, awesome resources, custom configs and many more. Images can either be built locally or pulled from the official Dockerhub registry.
* :doc:`Offline resources </the-exegol-project/offline-resources>`: Tired of always having to search github for your favorite privesc enumeration script? Exegol includes a set of resources, shared with all exegol containers and your host, including LinPEAS, WinPEAS, LinEnum, PrivescCheck, SysinternalsSuite, mimikatz, Rubeus, PowerSploit and many more.


.. image:: /assets/overviews_structure.png
   :align: center
   :alt: Structure overview



Getting started
---------------

Wanna try Exegol and join our great community? You need to :ref:`install requirements <install_requirements>` first, then proceed to the OS-specific instructions: :ref:`Linux<exegol_install>` | :ref:`macOS<exegol_install>` | :ref:`Windows<exegol_install>`

Community
---------

Have a bug report or feature request? Either open an issue on the `Exegol repo`_ or open a ticket on the `Exegol discord`_ (preferred, easier, more flexible).

Wanna chat? Need help? Join us on the `Exegol discord`_!

.. _Exegol repo: https://github.com/ThePorgs/Exegol
.. _Exegol discord: https://discord.gg/cXThyp7D6P

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Getting started

   getting-started/install.rst
   getting-started/updates.rst
   getting-started/faq.rst

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
   exegol-wrapper/restart.rst
   exegol-wrapper/remove.rst
   exegol-wrapper/uninstall.rst
   exegol-wrapper/version.rst
   exegol-wrapper/advanced-uses.rst

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Exegol image

   exegol-image/tools.rst
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
