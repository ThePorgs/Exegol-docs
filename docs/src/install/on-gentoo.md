# Installing Exegol on Gentoo

> [!NOTE]
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

# Installing Exegol on Gentoo

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

## 1. Requirements

Git, Python3 and Pipx can be installed with the following command:


```bash
sudo emerge --ask dev-vcs/git
```

```bash
sudo emerge --ask dev-lang/python
```

```bash
sudo emerge --ask dev-python/pip
```

Install pipx inside a virtual environment (required on Gentoo):

```bash
python3 -m venv ~/myenv
source ~/myenv/bin/activate
pip install pipx
```

Ensure pipx is in PATH and reload the shell (inside myenv):

```bash
pipx ensurepath && exec $SHELL
```

Then install the Exegol wrapper (inside myenv):

```bash
pipx install exegol
```


>You can choose any directory for the virtual environment. This method works well for installing both pipx and Exegol on Gentoo.

Create a shortcut to run Exegol with `sudo` while keeping your user environment:

```bash
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.bashrc && source ~/.bashrc
```

## 1.2. Installing Docker

While we recommend referring to the official [Gentoo Wiki](https://wiki.gentoo.org/wiki/Docker) for full details, the following commands can be used to install and configure Docker on Gentoo.


Install Docker and CLI tools:

```bash
sudo emerge --ask --verbose app-containers/docker app-containers/docker-cli
```

Check kernel compatibility:

```bash
/usr/share/docker/contrib/check-config.sh
```

Start Docker (choose according to your init system):

###### With systemd:

```bash
# start docker
sudo systemctl start docker.service

# configure docker to start at boot
sudo systemctl enable docker.service
```

###### With openrc:

After Docker has been successfully installed and configured, it can be added to the system's default runlevel, starting it at boot:

```bash
rc-update add docker default
rc-service docker start
```

If you need the Docker registry:

```bash
rc-update add registry default
rc-service registry start
```


> [!WARNING]
> Docker "[Rootless mode](https://docs.docker.com/engine/security/rootless/)" is not supported by Exegol as of yet. Don't follow that part.

## 2. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "2. Wrapper install"](/first-install#_2-wrapper-install).

## 3.1. Graphical apps

To enable graphical applications inside containers (like Firefox, BloodHound, or BurpSuite) to connect to your X11 session, you need to install `xorg-xhost` and grant some access.

```bash
sudo emerge --ask x11-apps/xhost
```

Outsite the container:

```bash
xhost +local:
```

Inside the container:
```bash
export DISPLAY=:0
```