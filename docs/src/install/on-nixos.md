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

`git`, `exegol` and the Docker engine can be installed by editing your NixOS configuration:

```bash
sudo nano /etc/nixos/configuration.nix
```

Add the following lines (or merge with your existing configuration):

```bash
environment.systemPackages = with pkgs; [
  exegol
  git
];
  virtualisation.docker = {
  enable = true;
  # Do NOT enable rootless here — Exegol doesn’t support Docker rootless mode
  rootless.enable = false; # (false is the default)
};
```

> [!WARNING]
> The exegol package in nixpkgs is not maintained by the Exegol team. Packaging issues should be reported to the nixpkgs maintainers. You can still ask on Discord, but support for this specific packaging path is best-effort.

Save the file with [CTRL] + [O], press [ENTER], and exit with [CTRL] + [X]. Then rebuild your system:

```bash
sudo nixos-rebuild switch
```

> [!TIP]
> Using flakes ? Add `pkgs.exegol` and `pkgs.git` in your flake’s NixOS module the same way, then:
> ```bash
> sudo nixos-rebuild switch --flake .#your-host
> ```

### Need a newer Exegol wrapper via `nixpkgs`?

From most stable to least stable option:

1. Use a newer channel (e.g., `nixos-unstable`) for just this package:
  ```nix
  let
    unstable = import <nixos-unstable> { };
  in {
    environment.systemPackages = with pkgs; [
      unstable.exegol
    ];
  }
  ```
  > You can also switch your whole system to `nixos-unstable`, but that affects everything.
2. If your target version isn't in `nixpkgs` yet:
  - Copy the Exegol derivation from a PR or a staging branch into your config
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
};
```

Save the file with [CTRL] + [O], press [ENTER], and exit with [CTRL] + [X].

Then apply the changes:

```bash
sudo nixos-rebuild switch
```

> [!TIP]
> Using flakes ? Add `pkgs.git`, `pkgs.python3` and `pkgs.pipx` in your flake’s NixOS module the same way, then:
> ```bash
> sudo nixos-rebuild switch --flake .#your-host
> ```

Ensure pipx is in PATH and reload the shell
```bash
pipx ensurepath && exec $SHELL
```

### Next

Once the requirements are installed, the main installation documentation can be followed, from [step "2. Wrapper install"](/first-install#_2-wrapper-install).