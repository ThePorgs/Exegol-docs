# First install


While Exegol supports all major operating systems, we recommend using Linux for optimal performance. 
Docker Desktop on Windows and macOS has limitations with host network interfaces and USB device access.

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

> [!TIP]
> For the easiest and smoothest experience, we recommend installing Exegol on a Linux system (such as Ubuntu) and using the Zsh shell. Other operating systems and shells are supported, but this setup is by far the most straightforward.

This page details the installation steps for the most common operating systems Ubuntu/Debian, macOS or Windows.

If you're using another operating system in the following list, click on it to be redirected to the proper installation page: [Arch](/install/on-arch), [Fedora](/install/on-fedora), [Gentoo](/install/on-gentoo), [NixOS](/install/on-nixos), [openSUSE](/install/on-opensuse), [Qubes OS](/install/on-qubesos), [Slackware](/install/on-slackware), [Void](/install/on-void).

If your operating system is not covered here or in the list above, it should work nonetheless, but we probably didn't have the time to document it yet (you're welcome to help if you'd like).

## 1. Requirements

Before installing Exegol, ensure you have:

- **Git**: for downloading source code ([Linux](https://github.com/git-guides/install-git#install-git-on-linux) | [macOS](https://github.com/git-guides/install-git#install-git-on-mac) | [Windows](https://github.com/git-guides/install-git#install-git-on-windows))
- **Python 3**: to run the wrapper ([Linux](https://docs.python.org/3/using/unix.html) | [macOS](https://docs.python.org/3/using/mac.html) | [Windows](https://docs.python.org/3/using/windows.html))
- **Docker**: to run the containers. [Docker Engine](https://docs.docker.com/engine/install/) for Linux, [OrbStack](https://orbstack.dev/) is advised for macOS, [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) for Windows.
- **Storage**: at least 200GB recommended

::: tabs

=== Linux

Linux is the recommended platform for Exegol. No additional requirements necessary.

Install Git and Python if not already installed:
```bash
sudo apt update && sudo apt install -y git python3 pipx
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

=== macOS

For macOS, we recommend [Orbstack](https://orbstack.dev/). [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) can be used as well but lacks a few features and is not very optimized.

Install Homebrew if not already installed

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Git, Python and Pipx

```bash
brew install git python pipx
```

Ensure pipx is in PATH and reload the shell

```bash
pipx ensurepath && exec $SHELL
```


=== Windows

For Windows, you'll need:

- Windows 10 (updated) or Windows 11
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) with at least one Linux distribution installed
- [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) with WSL2 integration enabled

Install Git and Python:
```powershell
# Download and install Git from the official website
winget install --id Git.Git -e --source winget

# Download and install Python
winget install --id Python.Python.3 -e --source winget
```

![Windows Docker Desktop WSL integration](/assets/install/windows_dockerdesktop_wsl_config.png)


> [!WARNING]
> You may want to disable Windows Defender during the installation, as
> Exegol will download pre-built remote shells (or temporarily exclude
> `C:\Users\<username>\AppData\Local\Temp` or the source file
> directory).
>
> You should also add the folder
> `C:\Users\<user>\.exegol\exegol-resources` to the exclusion list.

Later on, if you want to install the wrapper on your Windows machine directly, and not in a WSL, that's possible. You'll need to install pipx first.


```powershell
py -m pip install --user pipx
py -m pipx ensurepath
```

:::

## 2. Wrapper install

Install Exegol in an isolated environment using [pipx](https://pypa.github.io/pipx/), a tool that allows you to easily install and run Python applications in isolated environments, keeping them separate from your system Python and other packages.

```bash
pipx install exegol
```

Before using Exegol, you will need to read and accept the [End User License Agreement (EULA)](/legal/eula). This will be prompted on the first run of the wrapper, and until it's confirmed.

To interact with docker, the wrapper needs proper permissions. You must either run Exegol with sudo (preferred), or have your user be a member of the docker group (which dangerously allows your user to basically have root permissions all the time).

The following command shows how to do that with bash, but it can be adapted to any shell. Once the alias is set, you can apply it your current session.

::: tabs
=== Linux Bash
```bash
echo "alias exegol='sudo -E $(echo ~/.local/bin/exegol)'" >> ~/.bash_aliases && source ~/.bash_aliases
```
=== Linux Zsh
```zsh
echo "alias exegol='sudo -E $(echo ~/.local/bin/exegol)'" >> ~/.zshrc && source ~/.zshrc
```
=== Windows PowerShell / WSL
When using Docker Desktop, you **don't** need to use ``sudo``. You can skip this step and follow the next one.
=== macOS
When using Docker Desktop, you **don't** need to use ``sudo``. You can skip this step and follow the next one.
:::

## 3. Activation <Badge type="pro"/><Badge type="enterprise"/>

If you have a [Pro or Enterprise subscription](https://exegol.com/pricing), you can activate your license:

```bash
exegol activate
```

You will need an active license, and a token from [dashboard.exegol.com/otp](https://dashboard.exegol.com/otp). See the [activate](wrapper/cli/activate) documentation section for more information on that action.

## 4. Image install

Once the wrapper is installed, you can download your first Exegol image:

```bash
exegol install
```

You'll be guided through selecting and installing an image.

## 5. Run Exegol

Launch your first Exegol container with:

```bash
exegol start
```


## :zap: Auto-completion setup

This step is optionnal.

Exegol supports command auto-completion for easier usage. Here's how to set it up for your shell:

::: tabs

=== Bash

First, install argcomplete:
```bash
pipx install argcomplete
```

Then, add the following line to your `.bashrc`:

```bash
eval "$(register-python-argcomplete --no-defaults exegol)"
```

=== Zsh

```zsh
# Install argcomplete
pipx install argcomplete

# Enable compinit if not already enabled
echo "autoload -U compinit && compinit" >> ~/.zshrc

# Add Exegol completion
echo 'eval "$(register-python-argcomplete --no-defaults exegol)"' >> ~/.zshrc
```

=== Fish

```fish
# Activate in current session
register-python-argcomplete --no-defaults --shell fish exegol | source

# Or create completion file
register-python-argcomplete --no-defaults --shell fish exegol > ~/.config/fish/completions/exegol.fish
```

=== Tcsh

```sh
eval `register-python-argcomplete --no-defaults --shell tcsh exegol`
```

=== PowerShell

```powershell
# Install argcomplete
pipx install argcomplete

# Create directory if needed
mkdir $HOME\Documents\WindowsPowerShell -ErrorAction SilentlyContinue

# Generate completion file
register-python-argcomplete --no-defaults --shell powershell exegol > $HOME\Documents\WindowsPowerShell\exegol_completion.psm1

# Import in profile
Add-Content -Path $PROFILE -Value 'Import-Module "$HOME\Documents\WindowsPowerShell\exegol_completion.psm1"'

# Optional: Enable tab completion like Zsh
Add-Content -Path $PROFILE -Value 'Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete'
```

:::

## :sunrise: Graphical applications support

This step is optionnal. Graphical apps are already usable through the graphical desktop environment already available.
This step allows more advanced users to set up X11 socket sharing to open GUI apps from the CLI directly.

::: tabs

=== Linux

Linux supports graphical applications natively.

=== macOS

Exegol **already supports** a full desktop environment out of the box, that you can access with a VNC client, or directly in your browser (with the `--desktop` wrapper option). This is better than launching GUI apps from the terminal.

If you really want to launch GUI apps from the terminal on macOS and the full desktop is not enough, you need [XQuartz](https://www.xquartz.org/) installed, with "Allow connections from network clients" enabled, but be avised, this solution is far from smooth. We call this X11 support.

![macOS XQuartz configuration requirement](/assets/install/macOS_xquartz_config.png)


=== Windows

Windows supports graphical applications through WSLg:

1. Ensure WSL2 is updated: `wsl --update`
2. Verify that a Linux distribution is installed and working through WSL2

See the [official WSLg documentation](https://github.com/microsoft/wslg#installing-wslg) for more details.

:::

