# Exegol-history

`Exegol-history` is a tool to quickly store and retrieve compromised credentials and hosts; the goal is to ease the management of credentials and hosts during a penetration testing engagement or a CTF.

Once an asset is selected from the TUI, the information can be accessed through environment variables and doesn't need to be typed over and over. Combined with Exegol's pre-filled command history, this becomes a very powerful process.

The tool can be used with the alias `exh` or with `exegol-history`.

> [!TIP] TL; DR
> When obtaining new credentials, the process usually goes like this
> ```bash
> exh add creds -u 'USER' -p 'PASSWORD' -H 'NT_HASH_if_any' -d 'DOMAIN.FQDN'
> ```
> and then, once they're saved in exh's db, set them for the current shell with
> ```bash
> exh set creds
> ```

## Examples

Interactively select a credential to set in the current shell
```sh
exh set creds
```

Show the current shell's environnment variables (in the context of Exegol history)
```sh
exh show
```

Add a credential
```sh
exh add creds -u 'Administrator' -p 'Passw0rd!' -H 'FC525C9683E8FE067095BA2DDC971889' -d 'test.local'
```

Add a host
```sh
exh add hosts --ip '127.0.0.1' -n 'dc.test.local' -r 'DC'
```

Import multiple credentials from a CSV file
```sh
exh import creds --file creds.csv --format CSV
```

## Configuration (advanced)
The `config.toml` file can be used to customise the database name, keybinds and theme for the TUI.
The file can be found on the GitHub repo of the Exegol-history project, [go to file](https://github.com/ThePorgs/Exegol-history/blob/main/exegol_history/config/config.toml).