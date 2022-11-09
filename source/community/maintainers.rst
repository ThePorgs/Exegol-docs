===========
Maintainers
===========

This part of the documentation is meant for Exegol maintainers.

Exegol Release checklist
========================

Preparation
-----------

Git updates
~~~~~~~~~~~


..  tabs::

    ..  tab:: With git

        * Update current wrapper repo:

        .. code-block:: bash

            git pull

        * Update git submodules and checkout to **main** branch for release:

        .. code-block:: bash

            git -C exegol-docker-build pull
            git -C exegol-docker-build checkout main
            git -C exegol-resources pull
            git -C exegol-resources checkout main

    ..  tab:: With Exegol

        Update to the latest version of the **main** branches (checkout if needed, **except for the wrapper** which remains in branch dev)

        .. code-block:: bash

            exegol update -v

Configs
~~~~~~~

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

    python3 -m twine upload -repository testpypi dist/* --verbose

* Upload to the production repository

.. code-block:: bash

    python3 -m twine upload dist/*


Post-Deploy
-----------

* Create new github release with new version tag
* Fast-forward dev branch to the latest master commit
* Change the wrapper version on the dev branch to ``x.y.zb1``
