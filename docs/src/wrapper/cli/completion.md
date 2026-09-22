# `completion`

The `completion` action prints the shell completion script of the Exegol wrapper. Once that
script is installed, pressing `<TAB>` completes actions, options, container names and image
names.

This action talks to nothing: it needs no Docker daemon and makes no network request. The
script goes to the standard output and every log message to the standard error, so the
output can be redirected straight to a file without being polluted.

## Choosing the shell

Called without an argument, the wrapper reads the `SHELL` environment variable and
generates the script for `bash`, `zsh`, `fish` or `tcsh`, falling back to `bash` when the
shell is not one of those. PowerShell is never auto-detected, name it explicitly.

```bash
# Let the wrapper detect the current shell
exegol completion

# Name the shell yourself
exegol completion zsh
```

## Installation

Pick your shell below, then restart it. Completion is then available in every new session.

::: tabs

=== Bash

```bash
mkdir -p ~/.local/share/bash-completion/completions
exegol completion bash > ~/.local/share/bash-completion/completions/exegol
```

=== Zsh

The completion directory must be in your `fpath` **before** `compinit` runs.

```zsh
mkdir -p ~/.zsh/completions
exegol completion zsh > ~/.zsh/completions/_exegol

# In ~/.zshrc, before compinit:
fpath=(~/.zsh/completions $fpath)
```

=== Fish

```fish
exegol completion fish > ~/.config/fish/completions/exegol.fish
```

=== Tcsh

```sh
eval `exegol completion tcsh`
```

Add that line to your `~/.cshrc` to make it permanent.

=== PowerShell

```powershell
# Create the directory if needed
mkdir $HOME\Documents\WindowsPowerShell -ErrorAction SilentlyContinue

# Generate the completion module
exegol completion powershell > $HOME\Documents\WindowsPowerShell\exegol_completion.psm1

# Import it from your profile
Add-Content -Path $PROFILE -Value 'Import-Module "$HOME\Documents\WindowsPowerShell\exegol_completion.psm1"'

# Optional: menu-style tab completion, like Zsh
Add-Content -Path $PROFILE -Value 'Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete'
```

:::

## What gets completed

Container and image names are read from a local cache rather than from the Docker daemon,
so a tab press stays instantaneous and works even when Docker is stopped. The cache is
refreshed whenever the wrapper lists containers, and kept up to date when a container is
created, renamed or removed.

## Options

| Option | Description |
|----|----|
| `SHELL` | Shell to generate the script for: `bash`, `zsh`, `fish`, `tcsh` or `powershell` (default: auto-detected) |

The other options available for the completion action are the global options that affect
the behavior of all exegol actions.

| Option | Description |
|----|----|
| `-h`, `--help` | Show the help message of any action |
| `-v`, `--verbose` | Verbosity level (-v for verbose, -vv for advanced, -vvv for debug) |
| `-q`, `--quiet` | Show no information at all |
| `--offline` | Run exegol in offline mode, no request will be made on internet (default: Disabled) |
| `--arch {arm64,amd64}` | Overwrite default image architecture (default: host's arch) |

## Command examples

``` bash
# Print the script for the current shell
exegol completion

# Install it for bash
exegol completion bash > ~/.local/share/bash-completion/completions/exegol
```
