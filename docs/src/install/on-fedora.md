# Installing Exegol on Fedora

> [!NOTE]
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

> [!WARNING]
> SELinux is usually enabled by default on Fedora and is not supported by Exegol (yet). You may need to disable it on Docker, or set it to permissive mode for Exegol to work properly. Refer to the [Configure SELinux](#configure-selinux) part down at the bottom if needed.

## 1. Requirements

Git, Python3 and Pipx can be installed with the following command:

```bash
sudo dnf -y update && sudo dnf -y install git python3 pipx
```

Ensure pipx is in PATH and reload the shell

```bash
pipx ensurepath && exec $SHELL
```

While we always advise to refer to the [official documentation](https://docs.docker.com/engine/install/), the following one-liner can be used to install Docker quickly.

```bash
curl -fsSL "https://get.docker.com/" | sh
```

> [!WARNING]
> Docker "[Rootless mode](https://docs.docker.com/engine/security/rootless/)" is not supported by Exegol as of yet. Don't follow that part.

Once docker is installed, it needs to be started.

```bash
# start docker
sudo systemctl start docker 

# configure docker to start at boot
sudo systemctl enable --now docker
```

## 2. Wrapper install

Install Exegol in an isolated environment using [pipx](https://pypa.github.io/pipx/), a tool that allows you to easily install and run Python applications in isolated environments, keeping them separate from your system Python and other packages.

```bash
pipx install exegol
```

Before using Exegol, you will need to read and accept the [End User License Agreement (EULA)](/legal/eula). This will be prompted on the first run of the wrapper, and until it's confirmed.

To interact with docker, the wrapper needs proper permissions. You must either run Exegol with sudo (preferred), or have your user be a member of the docker group (which dangerously allows your user to basically have root permissions all the time).

The following command shows how to do that with bash, but it can be adapted to any shell. Once the alias is set, you can apply it your current session.

Add the following alias to your `~/.bashrc` file:

```bash
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.bashrc && source ~/.bashrc
```

## 3. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "3. Activation"](/first-install#_3-activation).

## Configure SELinux

Create the following files

::: code-group


```te [exegol_bint.te]
module exegol_bint 1.0;

require {
    type container_t;
    type bin_t;
    class dir { create write getattr search open add_name };
    class file { create write getattr open execute };
}

# Allow container to perform all operations on directories labeled as bin_t
allow container_t bin_t:dir { create write getattr search open add_name };

# Allow container to perform all operations on files labeled as bin_t
allow container_t bin_t:file { create write getattr open execute };
```

```te [exegol_home.te]
module exegol_home 1.0;

require {
    type container_t;
    type data_home_t;
    class file { ioctl entrypoint open execute read write getattr };
}

#============= container_t ==============
allow container_t data_home_t:file { ioctl entrypoint open execute read write getattr };
```

```te [exegol_connectto.te]
module exegol_connectto 1.0;

require {
    type container_t;
    type unconfined_t;
    class unix_stream_socket { connectto };
}

# Allow container to perform connectto operation on unix_stream_socket
allow container_t unconfined_t:unix_stream_socket { connectto };
```
:::

Run the following commands
```
checkmodule -M -m -o exegol_bint.mod exegol_bint.te
semodule_package -o exegol_bint.pp -m exegol_bint.mod
sudo semodule -i exegol_file-bint.pp

checkmodule -M -m -o exegol_home.mod exegol_home.te
semodule_package -o exegol_home.pp -m exegol_home.mod
sudo semodule -i exegol_home.pp

checkmodule -M -m -o exegol_ connectto.mod exegol_connectto.te
semodule_package -o exegol_connectto.pp -m exegol_connectto.mod
sudo semodule -i exegol_connectto.pp
```