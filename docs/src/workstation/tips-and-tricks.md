# Tips & tricks

Shortcuts **inside a running Exegol container**. For “can I…?” see [FAQ](/workstation/faq). For a broken install, see [Troubleshooting](/workstation/troubleshooting).

Host procedures (offline image transfer, activation) live on the [activate](/wrapper/cli/activate) page.

## Time / Kerberos

### Change a container's time

Changing a container's time with `date` requires elevated permissions on
the container, and messes up with the host's time. There is however and
alternative, using `faketime` (see [faketime ubuntu
manpage](https://manpages.ubuntu.com/manpages/trusty/man1/faketime.1.html))
that allows to change the time of the container easily, without needing
particular permissions, without affecting the host. This is especially
useful when working with Kerberos targets that are out of sync.

Faketime manipulates the system time for a given child command. For
example with `zsh`, a new shell is opened with a spoofed time that will
only be spoofed for this exact shell session and commands executed in
it.

``` bash
faketime 'YYYY-MM-DD hh:mm:ss' zsh
```

The following examples automate the synchronization of a remote domain
controller's clock to initiate a corresponding zsh session.

``` bash
faketime "$(rdate -n $DC_IP -p | awk '{print $2, $3, $4}' | date -f - "+%Y-%m-%d %H:%M:%S")" zsh
```

``` bash
faketime "$(date +'%Y-%m-%d') $(net time -S $DC_IP | awk '{print $4}')"
```

> [!NOTE]
> Here is an example of how `faketime` can be used.
>
> When doing Active Directory attacks against Kerberos targets, a clock
> skew error could be raised such as `KRB_AP_ERR_SKEW`. This means the
> authenticating machine (operator) and the destination (Key
> Distribution Center, a.k.a. KDC) are not in sync, clock-wise.
>
> Running any [Impacket](https://github.com/fortra/impacket) with the
> `-debug` flag will print the server time. The operator can then use
> `faketime` to open a new `zsh` shell with the right time and timezone
> and conduct the scenario as previously intended.
>
> The following command can be used to print the time in UTC format and
> compare it with the server time: `date --utc`.
>
> *Note: careful with the timezones. If they differ between the operator
> and the KDC, the delta needs to be taken into account*

## Shell

### Dynamic history commands

Many commands in the pre-filled history rely on environment variables
such as `$DOMAIN`, `$USER`, `$PASSWORD`, etc. Those variables can be set using the [Exegol-history](/images/exegol-history) utility `exh`, or by manually using the `/opt/tools/Exegol-history/profile.sh` file. The proper lines can be filled and
uncommented, and then the shell can be reloaded with `exec zsh` in order
to apply the changes. This allows users to easily look for, and use,
commands in the history, without changing the values every time.

### Keyboard shortcuts

- `ctrl+q`: when writing a command, let's say a user misses an
  information (e.g. IP address). The shortcut can be used to save the
  half-typed command, look for the value, and then finish the command.
  The user doesn't have to cancel the command, look for the info, and
  write the command all over again. This is known as the `push-line`
  feature (see
  [sgeb.io](https://sgeb.io/posts/bash-zsh-half-typed-commands/)).
- `ctrl + r`: look for something in the history
- `ctrl + t`: look for a file or directory with a fuzzy finder
- `ctrl + a`: move to the beginning of the line
- `ctrl + e`: move to the end of the line
- `ctrl + ←`: move one word backward
- `ctrl + →`: move one word forward
- `ctrl + l`: clear the screen

## Sharing files

### Share files or notes with targets and collaborators

The following tools or commands can be used to pop a temporary file or
http server: `updog`, `goshs`, `http-server`, `http-put-server`,
`ftp-server`, `smbserver.py`.

In order to **shares notes** during an engagement, `trilium`
(<https://github.com/TriliumNext/Trilium>) can be used.

Aliases `http-server` and `http-put-server` are listed under [Useful aliases](#useful-aliases).

## Reverse shells

### The best reverse shells

- `shellerator` can be used to generate a reverse-shell command dynamically.
- On the attacker's side, a reverse shell obtained through a `netcat` tunnel can be improved (see [ropnop.com](https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/) or [0xffsec.com](https://0xffsec.com/handbook/shells/full-tty/)).
- A simple alternative to upgrading a netcat reverse shell is to use `rlwrap <netcat listener command>`.
- Instead of using `netcat` and "upgrading" the shell manually, `pwncat-vl` ([Chocapikk/pwncat-vl](https://github.com/Chocapikk/pwncat-vl)) can be used to obtain an even better reverse-shell experience, especially with UNIX-like targets.

## Aliases

### Useful aliases

> [!SUCCESS] Tip
> To see every alias in your exegol image, run `alias`. To expand one, `alias <alias_name>`.
>
> Some aliases are not available before image `3.1.5`.

| Alias | Does |
| ----- | ---- |
| `ipa` | List network interfaces, short and colourful |
| `ipr` | List network routes, short and colourful |
| `pc` | Shortcut to `proxychains` |
| `ncvz` | Test an open TCP port |
| `ws` | `cd /workspace` |
| `_` | `sudo` |
| `xcopy` | Copy a file to clipboard |
| `xpaste` | Create a file from clipboard |
| `xshow` | Print clipboard |
| `sed-empty-line` | Remove empty lines |
| `sed-comment-line` | Remove commented lines |
| `history-dump` | Export full command history with date and time |
| `http-put-server` | Python web server, PUT capable |
| `http-server` | Classic Python web server |
| `php-server` | PHP web server on the current directory, port 8080 |
| `hcat` | hashcat format solver with fuzzy-finder wordlist |
| `hjohn` | john the ripper format solver with fuzzy-finder wordlist |
| `scan-range` | Nmap shortcut to find hosts in a range |
| `nse` | Find an nmap NSE script |
| `urlencode` | Encode arguments as a URL |
| `urldecode` | Decode URL arguments |

### Network related

See the Network rows in [Useful aliases](#useful-aliases).

### Shell

See the Shell rows in [Useful aliases](#useful-aliases).

### Quick service

See the service rows in [Useful aliases](#useful-aliases).

### Tools optimization

See the tools rows in [Useful aliases](#useful-aliases).

## Host

### Rename a container

```bash
docker rename "exegol-oldname" "exegol-newname"
```

> [!WARNING]
> Keep the `exegol-` prefix.

### Transferring images to an offline machine

A never-connected machine cannot pull images. Transfer them from an Internet-facing host; the steps are on [activate → Transferring images to an offline machine](/wrapper/cli/activate#transferring-images-to-an-offline-machine).
