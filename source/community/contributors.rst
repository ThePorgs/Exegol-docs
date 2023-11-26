============
Contributors
============

This part of the documentation is meant for Exegol contributors, those who write code and open pull requests. If adds up to the :doc:`users </community/users>` documentation.

First things first, once you know on what module you want to contribute (`wrapper <https://github.com/ThePorgs/Exegol>`_, `images <https://github.com/ThePorgs/Exegol-images>`_, `documentation <https://github.com/ThePorgs/Exegol-docs>`_, `resources <https://github.com/ThePorgs/Exegol-resources>`_, etc.) `fork it <https://docs.github.com/en/get-started/quickstart/fork-a-repo>`_, `checkout <https://git-scm.com/docs/git-checkout>`_ to the ``dev`` branch, then come back to this page to start coding.

.. contents::
    :local:

Documentation
==============

A new feature, whether it's on the wrapper, images, or any other module, must be documented accordingly. Make sure to open a pull request to the appropriate `Exegol docs <https://github.com/ThePorgs/Exegol-docs>`_ branch on top of your wrapper/images/whatever pull request.

..  list-table:: Exegol-docs branches
    :header-rows: 1

    * - Branch
      - Purpose
    * - main
      - nothing gets pushed there. This branch is made to merge with the other branches.
    * - dev-wrapper
      - Related to the wrapper (`Exegol <https://github.com/ThePorgs/Exegol>`_ )
    * - dev-images
      - Related to the images (`Exegol-images <https://github.com/ThePorgs/Exegol-images>`_ )
    * - dev
      - General purpose

Before pushing a pull request on the documentation repository, it is advised to try and compile locally to make sure there are no errors and everything renders as expected. First, the requirements listed in ``requirements.txt`` must be installed (e.g. ``pip install --user -r ./requirements.txt``). Then, the one-liner below can be used to remove any previous build, compile again and open the build in a browser.

.. code-block:: bash

    rm -r build; make html; open "build/html/community/contributors.html"

