# Installing Exegol on Slackware 15.0+ -current


> [!NOTE] 
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

> [!DANGER]
> This guide is intended for Slackware 15.0+ `(-current)`, tested with [AlienBOB's ISO](https://slackware.uk/people/alien-current-iso/slackware64-current-iso/). The stable 15.0 release is not recommended due to outdated kernel and package versions that cause compatibility issues.

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

---
## 1. Requirements

Git, Python3, Pipx and Openssl can be installed with the following command:

```bash
sudo slackpkg update
sudo slackpkg install python3 git
sudo slackpkg upgrade python3 git openssl
```

```bash
python3 -m ensurepip --upgrade
python3 -m pip install --user pipx
```

Ensure pipx is in PATH and reload the shell:

```bash
python3 -m pipx ensurepath && exec $SHELL
```

---

Installing Docker on Slackware (using official binaries):

>[!IMPORTANT]
>The official [Slackware Docker guide](https://docs.slackware.com/howtos:cloud:docker) points to a [deleted Git repository](https://github.com/dslackw/slpkg.git).
As a result, we are installing Docker using the [official static binaries from docker.com](https://download.docker.com/linux/static/stable/x86_64/) instead of building from source via [SlackBuilds](http://www.slackware.com/~alien/slackbuilds/docker/).

```bash
# Download the official Docker binary release
wget https://download.docker.com/linux/static/stable/x86_64/docker-28.3.2.tgz

# Extract it
tar -xvzf docker-28.3.2.tgz
cd docker

# Copy the binaries to the system path
cp dockerd docker containerd containerd-shim-runc-v2 docker-init docker-proxy runc ctr /usr/local/bin/

# Verify installation
which dockerd
dockerd --version

# Start the Docker daemon manually
dockerd &
```

Verify the installation:

```bash
docker version
docker run hello-world
```


Enable Docker at boot: Append the following lines to `/etc/rc.d/rc.local`:

```bash
echo '
# Start Docker daemon at boot
if [ -x /usr/local/bin/dockerd ]; then
  /usr/local/bin/dockerd &
fi
' >> /etc/rc.d/rc.local
```

Make the file executable:

```bash
chmod +x /etc/rc.d/rc.local
```

Docker will now start automatically every time the system boots.

> [!WARNING]
> Docker "[Rootless mode](https://docs.docker.com/engine/security/rootless/)" is not supported by Exegol as of yet. Don't follow that part.

---

## 2. Wrapper install 

Install Exegol in an isolated environment using pipx, a tool that allows you to easily install and run Python applications in isolated environments, keeping them separate from your system Python and other packages.

```bash
pipx install exegol
```


Before using Exegol, you will need to read and accept the End User [License Agreement (EULA)](https://docs.exegol.com/legal/eula). This will be prompted on the first run of the wrapper, and until it's confirmed.

To interact with docker, the wrapper needs proper permissions. You must either run Exegol with sudo (preferred), or have your user be a member of the docker group (which dangerously allows your user to basically have root permissions all the time).

The following command shows how to do that with bash and zsh, but it can be adapted to any shell. Once the alias is set, you can apply it your current session.


Create a shortcut to run Exegol with `sudo` while keeping your user environment:

For Bash:

```bash
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.bashrc && source ~/.bashrc
```

For Zsh:

```zsh
echo "alias exegol='sudo -E \$HOME/.local/bin/exegol'" >> ~/.zshrc && source ~/.zshrc
```


---
## 3. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "3. Activation"](https://docs.exegol.com/first-install#_3-activation).

---
## 🌅 Graphical applications support 

To enable graphical applications inside containers (like Firefox, BloodHound, or BurpSuite) to connect to your X11 session, you need to install xorg-xhost and grant some access.

```bash
slackpkg install xhost
```

Outside the container, grant access to the local root user (used by Exegol or Docker):

```bash
xhost +si:localuser:root
```

Inside the container:

```bash
export DISPLAY=:0
```
