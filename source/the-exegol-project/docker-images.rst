Docker images
=============

The Docker images are the heart of the Exegol project. A neat choice of tools, configurations, aliases, history commands, and various customizations are prepared in multiple images adapted for multiple uses: web hacking, Active Directory, OSINT (Open Source INTelligence), etc.

All images are available on `the official Dockerhub registry <https://hub.docker.com/repository/docker/nwodtuhs/exegol>`_. This allows to offer pre-built, compressed images, so that users don't have to build their own image, but users that choose to do so can. Pulling pre-built images, or building one, can be done with ``exegol install`` (documentation
:doc:`here </exegol-wrapper/install>`).

============= =====================================================================================================
  Image name   Description
============= =====================================================================================================
  full         Includes all the tools supported by Exegol (warning: this is the heaviest image)
  ad           Includes tools for Active Directory / internal pentesting only.
  web          Includes tools for Web pentesting only.
  light        Includes the lightest and most used tools for various purposes.
  osint        Includes tools for OSINT.
  nightly      **(for developers and advanced users)** contains the latest updates. This image can be unstable!
============= =====================================================================================================

.. hint::

   Exegol uses Docker images and containers. Understanding the difference is essential to understand Exegol.

   * **image**: think of it as an immutable template. They cannot be executed as-is and serve as input for containers. It's not possible to open a shell in an image.
   * **container**: a container rests upon an image. A container is created for a certain image at a certain time. It's possible to open a shell in a container. Careful though, once a container is created, updating the image it was created upon won't have any impact on the container. In order to enjoy the new things, a new container must be created upon that updated image.
