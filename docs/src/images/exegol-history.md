# Exegol-history

`Exegol-history` is a tool to quickly store and retrieve compromised credentials and hosts; the goal is to ease the management of credentials and hosts during a penetration testing engagement or a CTF.

Once an asset is selected from the TUI, the information can be accessed through environment variables and doesn't need to be typed over and over.

The tool can be used with the alias `exh`.

## Examples
### Interactively select a credential
```sh
exh set creds
```

### Show the current environnment variables
```sh
exh show
```

### Add a credential
```sh
exh add creds -u 'Administrator' -p 'Passw0rd!' -H 'FC525C9683E8FE067095BA2DDC971889' -d 'test.local'
```

### Add a host
```sh
exh add hosts --ip '127.0.0.1' -n 'dc.test.local' -r 'DC'

### Import multiple credentials from a CSV file
```sh
exh import creds --file creds.csv --format CSV
```

## Configuration
A small configuration file `config.toml` can be used to customise the database name, keybinds and theme for the TUI, here is an example of a configuration file:
```toml
[paths]
db_name = "DB.kdbx"
db_key_name = "db.key"
profile_sh_path = "/opt/tools/Exegol-history/profile.sh"

# Keybinds list: https://github.com/Textualize/textual/blob/8f85ece761031a756a1ecfa345b519c9c915e04b/src/textual/keys.py#L9
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

[theme]
primary = "#0178D4"
secondary = "#004578"
accent = "#ffa62b"
foreground = "#e0e0e0"
# background = ""
success = "#4EBF71"
warning = "#ffa62b"
error = "#ba3c5b"
# surface = ""
# panel = ""
dark = true
clipboard_icon = "📋"
add_icon = "➕"
delete_icon = "🗑️"
edit_icon = "📝"
export_icon = "📤"
```

