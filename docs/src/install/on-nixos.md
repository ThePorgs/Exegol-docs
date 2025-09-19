# Installing Exegol on NixOS

> [!NOTE]
> This page was brought to you by a community member and wasn't "mass-tested" yet. Feedback on whether it works properly (or not) would be greatly appreciated (please head over to our Discord server for that).

> [!IMPORTANT]
> This page focuses on the NixOS way (declarative and reproducible) and also documents an alternative with pipx. Because NixOS is all about reproducibility, the "nix way" comes first. Please note that the official and recommended way to install Exegol is over pipx. 

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

## 1. NixOS-native

This approach keeps your system declarative and reproducible: all changes live in your Nix configuration.

### Enable Docker & install Exegol

`exegol` and the Docker engine can be installed by editing your NixOS configuration:

```bash
sudo nano /etc/nixos/configuration.nix
```

Add the following lines (or merge with your existing configuration):

```bash
environment.systemPackages = with pkgs; [
  exegol
];
virtualisation.docker = {
  enable = true;
  # Do NOT enable rootless here — Exegol doesn’t support Docker rootless mode
  rootless.enable = false; # (false is the default)
};
```

To run Exegol without sudo, the user must be a member of the docker group. This can be declared in the NixOS configuration:
```nix
users.users.<user>.extraGroups = [ "docker" ];
```

> [!WARNING]
> The exegol package in nixpkgs is not maintained by the Exegol team. Packaging issues should be reported to the `nixpkgs` maintainers. Questions may be asked on Discord, but support for this packaging path is provided on a best-effort basis.

Save the file with [CTRL] + [O], press [ENTER], and exit with [CTRL] + [X]. Then rebuild your system:

```bash
sudo nixos-rebuild switch
```

> [!TIP]
> Using flakes ? Add `pkgs.exegol` in the flake’s NixOS module in the same way, then:
> ```bash
> sudo nixos-rebuild switch --flake .#your-host
> ```

After rebuilding, log out and back in (or run newgrp docker) so the new group membership takes effect.

### Need a newer Exegol wrapper via `nixpkgs`?

From most stable to least stable option:

1. A newer channel (e.g., `nixos-unstable`) can be used for just this package:
  ```nix
  let
    unstable = import <nixos-unstable> { };
  in {
    environment.systemPackages = with pkgs; [
      unstable.exegol
    ];
  }
  ```
  > The whole system can also be switched to `nixos-unstable`, but that affects everything.
2. If the target version is not yet present in `nixpkgs`:
  - The Exegol derivation can be copied from a PR or a staging branch into the configuration.
  - Write your own derivation pointing to the desired source/version

> [!NOTE]
> Prefer these Nix-friendly options over [`pipx`](/on-nixos#_2-portable-alternative) only if you care about reproducibility. 

### Next

Once the wrapper and docker are installed, the main installation documentation can be followed, from [step "3. Activation"](/first-install#_3-activation).

## 2. `pipx` alternative

### Enable prerequisite

If you need the very latest wrapper immediately and can accept a non-declarative/non-reproducible setup:

`git`, `python3`, `pipx`, and the Docker engine can be installed by editing your NixOS configuration:

```bash
sudo nano /etc/nixos/configuration.nix
```

Add the following lines (or merge with your existing configuration):

```nix
environment.systemPackages = with pkgs; [
  git
  python3
  pipx 
];
virtualisation.docker = {
  enable = true;
  # Do NOT enable rootless here — Exegol doesn’t support Docker rootless mode
  rootless.enable = false; # (false is the default)
};
```

To run Exegol without sudo, the user must be a member of the docker group. This can be declared in the NixOS configuration:
```nix
users.users.<user>.extraGroups = [ "docker" ];
```

Save the file with [CTRL] + [O], press [ENTER], and exit with [CTRL] + [X].

Then apply the changes:

```bash
sudo nixos-rebuild switch
```

> [!TIP]
> Using flakes ? Add `pkgs.git`, `pkgs.python3` and `pkgs.pipx` in the flake’s NixOS module in the same way, then:
> ```bash
> sudo nixos-rebuild switch --flake .#your-host
> ```

Ensure pipx is in PATH and reload the shell
```bash
pipx ensurepath && exec $SHELL
```

### Next

Once the requirements are installed, the main installation documentation can be followed, from [step "2. Wrapper install"](/first-install#_2-wrapper-install).