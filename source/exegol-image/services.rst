Services list
=============

This section lists the services that can be used in Exegol containers and their associated default ports.

.. note::

    Note that, as of 25/10/2023, a utility is being developped in order to randomize those ports so that multiple containers being used concurrently don't have their services step on one another if they share a network interface. This utility will be mostly transparent, and will modify the services configuration files dynamically.

.. table::
    :widths: 15 5 40 50
    :class: tight-table

    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Service              | Port   | Commands                     | Comments                                                                                      |
    +======================+========+==============================+===============================================================================================+
    | neo4j                |        | ``neo4j start``,             | Used by BloodHound, and BloodHound-related projects.                                          |
    |                      |        | ``neo4j stop``,              |                                                                                               |
    | * bolt               | 7687   | ``neo4j restart``            |                                                                                               |
    |                      |        |                              |                                                                                               |
    | * http               | 7474   |                              |                                                                                               |
    |                      |        |                              |                                                                                               |
    | * https              | 7373   |                              |                                                                                               |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | BloodHound-CE        | 1030   | ``bloodhound-ce``            | BloodHound Community Edition Web Interface                                                    |
    |                      |        | ``bloodhound-ce-reset``      |                                                                                               |
    |                      |        | ``bloodhound-ce-stop``       |                                                                                               |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | postgresql           | 5432   | ``service postgresql [...]`` | Used by BloodHound CE                                                                         |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Trilium              | 1991   | ``trilium-start``,           | Collaborative note taking app. https://github.com/zadam/trilium                               |
    |                      |        | ``trilium-stop``             |                                                                                               |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Burp Suite           | 8080   | ``burpsuite``                | HTTP(S) Proxy                                                                                 |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Starkiller (Empire)  | TBD    | ``ps-empire server``         | GUI for the Empire post-exploit framework (https://github.com/BC-SECURITY/Empire)             |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Havoc                | 40056  | ``havoc client/server``      | C2 Framework in GO (https://github.com/HavocFramework/Havoc)                                  |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
    | Desktop              |        | ``desktop-start``,           | Remote graphical desktop feature (beta). Used with the ``--desktop`` from up-to-date wrapper. |
    |                      |        | ``desktop-stop``,            |                                                                                               |
    | * vnc                | 6336   | ``desktop-restart``          |                                                                                               |
    |                      |        |                              |                                                                                               |
    | * websockify         | random |                              |                                                                                               |
    +----------------------+--------+------------------------------+-----------------------------------------------------------------------------------------------+
