# Exegol-history

`Exegol-history` is a tool to quickly store and retrieve compromised credentials and hosts; the goal is to ease the management of credentials and hosts during a penetration testing engagement or a CTF.

Once a credential or a host is selected (from the CLI or the TUI), its information is exposed through **environment variables** in your current shell, so it doesn't need to be typed over and over. Combined with Exegol's pre-filled command history (which references those variables, e.g. `$USER`, `$PASSWORD`, `$TARGET`, `$DC_IP`), this becomes a very powerful workflow.

The tool can be used with the alias `exh` or with `exegol-history`.

> [!TIP] TL;DR
> When obtaining new credentials, the process usually goes like this
> ```bash
> exh add creds -u 'USER' -p 'PASSWORD' -H 'NT_HASH_if_any' -d 'DOMAIN.FQDN'
> ```
> and then, once they're saved in exh's database, select them for the current shell with
> ```bash
> exh set creds
> ```
> From there, the pre-filled command history (press <kbd>↑</kbd> or <kbd>Ctrl</kbd>+<kbd>R</kbd>) already references `$USER`, `$PASSWORD`, `$NT_HASH` and `$DOMAIN`.

## How it works

Exegol-history keeps all your credentials and hosts in a local database (`~/.exegol_history/exh.db` by default). Selecting an object writes the corresponding `export VAR='value'` lines into a profile file (`/opt/tools/Exegol-history/profile.sh`), which every Exegol terminal sources.

Because a running shell cannot have variables injected into it from the outside, the `exh` alias is a small wrapper function that **re-executes your shell** after the command returns, so the freshly exported variables are available immediately:

:::tabs
=== Zsh
```sh
function exh {
    exegol-history "$@" && exec zsh
}
source /opt/tools/Exegol-history/profile.sh
```
=== PowerShell
```powershell
function exh {
    exegol-history $Args; if($?) { . $profile }
}
. C:\Program Files\Exegol-history\profile.ps1
```
:::

> [!NOTE]
> This is already set up for you inside an Exegol container. The re-exec is also why, after `exh set creds`, you land in a fresh shell with the variables populated.

## Environment variables

These are the variables Exegol-history manages. They are set by `exh set creds` / `exh set hosts` (and by `add ... --set`), and cleared by `exh unset`.

| Variable      | Set by      | Value                                                        |
|---------------|-------------|-------------------------------------------------------------|
| `USER`        | `set creds` | Username of the selected credential                         |
| `PASSWORD`    | `set creds` | Password of the selected credential                         |
| `NT_HASH`     | `set creds` | Hash (NT, etc.) of the selected credential                  |
| `DOMAIN`      | `set creds` | Domain of the selected credential                           |
| `IP`          | `set hosts` | IP of the selected host                                     |
| `TARGET`      | `set hosts` | IP of the selected host (alias of `IP`)                     |
| `DB_HOSTNAME` | `set hosts` | Hostname of the selected host                               |
| `DC_HOST`     | `set hosts` | Hostname of the selected host — **only if its role is `DC`** |
| `DC_IP`       | `set hosts` | IP of the selected host — **only if its role is `DC`**       |

> [!TIP]
> Tag your domain controller with the `DC` role (`exh add hosts --ip ... -n ... -r 'DC'`). Selecting it then auto-populates `$DC_IP` and `$DC_HOST`, which most of the pre-filled Active Directory commands rely on.

Use `exh show` at any time to print the variables currently set in the shell.

## Managing credentials

Add a credential (any field is optional):
```sh
# Username + password
exh add creds -u 'Administrator' -p 'Passw0rd!'

# Username + password + NT hash + domain
exh add creds -u 'Administrator' -p 'Passw0rd!' -H 'FC525C9683E8FE067095BA2DDC971889' -d 'test.local'

# Add it and set it in the current shell in one go
exh add creds -u 'svc_sql' -p 'Summer2024!' -s
```

Select a credential to set in the current shell (opens the TUI):
```sh
exh set creds
```

Edit a credential by its id:
```sh
exh edit creds -i 3 -p 'NewPassw0rd!'
```

Remove credentials by id. Ids are comma-separated, ranges use `-`:
```sh
exh rm creds -i '5,7,8-18'
```

Clear the credential variables from the current shell:
```sh
exh unset creds
```

## Managing hosts

Add a host:
```sh
# IP only
exh add hosts --ip '192.168.56.101'

# IP + hostname + role (DC, SCCM, ADCS, WKS, MSSQL, ...)
exh add hosts --ip '192.168.56.101' -n 'DC01.test.local' -r 'DC'

# Add it and set it in the current shell
exh add hosts --ip '192.168.56.69' -n 'SRV01.test.local' -s
```

Select, edit, remove and unset hosts works the same way as credentials:
```sh
exh set hosts
exh edit hosts -i 2 -n 'DC02.test.local'
exh rm hosts -i '1,4-6'
exh unset hosts
```

## The TUI

`exh set creds` and `exh set hosts` open a Terminal User Interface to browse, add, edit, delete and export entries. The default keybindings are:

| Key              | Credentials view       | Hosts view          |
|------------------|------------------------|---------------------|
| <kbd>F1</kbd>    | Copy username          | Copy IP             |
| <kbd>F2</kbd>    | Copy password          | Copy hostname       |
| <kbd>F3</kbd>    | Copy hash              | Add host            |
| <kbd>F4</kbd>    | Add credential         | Delete host         |
| <kbd>F5</kbd>    | Delete credential      | Edit host           |
| <kbd>F6</kbd>    | Edit credential        | Export host         |
| <kbd>F7</kbd>    | Export credential      | —                   |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Quit       | Quit                |

