===========
Maintainers
===========

This part of the documentation is meant for Exegol maintainers.

.. contents::

Exegol Release checklist
========================

Preparation
-----------

1. Git updates
~~~~~~~~~~~~~~

The first step is to update the project and sub-modules, meaning pointing the exegol-images and exegol-resources sub-modules to the latest master version.
Even if the wrapper is able to auto-update itself, it is always better to keep the base reference at least up to date.

..  tabs::

    ..  tab:: With git

        * Update current wrapper repo:

        .. code-block:: bash

            git pull

        * Update git submodules and checkout to **main** branch for release:

        .. code-block:: bash

            git -C exegol-docker-build checkout main
            git -C exegol-docker-build pull
            git -C exegol-resources checkout main
            git -C exegol-resources pull

    ..  tab:: With Exegol

        Update to the latest version of the **main** branches (checkout if needed, **except for the wrapper** which remains in branch dev)

        .. code-block:: bash

            exegol update -v

2. Config reviews
~~~~~~~~~~~~~~~~~

* Review exegol.utils.ConstantConfig variables

    * Change version number ! (remove the alpha or beta tag at the end of the version number)
* Review documentation
* Review README.md

Tests & build
-------------

You can execute this one-liner to check the project and build it.

.. warning::
    **Require** `build <https://packaging.python.org/en/latest/tutorials/packaging-projects/#generating-distribution-archives>`__ package installed!

.. hint::
    Exegol can only be published through a **source** build distribution because of the source code files for building local images.

.. code-block:: bash

    python3 setup.py clean test && \
       (rm -rf Exegol.egg-info && python3 -m build --sdist) || \
       echo "Some tests failed, check your code and requirements before publishing!"


Post build
----------

* Upgrade tests.test_exegol.py version number to the next version build to avoid future mistake
* Commit updates
* Publish PR
* Wait for review and merge

Upload
------

After validation of the PR, we can upload the new version package to pypi.

.. warning::
    **Require** `twine <https://packaging.python.org/en/latest/tutorials/packaging-projects/#uploading-the-distribution-archives>`__ package installed and token configured on ``~/.pypirc``!

* Check package upload on the test repository (optional)

.. code-block:: bash

    python3 -m twine upload --repository testpypi dist/* --verbose

* Upload to the production repository

.. code-block:: bash

    python3 -m twine upload dist/*


Post-Deploy
-----------

* Create new github release with new version tag
* Fast-forward dev branch to the latest master commit
* Change the wrapper version on the dev branch to ``x.y.zb1``

CI/CD Pipeline
==============

The Exegol project relies on a continuous integration and continuous deployment (CI/CD) pipeline for multiple scenarios. At the time of writing, Tue 31 Jan 2023, the pipeline is structured as follows:

* the GitHub Actions platform is used on :doc:`the Exegol-images submodule </the-exegol-project/docker-images>`. Its workflows allow to build and push images on `the official Dockerhub registry <https://hub.docker.com/repository/docker/nwodtuhs/exegol>`_, run tests to make sure the tools are installed properly, run tests to help review pull requests, etc.
* no pipeline(s) yet on the Python wrapper, resources, docs, etc. But it's definitely in the roadmap.

GitHub Actions
--------------

The GitHub Actions pipeline(s) need runners to operate the various jobs configured for each workflow. The Exegol project relies on self-hosted runners instead of the GitHub-hosted runners for costing reasons.

At the time of writing, Tue 31 Jan 2023, the Exegol-images pipeline(s) require ARM64 and AMD64 runners in order to build, and run corresponding architectured images. In order to deploy a self-hosted runner, the procedure below can be followed.

1. Deploying a runner
~~~~~~~~~~~~~~~~~~~~~

The runner can either run on macOS, Linux, or Windows, as those three operating systems are supporting by the GHA (GitHub Action) platform. x64 and ARM64 are supported for macOS and Windows, and for Linux, ARM is supported as well.

Below are the hardware requirements for each runner:

* enough RAM *(to be defined)*
* enough CPU *(to be defined)*
* enough free disk space (at least ~30GB)

Before deploying a GHA agent on a runner, Docker must be installed. Note the following documentation focuses on deploying an agent on Linux systems.

.. tip::

    From Linux systems, Docker can be installed quickly and easily with the following command-line:

    .. code-block:: bash

        curl -fsSL "https://get.docker.com/" -o get-docker.sh
        sh get-docker.sh

.. warning::

    To run exegol from the user environment without ``sudo``, the user must have privileged rights equivalent to root.
    To grant yourself these rights, you can use the following command

    .. code-block:: bash

        # add the sudo group to the user
        sudo usermod -aG docker $(id -u -n)

        # "reload" the user groups
        newgrp

Once the runner is ready, the agent can be deployed as follows (with sufficient permissions in the GitHub repository):

* go to https://github.com/ThePorgs/Exegol-images/settings/actions/runners
* click on "New self-hosted runner"
* select the right OS and architecture and follow the instructions
* when running the ``config.sh`` script, the following settings must be set

    * name of the runner group: Default
    * name of the runner: *up to you*
    * additional labels: ``builder,tester`` (adapt this if the runner is to be used for only one of those actions). If the runner is an X64/AMD64, the ``AMD64`` tag needs to be set as well. If the runner is ARM64, the right tag will be set automatically.
    * name of work folder: *up to you*

* start the runner with the ``run.sh`` script
* (option) configure the agent as a service if it is to be run unattended/headless with ``sudo ./svc.sh install <user>``, more info at https://docs.github.com/en/actions/hosting-your-own-runners/configuring-the-self-hosted-runner-application-as-a-service


.. note::

    When configuring the agent as a service, it will be enabled, meaning it will start at boot. The ``systemctl is-enabled`` command should return ``enabled``.

    .. code-block:: bash

        sudo systemctl is-enabled actions.runner.ThePorgs-Exegol-images.<runner-name>.service

    In order to start the service, either reboot the runner, or use ``systemctl``.

    .. code-block:: bash

        sudo systemctl start actions.runner.ThePorgs-Exegol-images.<runner-name>.service

.. image:: /assets/maintainers/gha_deployment/step_1.png
   :align: center
   :alt: Created a new runner

.. image:: /assets/maintainers/gha_deployment/step_2.png
   :align: center
   :alt: Configuring the runner (GitHub)

.. image:: /assets/maintainers/gha_deployment/step_3.png
   :align: center
   :alt: Configuring the runner (Local)



.. note::

    Screenshots annotated with https://annotely.com/

2. Checking runners status
~~~~~~~~~~~~~~~~~~~~~~~~~~

Go to https://github.com/ThePorgs/Exegol-images/settings/actions/runners