**Nota bene**: in the example above, the ``open`` command opens an Internet browser (it's a macOS command), but it can be replaced by anything else that fits the contributor's environement (e.g. ``firefox``).

Images
======

The Docker images are the heart of the Exegol project. A neat choice of tools, configurations, aliases, history commands, and various customizations are prepared in multiple images adapted for multiple uses: web hacking, Active Directory, OSINT (Open Source INTelligence), etc.

If you want to contribute to this part of the project, there are some things you need to know and some rules you need to follow.

.. _adding_a_tool:

Adding a new tool
~~~~~~~~~~~~~~~~~

In order to add a new tool to an image, here is how it goes. First, you need to figure out in what package your tool installation function must go to: `packages <https://github.com/ThePorgs/Exegol-images/tree/main/sources/install>`_.

Function structure
------------------

When preparing the install function to the package, don't forget to include the following functions:

* ``colorecho "Installing yourtool"``: this is needed to raise logs inside the CI/CD pipeline

* ``catch_and_retry <some command>``: this one is optional. When a command uses the Internet and could potentially fail randomly, the ``catch_and_retry`` wrapper is here to retry that commands multiple times with increasing time intervals in order to avoid having a whole build fail because of one temporary network error. Nota bene: most standard Internet-involved commands are transparently put behind a ``catch_and_retry`` (e.g. ``git``, ``wget``, ``curl``, ``go``, etc.).

* ``add-aliases yourtool``: if your tool needs to have one or multiple aliases to work properly. You will need to create the aliases file in `/sources/assets/zsh/aliases.d/ <https://github.com/ThePorgs/Exegol-images/tree/main/sources/assets/zsh/aliases.d>`_ named after your tool. This file must contain the alias(es) to set as follows.

    .. code-block:: bash

        alias tool.py='python3 /opt/tools/yourtool/tool.py'

* ``add-history yourtool``: if it's relevant to give some command example of your tool. No need to populate the history with a command that's very short or never used. Using long arguments is preferred. Using environment variables is preferred (e.g. ``$USER``, ``$PASSWORD``, ``$TARGET``, etc.). You will need to create the history file in `/sources/assets/zsh/history.d/ <https://github.com/ThePorgs/Exegol-images/tree/main/sources/assets/zsh/history.d>`_ named after your tool. This file must contain the history command(s) like the example below.

    .. code-block:: bash

        yourtool.py --user "$USER" --password "$PASSWORD" --target "$TARGET"
        yourtool.py --mode enum --user "$USER" --target "$TARGET"
        yourtool.py --mode unauthenticated

* ``add-test-command "testcommand"``: this is needed by the CI/CD pipeline to conduct unit tests for all tools to make sure they are installed properly before publishing new images. The test command needs to return ``0`` if the tool works properly, anything else if it doesn't. For instance, something like ``yourtool.py --help`` usually works, but not always! In order to find what command can be used for unit tests, you can do something like ``yourtool.py --help; echo $?`` to see what code is returned after the command is executed. Once trick that can be used when the ``--help`` command returns something ``!=0`` is to do some grep like ``yourtool.py --help|& grep 'Usage:'``.

* ``add-to-list "yourtool,https://link.to/the/tool,description"``: this is used by the CI/CD pipeline to automatically export tools in the :doc:`Tools list </exegol-image/tools>`. The format of the entry is standard 3-columns CSV (comma separated values). The first column is the tool name, then the link to the tool, then the description. Be careful to not have more than 2 commas and replace any comma in the description by something else.

In case your tool doesn't need aliases or history commands, add the following comment at the beggining of the tool install function: ``# CODE-CHECK-WHITELIST=``. Then add a comma-separated list of the exclusions. Below are some examples.

.. code-block:: bash

    # CODE-CHECK-WHITELIST=add-aliases
    # CODE-CHECK-WHITELIST=add-aliases,add-history

**TL;DR**, your tool installation function should look something like this:

.. code-block:: bash

    function install_yourtool() {
        colorecho "Installing yourtool"
        # tool install commands [...]
        add-aliases yourtool
        add-history yourtool
        add-test-command "yourtool.py --help"
        add-to-list "yourtool,https://link.to/the/tool,description"
    }

Install standards
-----------------

When installing a tool, depending on how it gets installed, here are the rules.

* Most tools have their virtual environment, in order to avoid dependencies conflicts.
* Most tools are installed either in their own directory in ``/opt/tools/`` or have the binary (or a symlink) in ``/opt/tools/bin/``.
* Disk space being limited, we're not pull every code source around. When possible, add the ``--depth 1`` option to your usual ``git clone`` command.

..  tabs::

    ..  tab:: Python sources (pipx)

        The easiest way to install a Python tool is to use pipx.

        .. code-block:: bash

            # from github.com example
            python3 -m pipx install git+https://github.com/AUTHOR/REPO

            # from local sources
            git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
            python3 -m pipx install /opt/tools/yourtool/

        But some tools cannot be installed this way, either because they're missing the ``setup.py`` or for any other obscure reason. In that case, opt for the "Python (venv)" solution.

    ..  tab:: Python sources (venv)

        In this example, the tool sources are downloaded, a virtual python environment is set up, requirements are installed, and an alias is created.

        **Nota bene 1**: when the requirements are installed, it's better to have the command put behind a ``catch_and_retry`` so that if their is a temporary network outage during the build, the command will be tried multiple times with increased delays to avoid having the whole build fail.

        **Nota bene 2**: there is no need to put standard ``git``, ``wget``, ``curl``, ``go``, and similar commands behind a ``catch_and_retry`` as its already handled transparently.

        .. code-block:: bash

            git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
            cd /opt/tools/yourtool || exit
            python3 -m venv ./venv/
            source ./venv/bin/activate
            pip3 install -r requirements.txt
            deactivate
            add-aliases yourtool

        And add the following alias to your new alias file in /sources/assets/zsh/aliases.d/

        .. code-block:: bash

            alias yourtool='/opt/tools/yourtool/venv/bin/python3 /opt/tools/yourtool/yourtool.py'

    ..  tab:: APT install

        APT installations are regrouped to go faster and save some bandwith. In the ``package_whatever.sh`` file you're editing, look for a function called ``install_*_apt_tools()``.
        The package you want to install needs to be added there, along with the ``add-history``, ``add-test-command`` and ``add-to-list`` instructions.

    ..  tab:: Go

        Go tools can be installed with a standard ``go install -v github.com/AUTHOR/REPO@latest`` command.

    ..  tab:: Ruby

        A typical Ruby tool install will look like this:

        .. code-block:: bash

            function install_yourtool() {
                colorecho "Installing yourtool"
                rvm use 3.0.0@yourtool --create
                gem install yourtool
                rvm use 3.0.0@default
                add-aliases yourtool
                add-history yourtool
                add-test-command "yourtool --help"
                add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
            }

        And the alias file will look something like this.

        .. code-block:: bash

            alias yourtool='/usr/local/rvm/gems/ruby-3.0.0@yourtool/wrappers/ruby /usr/local/rvm/gems/ruby-3.0.0@yourtool/bin/yourtool'

    ..  tab:: Compile sources

        When installing a binary tool (pre-compiled or compiled live), it needs to be moved or linked in ``/opt/tools/bin``.
        Below is an example of tool compilation and installation.

        .. code-block:: bash

            function install_yourtool() {
                colorecho "Installing yourtool"
                git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
                cd /opt/tools/yourtool
                ./configure
                make
                ln -s "/opt/tools/yourtool/bin/yourtool" "/opt/tools/bin/yourtool"
                add-history yourtool
                add-test-command "yourtool --help"
                add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
            }

    .. tab:: Download compiled binary

        It's not uncommon to have tools already compiled, sometimes available in the "releases" section of a GitHub repository.
        In the following example, the latest .tar.xz release archive is dynamically fecthed from the repo, by grepping the right strings to match the name of the file and extracted. And then a symbolic link is created.
        The extact context can differ for each and every tool, but the example function below can serve as codebase. Trying to find similar examples in the code could also help a contributor find similar contexts and how they got implemented.

        .. code-block:: bash

            function install_yourtool() {
                colorecho "Installing yourtool"
                local URL
                URL=$(curl --location --silent "https://api.github.com/repos/AUTHOR/REPO/releases/latest" | grep 'browser_download_url.*somestring.*tar.xz"' | grep -o 'https://[^"]*')
                curl --location -o /tmp/tool.tar.xz "$URL"
                tar -xf /tmp/yourtool.tar.xz --directory /tmp
                rm /tmp/yourtool.tar.xz
                mv /tmp/yourtool* /opt/tools/yourtool
                ln -s "/opt/tools/yourtool/bin/yourtool" "/opt/tools/bin/yourtool"
                add-history yourtool
                add-test-command "yourtool --help"
                add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
            }

Other standards
---------------

If your tool opens ports, or if there are credentials at play, please take a look at the corresponding documentations

* :doc:`Credentials </exegol-image/credentials>`
* :doc:`Ports & services </exegol-image/services>`

Multi-architecture builds
-------------------------

Know that Exegol images are built by, and for, AMD64 and ARM64 systems. Most systems are AMD64 (x86_64), but some other people use ARM64 (M1/M2 Apple Sillicon chips, 64bits Raspberry-Pies, ...).
Whenever possible, try to make sure your tool install function works for both architectures.
Rest assured, if you don't have both architectures at your disposal it's perfectly fine, we'll take care of this part for you.
If you do, and if your tool installation function includes some commands that differ wether they run on an ARM64 or AMD64 host, you can use the following structure.

.. code-block:: bash

    if [[ $(uname -m) = 'x86_64' ]]
    then
        # command for AMD64
    elif [[ $(uname -m) = 'aarch64' ]]
    then
        # command for ARM64
    else
        criticalecho-noexit "This installation function doesn't support architecture $(uname -m)" && return
    fi

Calling the install function
----------------------------

Once the install function is over with, it needs to be called in the function that holds the same name as the package.
For instance, if you're adding your tool install function in the ``package_web.sh`` package, you'll need to call that function in the ``package_ad()`` function (usually at the bottom of that file).

It will look something like this.

.. code-block:: bash

    function package_web() {
        [...]
        install_yourtool
        [...]
    }

Submitting the pull request
---------------------------

.. hint::

    Once all your changes are over, and before submitting a pull request, it is advised to test your installation process locally.
    The Exegol wrapper can be used to build local images. Run ``exegol install --help`` to see some examples.
    You can also run the unit tests yourself by creating

    ..  code-block:: bash

        # build the local image
        exegol install "testimage" "full" --build-log "/tmp/testimage.log"

        # create and start a container for the tests
        exegol start "testcontainer" "testimage"

        # run the tests (from the container)
        cat /.exegol/build_pipeline_tests/all_commands.txt | grep -vE "^\s*$" | sort -u > /.exegol/build_pipeline_tests/all_commands.sorted.txt
        python3 /.exegol/build_pipeline_tests/run_tests.py
        cat /.exegol/build_pipeline_tests/failed_commands.log

.. warning::

    Your pull request needs to be made against the ``dev`` branch.

Once you submit your pull request, and once the various changes that may be requested are made, a CI/CD pipeline will run to make sure your code is compliant and that the tool is installed and works as intended.
The pipeline may raise some issues, but if they're not related to your tool (e.g. network issues are common) don't worry about it. If the errors are due to your tool install, then you'll need to make the necessary changes to make your install work.

Once everything works, the pull request will be merged, the pipeline will run again in order to test, build and publish a new ``nightly`` image. Congrats, you're now an Exegol contributor!

Temporary fixing a tool
~~~~~~~~~~~~~~~~~~~~~~~

Tools sometimes have their own issues along their development. A temporary fix can be added as follows, in order to let builds pass successfully, while the respective tool is not fixed. The fix depends on the way the tool is supposed to be installed.

.. tabs::

    .. tab:: Git (checkout)

        Applying the temporary fix for a tool installed through git goes as follows when checking out a previous commit

        #. Find the commit id that made the tool install fail. This can be found in a try & repeat manner by installing the tool in an exegol container, checking out on a commit ID, try installing again, and repeat until it works.
        #. Comment out the inital ``git clone`` command.
        #. Add the temporary fix (``git clone`` and ``git checkout``) in a if statement that makes sure the fix won't stay there forever. The error message will be raised and noticed in the pipeline.
        #. (bonus) create an issue on the repo (if it doesn't exist already) with the appropriate logs to help the tool's maintainers notice the installation error and fix it.

        .. code-block:: bash

            function install_TOOL() {
                [...]
                # git -C /opt/tools/ clone --depth 1 https://github.com/REPO/TOOL.git
                local temp_fix_limit="YYYY-MM-DD"
                if [ "$(date +%Y%m%d)" -gt "$(date -d $temp_fix_limit +%Y%m%d)" ]; then
                  criticalecho "Temp fix expired. Exiting."
                else
                  git -C /opt/tools/ clone https://github.com/REPO/TOOL.git
                  git -C /opt/tools/TOOL checkout 774f1c33efaaccf633ede6e704800345eb313878
                fi
                [...]
            }

    .. tab:: Git (merge PRs)

        When merging PRs on the fly, the temp fix goes like this

        #. Find the PRs the need to be merged. **Warning: only PRs from trusted authors must be hot-merged in this manner**.
        #. List the PR numbers in the ``PRS`` array
        #. Merge. In the example below the ``--strategy-option theirs`` strategy is chosen, but it can be changed if needed.

        .. code-block:: bash

            function install_TOOL() {
                [...]
                git -C /opt/tools/ clone --depth 1 https://github.com/REPO/TOOL.git
                local temp_fix_limit="YYYY-MM-DD"
                if [ "$(date +%Y%m%d)" -gt "$(date -d $temp_fix_limit +%Y%m%d)" ]; then
                    criticalecho "Temp fix expired. Exiting."
                else
                    git config --local user.email "local"
                    git config --local user.name "local"
                    local PRS=("111" "222" "333")
                    for PR in "${PRS[@]}"; do git fetch origin "pull/$PR/head:pull/$PR" && git merge --strategy-option theirs --no-edit "pull/$PR"; done
                fi
                [...]
            }

Adding to my-resources
~~~~~~~~~~~~~~~~~~~~~~

.. hint::

    This documentation is not written yet... Please contact us if you would like to contribute to this part and don't know how.

Wrapper
=======

.. hint::

    This documentation is not written yet... Please contact us if you would like to contribute to this part and don't know how.


Signing commits
===============

To make the project as secure as possible, signed commits are now required to contribute to the project.
Using signatures for commits on GitHub serves several important purposes :

* **Authentication**: it verifies the authenticity of the commit, ensuring that it was indeed made by the person claiming to have made it.
* **Integrity**: it ensures that the commit hasn't been tampered with since it was signed. Any changes to the commit after it has been signed will invalidate the signature.
* **Trust**: this ensures that all contributions come from trusted sources.
* **Visibility**: on GitHub, signed commits are marked with a "verified" label, giving users and collaborators confidence in the commit's origin and integrity.

GitHub offers `an official documentation <https://docs.github.com/fr/authentication/managing-commit-signature-verification/signing-commits>`_ on the matter that can be followed to setup and sign commits properly. Exegol's documentation will sum it up briefly and link to it whenever it's needed.

While **SSH (+ FIDO2)** is preferred since it offers better multi-factor signing capabilities (knowledge + hardware possession factors), people that don't have the required hardware can proceed with GPG or SSH.

..  tabs::

    ..  tab:: GPG

        Generating a GPG key can be done by following GitHub's official documentation on the matter (`generating a new GPG key <https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key>`_).
        TL;DR, the commands look something like this:

        .. code-block:: bash

            # for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
            gpg --quick-generate-key "YOUR_NAME <ID+Name@users.noreply.github.com>" ed25519 sign 0
            gpg --list-secret-keys --keyid-format=long
            gpg --armor --export $KEYID

        Once the GPG key is generated, it can be added to the contributor's GitHub profile. Again, GitHub's documentation explains how to achieve that (`adding a GPG key to your GitHub account <https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account>`_).

        Once the GPG key is generated and associated to the GitHub account, it can be used to sign commits. In order to achieve that, the contributor must configure ``git` properly on his machine (`telling git about your GPG key <https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key>`_).

        TL;DR: the commands look something like this to set it up for ``git`` CLI:

        .. code-block:: bash

            gpg --list-secret-keys --keyid-format=long
            git config --global user.signingkey $KEYID

            # (option 1) configure locally on a specific repo
            cd /path/to/repository && git config commit.gpgsign true

            # (option 2) configure for all git operations
            git config --global commit.gpgsign true

        To set it up on IDEs, proper official documentations can be followed (e.g. `GitKraken <https://help.gitkraken.com/gitkraken-client/commit-signing-with-gpg/#configure-gpg-in-gitkraken>`_, `PyCharm <https://www.jetbrains.com/help/pycharm/set-up-GPG-commit-signing.html#enable-commit-signing>`_).

    ..  tab:: SSH

        Generating an SSH key can be done by following GitHub's official documentation on the matter (`generating a new SSH key <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent>`_).
        TL;DR, the commands look something like this:

        .. code-block:: bash

            # for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
            ssh-keygen -t ed25519 -C "YOUR_NAME <ID+Name@users.noreply.github.com>"

        Once the SSH key is generated, the public part can be added to the contributor's GitHub profile. Again, GitHub's documentation explains how to achieve that (`adding a new SSH key to your GitHub account <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account>`_).

        Once the SSH key is generated and associated to the GitHub account, it can be used to authenticate and sign commits. In order to achieve that, the contributor must configure ``ssh`` and ``git`` properly on his machine (`telling git about your SSH key <https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key>`_).

        TL;DR: the commands look something like this:

        .. hint::

            The ``git`` client version must be 2.34 or later.

        .. code-block:: bash

            # if setting up for the first time, configure git
            git config --global user.name "YOUR_NAME"
            # for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
            git config --global user.email "ID+Name@users.noreply.github.com"

            git config --global gpg.format ssh
            # replace the public key path if needed, below is an example
            git config --global user.signingkey "$HOME/.ssh/id_ed25519.pub"

            # configure git to sign commits and tags by default
            git config --global commit.gpgsign true
            git config --global tag.gpgsign true

            # verify commits locally, associate SSH public keys with users
            mkdir -p ~/.config/git
            echo "$(git config --get user.email) $(cat ~/.ssh/id_ed25519.pub)" | tee ~/.config/git/allowed_signers
            git config --global gpg.ssh.allowedSignersFile "$HOME/.config/git/allowed_signers"

        The SSH connection can then be tested as follows (`testing your SSH connection <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection>`_).

        .. code-block:: bash

            # load the SSH agent into the current shell
            eval "$(ssh-agent -s)"

            # test the SSH authentication to GitHub servers
            ssh -T git@github.com

    ..  tab:: SSH (+ FIDO2)

        This part of the doc explains how to setup and use FIDO2 security keys, such as YubiKeys, Google's Titan, etc.

        First of all, a new FIDO2 key can be configured as follows to set up a PIN.

        .. code-block:: bash

            # list FIDO2 devices
            fido2-token -L

            # set a PIN for the device
            fido2-token -S $device

        Then, a `resident key <https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Resident_Keys.html>`_ can be created and stored on the YubiKey as follows (see `Yubico's documentation <https://www.yubico.com/blog/github-now-supports-ssh-security-keys/>`_).

        .. hint::

            Some FIDO2 keys (e.g. recent YubiKeys, and probably others) support **resident keys**. A resident key is stored on the hardware key itself and easier to import to a new computer because it can be loaded directly from the security key.
            In order to use that feature, the ``-O resident`` option can be added to the ``ssh-keygen`` command chosen below.

        .. code-block:: bash

            # (default) touch only
            ssh-keygen -t ed25519-sk

            # PIN + touch
            ssh-keygen -t ed25519-sk -O verify-required

            # nothing (could be unsupported by some OpenSSH clients)
            ssh-keygen -t ed25519-sk -O no-touch-required

            # PIN (could be unsupported by some OpenSSH clients)
            ssh-keygen -t ed25519-sk -O verify-required -O no-touch-required

        Once the SSH key is generated, the public part can be added to the contributor's GitHub profile. GitHub's documentation explains how to achieve that (`adding a new SSH key to your GitHub account <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account>`_).

        Once a key is created and added on GitHub, it can be added to the contributor's machine SSH environment as follows. This is as easy as copy-pasting the public and private key parts to ``~/.ssh``.

        .. hint::

            If you opted for a **resident key** setup, the SSH key can be loaded from the hardware key itself.

            Note that those steps shouldn't be needed when the key has just been created, as the keys should automatically be added to ``~/.ssh``. The commands below are mostly relevant when using **existing** resident keys on **a new system**.

            .. code-block:: bash

                # temporary
                # needs to be done again after a reboot
                ssh-add -K

                # permanent
                # will download the private and public resident security keys in the current directory
                # private key is to be moved in ~/.ssh (physical FIDO2 key will always be needed)
                ssh-keygen -K
                mv id_ed25519_sk_rk ~/.ssh/id_ed25519_sk
                mv id_ed25519_sk_rk.pub ~/.ssh/id_ed25519_sk.pub

        Once the SSH environment is ready, ``git`` CLI can be configured to rely on the security key for signing commits and authenticating (`telling git about your SSH key <https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key>`_).

        .. hint::

            The ``git`` client version must be 2.34 or later.

        .. code-block:: bash

            # if setting up for the first time, configure git
            git config --global user.name "YOUR_NAME"
            # for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
            git config --global user.email "ID+Name@users.noreply.github.com"

            git config --global gpg.format ssh
            # replace the public key path if needed, below is an example
            git config --global user.signingkey "$HOME/.ssh/id_ed25519_sk.pub"

            # configure git to sign commits and tags by default
            git config --global commit.gpgsign true
            git config --global tag.gpgsign true

            # verify commits locally, associate SSH public keys with users
            mkdir -p ~/.config/git
            echo "$(git config --get user.email) $(cat ~/.ssh/id_ed25519_sk.pub)" | tee ~/.config/git/allowed_signers
            git config --global gpg.ssh.allowedSignersFile "$HOME/.config/git/allowed_signers"

        The SSH connection can then be tested as follows (`testing your SSH connection <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection>`_).

        .. code-block:: bash

            # load the SSH agent into the current shell
            eval "$(ssh-agent -s)"

            # test the SSH authentication to GitHub servers
            ssh -T git@github.com

.. hint::

    The contributor's GitHub account can be configured to mark unsigned commits as unverified or partially verified. While it's not mandatory regarding contributions to Exegol since the requirement is managed on Exegol repositories directly, it's a nice thing to do. See GitHub's documentation on `Vigilante mode <https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits>`_.