The keybindings and the TUI theme are fully customisable, see [Configuration](#configuration).

> [!TIP]
> You can bind a terminal shortcut to open the TUI without typing. For example, with the [Kitty](https://github.com/kovidgoyal/kitty) terminal:
> ```
> map ctrl+u 'remote_control send-text "exh set creds\\n"'
> ```

## Importing

Bulk-import credentials or hosts from external tooling.

```sh
# Credentials from a CSV file
exh import creds --file creds.csv --format CSV

# Credentials from a secretsdump output
exh import creds --file secretsdump.txt --format SECRETSDUMP

# Credentials from a pypykatz JSON output
exh import creds --file pypykatz.json --format PYPYKATZ_JSON

# Credentials from a KeePass database (password and/or keyfile)
exh import creds --file secrets.kdbx --format KDBX --kdbx-password 'master' --kdbx-keyfile key.keyx

# Hosts from a CSV file
exh import hosts --file hosts.csv --format CSV
```

Supported import formats:

| Source            | Credentials | Hosts |
|-------------------|:-----------:|:-----:|
| CSV               | ✅          | ✅    |
| JSON              | ✅          | ✅    |
| KeePass (KDBX)    | ✅          | ❌    |
| Pypykatz (JSON)   | ✅          | ❌    |
| Secretsdump       | ✅          | ❌    |

> [!NOTE]
> For CSV and JSON, the expected columns/keys mirror the database schema:
> `username,password,hash,domain` for credentials and `ip,hostname,role` for hosts. The CSV delimiter is auto-detected on import.

## Exporting

```sh
# Credentials to CSV (default comma delimiter)
exh export creds --format CSV

# Credentials to JSON, written to a file
exh export creds --format JSON -f loot.json

# Mask passwords and hashes in the output
exh export creds --format CSV --redacted

# Hosts to CSV with a custom delimiter
exh export hosts --format CSV --delimiter ';'
```

Without `-f/--file`, the export is printed to stdout. Supported export formats are **CSV** and **JSON** for both credentials and hosts.

## Synchronizing

`exh sync` imports credentials and hosts discovered by other tools, so you don't have to re-enter them. Connectors are configured under `[sync.*]` in the config file.

```sh
exh sync
```

| Connector           | Status | Default source                                  |
|---------------------|:------:|-------------------------------------------------|
| NetExec             | ✅     | `~/.nxc/workspaces/` (all workspaces)           |
| Metasploit database | 🚧     | `/var/lib/postgresql/.msf4/database.yml`        |

> [!NOTE]
> When a connector has `enabled = true`, its data is also synced automatically on every `exh` invocation. Set `enabled = false` for a connector to disable that. The NetExec connector is enabled by default; the Metasploit connector is disabled by default.

## Configuration

The configuration lives in **`~/.exegol_history/config.toml`** (created automatically on first run). It controls the database name, the TUI keybindings, the sync connectors and the TUI theme.

```toml
[paths]
db_name = "exh.db"
profile_sh_path = "/opt/tools/Exegol-history/profile.sh"

# Keybinds list: https://github.com/Textualize/textual/blob/main/src/textual/keys.py
[keybindings]
copy_username_clipboard = "f1"
copy_password_clipboard = "f2"
copy_hash_clipboard = "f3"
add_credential = "f4"
delete_credential = "f5"
edit_credential = "f6"
export_credential = "f7"
copy_ip_clipboard = "f1"
copy_hostname_clipboard = "f2"
add_host = "f3"
delete_host = "f4"
edit_host = "f5"
export_host = "f6"
quit = "ctrl+c"

[sync.netexec]
enabled = true
workspace_path = "~/.nxc/workspaces/"

[sync.metasploit]
enabled = false
db_config_path = "/var/lib/postgresql/.msf4/database.yml"

[theme]
primary = "#0178D4"
secondary = "#004578"
accent = "#ffa62b"
foreground = "#e0e0e0"
success = "#4EBF71"
warning = "#ffa62b"
error = "#ba3c5b"
dark = true
```

### Displaying the current identity in your prompt

To always see which user/domain is currently selected, add the `USER` and `DOMAIN` variables to your shell prompt:

:::tabs
=== Starship
```toml
[env_var]
variable = "USER"
default = ''
style = "fg:bold red bg:#477069"
format = '[  $env_value ]($style)'
```
=== Zsh
```sh
update_prompt() {
    DB_PROMPT=""

    if [[ ! -z "${USER}" ]]; then
      DB_PROMPT="%{$fg[white]%}[%{$fg[yellow]%}${USER}%{$fg[white]%}]%{$reset_color%}"
    fi

    if [[ ! -z "${DOMAIN}" && ! -z "${USER}" ]]; then
      DB_PROMPT="%{$fg[white]%}[%{$fg[yellow]%}${USER}@${DOMAIN}%{$fg[white]%}]%{$reset_color%}"
    fi

    PROMPT="$DB_PROMPT$(prompt_char) "
}

add-zsh-hook precmd update_prompt
```
:::

## Advanced variables

The profile file sourced by Exegol terminals (`/opt/tools/Exegol-history/profile.sh`) also carries extra variables that are convenient to reference in commands (e.g. `INTERFACE`, `ATTACKER_IP`, `DOMAIN_SID`). If you have other custom variables to configure, you can manually update that file and reload your current shell with `exec $SHELL`.

## Installing outside of Exegol

`Exegol-history` is already installed in every Exegol container, but it can be installed standalone:

:::tabs
=== uv
```sh
uv tool install git+https://github.com/ThePorgs/Exegol-history
```
=== pipx
```sh
pipx install git+https://github.com/ThePorgs/Exegol-history
```
:::

Then set up the `exh` shell function as shown in [How it works](#how-it-works).
