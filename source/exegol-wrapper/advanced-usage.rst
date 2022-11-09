===============
Advanced Usages
===============

.. _exegol_configuration:

Exegol configuration
====================

Introduction
------------

Exegol is prepared with many default settings. Most of them can be modified with a simple argument.
But in some cases it is more appropriate to determine a default behavior once and apply it by default.
For this purpose, a configuration file exists that allows users to persistently change the behavior and operations to be performed by default.

The user configurations currently in place can be viewed with the command: ``exegol info -v``. More information on the :doc:`info page </exegol-wrapper/info>`.

Exegol folder
-------------

An ``~/.exegol`` folder exists in the user's home folder to store resources, volumes and also the configuration file.

The **configuration of exegol** is done through a YAML file: ``~/.exegol/config.yml``.
This file is generated with the default configurations by the wrapper during the first execution.

Every exegol container has a **workspace volume** by default.
If the path of this volume is not specified by the user (:doc:`see start parameters </exegol-wrapper/start>`), a folder with the name of the container will be created in the :ref:`private_workspace_path <private_workspace_path>` folder.
By default workspaces are located in ``~/.exegol/workspaces/``.

This folder also hosts by default the **My-resources** :ref:`feature <My-resources-wrapper>`.

Available configurations
------------------------

Within the ``~/.exegol/config.yml`` file, several configurations are possible to customize your Exegol experience.

Volumes
~~~~~~~

The volume section allows you to change the default storage spaces.

.. warning::
    Volume path can be changed at any time but existing containers will not be affected by the update.

* my_resources_path: The my-resources volume is a storage space dedicated to the user to customize his environment and tools. This volume can be shared across all exegol containers. See :ref:`details <My-resources-wrapper>`.

* exegol_resources_path: Exegol resources are data and static tools downloaded in addition to docker images. These tools are complementary and are accessible directly from the host. See :doc:`details </exegol-resources/intro>`.

..  _private_workspace_path:

* private_workspace_path: When containers do not have an explicitly declared workspace, a dedicated folder will be created at this location to share the workspace with the host but also to save the data after deleting the container.


Config
~~~~~~

The config section allows you to modify the default behavior of the Exegol wrapper.

* auto_check_update: Enables automatic check for wrapper update. (Default: **True**)
* auto_remove_image: Automatically remove outdated image when they are no longer used. (Default: **True**)
* auto_update_workspace_fs: Automatically modifies the permissions of folders and sub-folders in your workspace by default to enable file sharing between the container with your host user. (Default: **False**)
* default_start_shell: Default shell command to start.  (Default: **zsh**)

..  _My-resources-wrapper:
My-resources
============

Description
-----------

My-resources is a main feature allowing Exegol users to have a persistent volume common to several Exegol containers.

This volume is accessible from the host at ``~/.exegol/my-resources/`` and from the containers (with the activated functionality) at ``/opt/my-resources``.

To facilitate its use, a read/write access system **shared** (between the host user and the container root user) has been implemented.

.. tip::
    To allow this right sharing, the my-resources folder (and all subfolders) must have the SetGID permission bit set.
    This is done automatically by the wrapper if the current user has sufficient rights.
    Otherwise, the wrapper will display a sudo command to be executed manually to update the relevant permissions.

Configuration
-------------

The host path of this volume can be changed from the configuration file ``~/.exegol/config.yml``.

.. warning::
    * Be careful **not** to use a folder with **existing data**, in which case their permissions will be automatically modified to enable access sharing.
    * This setting change will not be applied to existing exegol containers.

Usages
------

This volume allows you to install your own tools that are not available in Exegol but also to customize your configuration files. More information on the page :doc:`My-Resources </exegol-image/my-resources>`.

Local builds
============

If you don't want to download the docker pre-build images available on dockerhub, you can build your own exegol images locally.
The wrapper has a **local build feature** to create and manage your exegol images locally.

Everything starts with the command ``exegol install``, then you must use an image name that does **not** exist.
The wrapper will propose you to build a local image with this name.
If you choose to build an image locally, you will then have to choose a **build profile** among those available.

..
   _TODO: add ref to image profiles

.. tip::
    * You can add the ``-v`` parameter to have more details about the build process
    * You can also save detailed logs of the docker build process in a file with the ``--build-log`` parameter
