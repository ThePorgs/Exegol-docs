# Installing Exegol on Manjaro Linux

> [!NOTE]
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

---
## 1. Requirements

Git, Python3 and Pipx can be installed with the following command:

```bash
sudo pacman -Syu --noconfirm && sudo pacman -S --noconfirm git python-pipx
```

Ensure pipx is in PATH and reload the shell

```bash
pipx ensurepath && exec $SHELL
```

> [!NOTE]
> If zsh shows `correct 'pipx' to 'pip' [nyae]?`, you can safely ignore it and continue the installation.

While we always advise to refer to the [official documentation](https://docs.docker.com/engine/install/), the following one-liner can be used to install Docker quickly.

```bash
sudo pacman -Syu --noconfirm docker
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

---
## 2. Wrapper install

Install Exegol in an isolated environment using [pipx](https://pypa.github.io/pipx/), a tool that allows you to easily install and run Python applications in isolated environments, keeping them separate from your system Python and other packages.

```bash
pipx install exegol
```

Before using Exegol, you will need to read and accept the End User [License Agreement (EULA)](https://docs.exegol.com/legal/eula). This will be prompted on the first run of the wrapper, and until it's confirmed.

To interact with docker, the wrapper needs proper permissions. You must either run Exegol with sudo (preferred), or have your user be a member of the docker group (which dangerously allows your user to basically have root permissions all the time).

The following command shows how to do that with bash, zsh and fish, but it can be adapted to any shell. Once the alias is set, you can apply it your current session.

Create a shortcut to run Exegol with `sudo` while keeping your user environment:

::: tabs
=== Linux Bash
```bash
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.bashrc && source ~/.bashrc
```
=== Linux Zsh
```zsh
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.zshrc && source ~/.zshrc
```
=== Linux Fish
```shell
echo "alias exegol 'sudo -E \$HOME/.local/bin/exegol'" >> ~/.config/fish/config.fish && source ~/.config/fish/config.fish
```
:::

---
## 3. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "3. Activation"](/first-install#_3-activation).

---
## 🌅 Graphical applications support 

To enable graphical applications inside containers (like Firefox, BloodHound, or BurpSuite) to connect to your X11 session, you need to install `xorg-xhost` and grant some access.

First, install xorg-xhost:

```bash
sudo pacman -S xorg-xhost
```

Outside the container, grant access to the local root user (used by Exegol or Docker):

```bash
xhost +si:localuser:root
```

Inside the container:

```bash
export DISPLAY=:0
```
