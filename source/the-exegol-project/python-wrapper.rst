Python Wrapper
===============

The Exegol project regroups many things (docker images, offline resources, custom configurations, aliases, history commands, multi-architecture support and many others). In order to make all the tech involved easy to use, and provide some unique entrypoint to the whole setup, a Python wrapper was created.

The Python wrapper handles all Docker and Git operations, can manage multiple images and containers at once and give the user the best experience possible, suited for beginners as well as advanced people.

The wrapper knows multiple actions.

* Install an image : ``exegol install``
* Create/start/enter a container : ``exegol start``
* Show info on containers and images : ``exegol info``
* Stop a container : ``exegol stop``
* Remove a container : ``exegol remove``
* Uninstall an image : ``exegol uninstall``
* Get help and advanced usage : ``exegol --help``
* Help and examples can be obtained for each action directly from the wrapper with the following command: ``exegol <action> -h`` (action: ``install``/``start``/``stop``/etc.).


All actions are documented in the **exegol-wrapper** part of this doc (e.g. :doc:`info </exegol-wrapper/info>`, :doc:`start </exegol-wrapper/start>`, :doc:`version </exegol-wrapper/version>`, ...)

Below is a, non-exhaustive, list of what the wrapper supports:

====================== =============
 Feature                Description
====================== =============
 Display sharing        todo
 OpenVPN connection     todo
 Workspace              todo
 Shell logging          todo
 Shared network         todo
 Shared timezones       todo
 Exegol-resources       todo
 My-resources           todo
 Volume sharing         todo
 Update-fs              todo
 Port sharing           todo
 Env. variables         todo
 Device sharing         todo
 Privileged             todo
 Multi-architecture     todo
 Local image building   todo
 Remote image pulling   todo
 Daemon execution       todo
 Temporary containers   todo
====================== =============


.. note::

   Exegol uses Docker images and containers. Understanding the difference is essential to understand Exegol.

   * **image**: think of it as an immutable template. They cannot be executed as-is and serve as input for containers. It's not possible to open a shell in an image.
   * **container**: a container rests upon an image. A container is created for a certain image at a certain time. It's possible to open a shell in a container. Careful though, once a container is created, updating the image it was created upon won't have any impact on the container. In order to enjoy the new things, a new container must be created upon that updated image.

