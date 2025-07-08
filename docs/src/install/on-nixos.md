# Installing Exegol on NixOS

> [!NOTE]
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

## 1. Requirements

`git`, `python3`, `pipx`, and the Docker engine can be installed by editing your NixOS configuration:

```bash
sudo nano /etc/nixos/configuration.nix
```

Add the following lines (or merge with your existing configuration):

```bash
  environment.systemPackages = with pkgs; [
  git
  python3
  pipx 
 ];
   virtualisation.docker = {
    enable = true;
  };

```

Save the file with [CTRL] + [O], press [ENTER], and exit with [CTRL] + [X].

Then apply the changes:

```bash
sudo nixos-rebuild switch
```

Ensure `pipx` is in PATH and reload the shell

```bash
pipx ensurepath && exec $SHELL
```

While we always advise to refer to the [official documentation](https://docs.docker.com/engine/install/)


> [!WARNING]
> Docker "[Rootless mode](https://docs.docker.com/engine/security/rootless/)" is not supported by Exegol as of yet. Don't follow that part.

## 2. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "2. Wrapper install"](/first-install#_2-wrapper-install).
