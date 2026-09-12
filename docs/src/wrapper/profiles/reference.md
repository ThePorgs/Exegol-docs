# Profile file reference <Badge type="new"/><Badge type="pro"/>

A container profile is a single YAML file holding a named set of container-shape defaults. One file is one whole profile, the file name is the profile name, and the file is read at container creation and never again. See [Container profiles](/wrapper/profiles/) for the concepts, the licence tiers and what trusting a profile source grants; [the container profile configuration keys](/wrapper/configuration#container-profiles) for the `~/.exegol/config.yml` half of the vocabulary, which is where sources and the components directory are declared; and [the container profile options](/wrapper/cli/start#container-profile) for the command line that selects one.

This page defines every key a profile file can carry. It is the contract a profile author writes against.

## Where a profile file lives

Profiles are discovered on disk under a two-level layout:

```
<component_path>/<source>/<name>.yml
```

`component_path` is the root of that tree. It defaults to `~/.exegol/components/profiles` and is overridable through the [`config.profile.component_path`](/wrapper/configuration#container-profiles) key. The second level, `<source>`, names the collection a profile belongs to: `local` is the zero-configuration drop-in source, created on first run and needing no declaration, and any further source is declared in the configuration file. A git-backed source is refreshed by [`exegol update`](/wrapper/cli/update#modules-updates) rather than by anything on this page.

**The file name is the profile name.** A file saved as `~/.exegol/components/profiles/local/redteam.yml` defines a profile named `redteam`, and nothing inside the file restates that name.

## Every key is optional

Every key described on this page may be omitted, and omitting one is the normal case rather than an incomplete file. Omitting a key means *this profile has no opinion about that option*, leaving the value to be decided by the command line or by `~/.exegol/config.yml`.

An explicit `null` is not the same thing. It is a deliberate pin to nothing, and it is a value the profile declares. The distinction is meaningful because each tier is consulted on the **presence** of a key, not on whether the value it holds is empty: a key that is absent falls through to the next tier, while a key present with an explicit `null` stops the search at this one.

The same distinction is what the show form of the info command renders. It prints only the keys the file actually declares, so an omitted key does not appear in that output at all, while a key declared as `null` does.

There is no schema-level default anywhere in a profile file. Defaults belong to `~/.exegol/config.yml` and to the wrapper's own builtin values; a profile records what its author wrote, and nothing else. Where a table on this page states an effective default, that default comes from one of those two places rather than from the profile schema.

## Unknown keys are rejected

A key that is not part of the schema is rejected when the file is read, with an error naming the offending key. It is never silently ignored, and a misspelled key is therefore reported rather than quietly doing nothing. The rule applies with equal force to the root of the file and to every nested section: an unknown key inside `network` is refused exactly as an unknown key at the top level is.

Separately, and earlier in the process, a key that appears **twice inside the same mapping** is a parse error rather than a last-wins merge. Standard YAML parsing would resolve the duplicate by keeping the last occurrence, which would leave a declared block silently replaced by a later one, the same failure class as a dropped key, and not something a profile author should have to notice unaided.

Profile files are read with a safe YAML loader, so parsing one cannot construct arbitrary objects. That property is a parsing guarantee only; it says nothing about what the values inside a profile go on to configure.

## Profiles never carry credentials

No field anywhere in this schema accepts credential **contents**. The two VPN fields name a file on the operator's own disk by path, and the file itself is never inlined into the profile: not a user name, not a secret, not a token, not key material.

The consequence is the point of the rule. A profile file is meant to be shared, committed and reviewed like any other configuration artifact, and a single field able to carry a credential would turn every shared profile into a credential store. Keeping the whole schema to paths is what makes a profile safe to hand to someone else.

The wrapper's own licence credentials are structurally outside the set of things a profile can set, so no profile field can supply them even indirectly.

## Editor completion and validation

A JSON Schema is published for profile files, so an editor running a YAML language server can offer key completion and flag an unknown key while the file is being written rather than at load time. Wiring it up is one comment line at the top of the profile.

The annotated template checked into the Exegol repository carries this form:

```yaml
# yaml-language-server: $schema=./container-profile.schema.json
```

That path is **repository-relative**. It resolves only while the file sits beside the checked-in schema artifact, which is not where a real profile lives: a profile under `~/.exegol/components/profiles/local/` has no `container-profile.schema.json` next to it, and the editor silently offers nothing. A profile author should use the absolute form instead, which resolves from any location:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/ThePorgs/Exegol/master/schemas/container-profile.schema.json
```

Two artifacts are maintained in the repository and are worth reading directly rather than being reproduced here:

- [The annotated profile template](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.example.yml): a complete, commented profile covering every section, kept in step with the schema automatically.
- [The JSON Schema](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.schema.json): the artifact the line above points at, generated from the same models this page documents.

Both live in the `schemas/` directory of the Exegol repository. That directory is a repository directory and is **not** installed by `pip install exegol`, so a normal installation leaves no local copy to point an editor at, which is why the absolute form above names the file over HTTPS rather than on disk.

## Sections

Keys are grouped into sections that mirror the option groups of `exegol start`, so an option known from the command line is found without a lookup table. Every key below is optional, at every level: a section may be omitted entirely, and a section that is present may declare as few of its keys as the author wants. Where an effective default exists it is stated as the first words of the Meaning cell: those defaults come from `~/.exegol/config.yml` or from the wrapper's builtin values, never from the profile schema itself.

Each section below shows the keys in isolation. For a single complete file declaring every section at once, read [the annotated template](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.example.yml) rather than assembling the snippets by hand.

### `version`

Metadata about the shape of the file rather than a container-shape default. It exists so that a future structural change (a renamed field, a reshaped section) has somewhere to record which shape a given file was written against.

```yaml
version: 1
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `version` | integer | none | Default **1**, which is the only version that exists today. Omitting the key means version 1 |

### `image`

Which image a container is created from, and which extra image names the wrapper recognises.

```yaml
image:
  tag: full
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `image.tag` | string | `IMAGE` positional | The Exegol image a container is created from, the same value as the image positional of `exegol start <CONTAINER> <IMAGE>` |
| `image.custom_images` | list of strings | none | Overrides `config.custom_images` in `~/.exegol/config.yml`. Image names recognised in addition to the official ones |

### `network`

How the container is attached to the network, which ports it publishes, and what it resolves.

```yaml
network:
  mode: nat
  ports:
    - "127.0.0.1:8080:8080"
  hostname: exegol-redteam
  hosts:
    dc01.acme.corp: 10.10.0.10
  default_netmask: 28
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `network.mode` | string | `--network` | Network attachment: `nat`, `docker`, `disabled`, `host`, or the name of an existing Docker network. A value outside the known set produces a **warning rather than a rejection**, because an unrecognised name is treated as a Docker network to attach to and is a legitimate use of the field: the warning exists so that a typo is not mistaken for one. A name matching no existing network is created on the host rather than matched, and Exegol reclaims only the network it manages for `nat`, so a typo leaves both a container isolated on a network of its own and a host network named after the typo |
| `network.ports` | list of strings | `-p`, `--port` | Ports published from the container to the host, one entry per mapping, in the form `[<host_ipv4>:]<host_port>[-<end_port>][:<container_port>[-<end_port>]][:<proto>]`. Declaring any port disables the default host network |
| `network.hostname` | string | `--hostname` | Default `exegol-<container name>`. The container's hostname |
| `network.hosts_file` | string | `--hosts-file` | Path to a file on the host in `IP HOSTNAME` format, whose entries are imported into the container |
| `network.hosts` | mapping of string to string | none | Host entries declared inline, hostname to address. Merged with `network.hosts_file`, and on a colliding hostname the entry declared here wins. A list of `"hostname=address"` strings is accepted as an alternate shape and normalised to the mapping. Each hostname must be non-empty and free of whitespace, and each value must parse as an IP address |
| `network.dedicated_range` | string | none | Overrides `config.network.exegol_dedicated_range` in `~/.exegol/config.yml`. The address range dedicated container networks are carved out of |
| `network.default_netmask` | integer, **1 to 32** | none | Overrides `config.network.exegol_default_netmask` in `~/.exegol/config.yml`. The netmask of each dedicated container network. A value outside the range is rejected rather than clamped |

### `volumes`

What is mounted into the container, and from where on the host.

```yaml
volumes:
  mounts:
    - /home/user/engagements/acme/loot/:/opt/loot/:rw
  workspace_path: /home/user/engagements/acme
  share_exegol_resources: true
  update_fs_perms: false
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `volumes.mounts` | list of strings | `-V`, `--volume` | Additional volumes shared between host and container, one entry per mount, in the form `/path/on/host/:/path/in/container/[:ro\|rw]` |
| `volumes.workspace_path` | string | `-w`, `--workspace` | Host directory linked to `/workspace` inside the container |
| `volumes.share_exegol_resources` | boolean | `--exegol-resources`, `--no-exegol-resources` | Whether the Exegol resources volume is mounted from the host at `/opt/resources` |
| `volumes.update_fs_perms` | boolean | `-fs`, `--update-fs`, `--no-update-fs` | Whether the permissions of the workspace directories are rewritten so that files created inside the container stay usable by the host user. This changes permissions **on the host** |
| `volumes.exegol_resources_path` | string, host path | none | Overrides `volumes.exegol_resources_path` in `~/.exegol/config.yml`. Where the Exegol resources volume lives on the host |
| `volumes.private_workspace_path` | string, host path | none | Overrides `volumes.private_workspace_path` in `~/.exegol/config.yml`. Where per-container workspaces are created when none is named |

Every host path a profile can set is constrained, and the constraint is the same in each case: a **relative** path is refused, because it would resolve against whatever directory the wrapper happened to be launched from; the **filesystem root** is refused; and the **home directory, or any ancestor of it**, is refused. A path that survives those checks is accepted as written. This is what separates naming a directory in a shareable profile from inheriting one implicitly, and it is why there is no profile key for mounting the current working directory: that option is deliberately and permanently absent from this schema.

### `customization`

The my-resources volume: the operator's personal tool and environment customisation layer, kept separate from the engagement-scoped mounts in `volumes`.

```yaml
customization:
  share_my_resources: true
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `customization.share_my_resources` | boolean | `--my-resources`, `--no-my-resources` | Whether the my-resources volume is mounted from the host at `/opt/my-resources` |
| `customization.my_resources_path` | string, host path | none | Overrides `volumes.my_resources_path` in `~/.exegol/config.yml`. Subject to the host-path refusals described above, and additionally: the named directory is created if absent and its permissions are changed **recursively** so that the container user can write into it. Naming a directory whose permissions should not be rewritten is therefore the one thing to avoid here |

### `display`

GUI sharing: X11 passthrough and the Exegol desktop.

```yaml
display:
  share_x11: true
  desktop:
    enabled: false
    proto: http
    listen_ip: 127.0.0.1
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `display.share_x11` | boolean | `--gui`, `--no-gui` | Whether the host GUI is shared so that graphical tools can display, whether the session is X11 or Wayland. The field name and the option name are the same setting: the option was renamed to `--gui` when Wayland support landed, and the key was deliberately left as written so that profile files already on disk keep working |
| `display.desktop.enabled` | boolean | `--desktop`, `--no-desktop` | Whether the Exegol desktop starts with the container. Enabling it publishes a remote-desktop port |
| `display.desktop.proto` | string | `--desktop-config` | The desktop protocol, `http` or `vnc` |
| `display.desktop.listen_ip` | string | `--desktop-config` | The address the desktop service binds to. `0.0.0.0` exposes it on every host interface, so a loopback address is the conservative value |
| `display.desktop.port` | integer, **1 to 65535** | `--desktop-config` | Default: the protocol's own default port. The port the desktop service is published on |

### `vpn`

A VPN connection established at container creation. Both keys are **paths**, and this section is where the rule stated in [Profiles never carry credentials](#profiles-never-carry-credentials) becomes concrete.

```yaml
vpn:
  config: /home/user/vpn/client.ovpn
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `vpn.config` | string, path | `--vpn` | Path to an OpenVPN (`.ovpn`) or WireGuard (`.conf`) configuration file to connect at container creation. A path to a file, never the configuration text itself |
| `vpn.auth_file` | string, path | `--vpn-auth` | Path to a credentials **file** used for an unattended OpenVPN connection. The value is the location of that file and never a credential value; the file itself stays on the operator's own disk and is not part of the profile |

Neither key is expanded and neither is checked for existence when the profile is read: `~` and environment variables are left as written, and whether the file exists is decided when the container is created. A profile is read by surfaces that merely list or display it, where resolving paths belonging to another machine would be both wrong and noisy.

### `shell`

Which shell opens in the container, and the environment it starts with.

```yaml
shell:
  default: zsh
  env:
    - "HTTP_PROXY=http://127.0.0.1:8080"
    - "TARGET_DOMAIN=corp.example.com"
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `shell.default` | string | `-s`, `--shell` | Defaults to `config.default_start_shell` in `~/.exegol/config.yml`. The shell started on entering the container: `bash`, `tmux` or `zsh`. A value outside that set produces a **warning rather than a rejection**: the profile still loads and the value is kept as written, and the warning exists so that a typo is reported instead of being carried silently |
| `shell.env` | list of strings | `-e`, `--env` | Environment variables set in the container, one `KEY=value` string per entry. A mapping of names to values is accepted as an alternate shape and normalised into that list; the list is the canonical form, because the reverse conversion would lose a repeated name or a value containing an `=` sign |

Environment variables are one of the list-valued options, so they are **concatenated** across tiers rather than replaced: entries declared here are added to those typed on the command line rather than displaced by them. Every variable declared here reaches every shell of the container, which makes the section a place for configuration and never for a secret: nothing in the schema enforces that, and it is the authoring half of [Profiles never carry credentials](#profiles-never-carry-credentials).

### `logging`

Shell logging: the recording of terminal sessions into the container's workspace. This is the session recorder, and it is a different feature from the audit logging configured in the [`sentinel`](#sentinel) section below.

```yaml
logging:
  enabled: true
  method: asciinema
  compress: true
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `logging.enabled` | boolean | `-l`, `--log`, `--no-log` | Defaults to `config.shell_logging.always_enable` in `~/.exegol/config.yml`. Whether commands and their output are recorded to `/workspace/logs/` |
| `logging.method` | string | `--log-method` | Defaults to `config.shell_logging.logging_method` in `~/.exegol/config.yml`. How a session is recorded: `asciinema` or `script`. A value outside that set produces a **warning rather than a rejection**, on the same typo-detection basis as `shell.default` |
| `logging.compress` | boolean | `--log-compress`, `--no-log-compress` | Defaults to `config.shell_logging.enable_log_compression` in `~/.exegol/config.yml`. Whether each log file is compressed with gzip once the session ends |

What each recording method captures, and how the resulting files are read back, is described under [Shell logging](/wrapper/#shell-logging) on the wrapper overview.

### `system`

> [!WARNING] Three keys in this section widen what a container may do on the host, and a profile applies them without asking
> Privileged mode grants the container the full set of administrative privileges, which in practice removes the container boundary. Each Linux capability added here grants one named piece of that same authority. Each host device passed through exposes a piece of the host's hardware directly inside the container. All three are applied exactly as the profile declares them at container creation: there is no confirmation step and no prompt anywhere in that path. A profile that came from a source someone else controls should therefore be read before it is used: `exegol info --profiles <name>` prints exactly what a profile declares and nothing it does not. See [A profile source is a dependency](/wrapper/profiles/#a-profile-source-is-a-dependency) for what declaring a source grants its authors.

Host sharing and container privileges: what the container is allowed to see and to do on the machine it runs on.

```yaml
system:
  share_timezone: true
  # privileged: true
  # devices:
  #   - /dev/ttyACM0
  # capabilities:
  #   - NET_ADMIN
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `system.share_timezone` | boolean | `--share-timezone`, `--no-share-timezone` | Whether the host's time and timezone configuration is shared with the container |
| `system.privileged` | boolean | `--privileged`, `--no-privileged` | **Widening.** Whether the container is created with the full set of administrative privileges. A single named capability below is the narrower answer to a specific need |
| `system.devices` | list of strings | `-d`, `--device` | **Widening.** Host devices exposed inside the container, one device path per entry |
| `system.capabilities` | list of strings | `--cap` | **Widening.** Extra Linux capabilities granted to the container, one per entry, from `NET_ADMIN`, `NET_BROADCAST`, `SYS_MODULE`, `SYS_PTRACE`, `SYS_RAWIO`, `SYS_ADMIN`, `LINUX_IMMUTABLE`, `MAC_ADMIN`, `SYSLOG` and `ALL`. `ALL` is equivalent to privileged mode. An entry outside that set is **warned about when the profile is read and then rejected when the container is created**: the profile loads with a check-for-a-typo warning naming the unrecognised entries, the entry is then passed to the Docker daemon unchanged, and the daemon refuses it, so container creation aborts |

Devices and capabilities are list-valued, so like environment variables and volume mounts they are **concatenated** across tiers: what a profile declares is added to what the command line declares, and there is no command-line way to subtract an entry a profile carries. Only `system.privileged` is a scalar, where the highest tier with an opinion wins outright.

### `sentinel` <Badge type="enterprise"/><Badge type="add-on"/>

Audit logging. [Exegol Sentinel](/sentinel/) is an Enterprise feature, licensed separately from the wrapper, that records a structured audit event for every command run interactively in a container. This section is the one part of a container profile that requires it: container profiles themselves need only a Professional licence, and the badges above mark the difference.

A container profile decides **whether** audit logging runs and **which** audit profile it uses, and stops there.

```yaml
sentinel:
  enabled: true
  profile: engagement-audit
  update_strategy: on_restart
  gid: -1
  log_rotation:
    enabled: true
    max_size: "100MB"
    max_files: 0
    compress: true
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `sentinel.enabled` | boolean | `-S`, `--sentinel`, `--no-sentinel` | Whether audit logging runs in the container. Strictly an on/off switch: which audit profile is used is the separate `sentinel.profile` key below. Defaults to `config.sentinel.enabled_by_default` in `~/.exegol/config.yml`, but only when this profile names no audit profile either and no `-SP` is typed: a `sentinel.profile` with `sentinel.enabled` omitted runs audit logging regardless of that configuration key, provided that name is not empty, and a `-SP` typed on the command line out-ranks a container profile's `sentinel.enabled` whether that key is written true or false, silently and per the four combinations in the row below; only `--no-sentinel` refuses a `-SP`, whatever a container profile writes for this key, warning when both are typed that the audit profile named with `-SP` is not applied |
| `sentinel.profile` | string | `-SP`, `--sentinel-profile` | Names a **Sentinel audit profile**, which is a different kind of profile from the one this page documents and is never a container profile. This key and `enabled` are read together, in four combinations: `enabled: true` with no `profile` runs audit logging under the default audit profile; `enabled: true` with a `profile` runs it under that named one; **a `profile` with `enabled` omitted also runs audit logging, under that named profile (naming an audit profile enables the feature by doing so)**; and `enabled: false` is disabled regardless of what `profile` says, silently and with no warning, unlike the same contradiction typed on the command line |
| `sentinel.update_strategy` | string | `--sentinel-strategy` | Defaults to `config.sentinel.update_strategy` in `~/.exegol/config.yml`. When a container's audit configuration is refreshed from the host: `on_restart` or `disabled`. A value outside that set is **warned about when the profile is read and then rejected when the container is created**: the profile loads with a check-for-a-typo warning, and creation aborts as soon as Sentinel is enabled for that container |
| `sentinel.gid` | integer | none | Overrides `config.sentinel.log_group_gid` in `~/.exegol/config.yml`. The host group id allowed to read the audit logs, for a log shipper that runs under a different group. `-1` means the group of the user running Exegol |
| `sentinel.sentinel_logs_host_path` | string, host path | none | Overrides `volumes.sentinel_path` in `~/.exegol/config.yml`. Where audit logs are written **on the host**. Subject to the host-path refusals described under [`volumes`](#volumes) |
| `sentinel.log_rotation.enabled` | boolean | none | Overrides `config.sentinel.log_rotation.enabled` in `~/.exegol/config.yml`. Whether the audit log file is rotated automatically |
| `sentinel.log_rotation.max_size` | string | none | Overrides `config.sentinel.log_rotation.max_size` in `~/.exegol/config.yml`. The size at which the log is rotated, written either as a quoted plain byte count (`"104857600"`) or as a quoted string with a unit suffix (`"100MB"`, `"512K"`, `"2GB"`), case-insensitive, with `K`, `M`, `G` and `T` as powers of 1024. The field is typed as a string, so an **unquoted** integer is rejected. The value must resolve to a strictly positive number of bytes; one that resolves to zero or less, or that cannot be parsed at all, is reported and Exegol's own `100MB` default is used instead, not the value in `~/.exegol/config.yml`, which this key shadows whether or not its value survives validation |
| `sentinel.log_rotation.max_files` | integer | none | Overrides `config.sentinel.log_rotation.max_files` in `~/.exegol/config.yml`. How many rotated files are kept. **`0` keeps all of them** |
| `sentinel.log_rotation.compress` | boolean | none | Overrides `config.sentinel.log_rotation.compress` in `~/.exegol/config.yml`. Whether rotated files are compressed with gzip |

The keys are listed here because they are keys of a container profile. What each one actually does (what an audit event contains, what an audit profile changes, how the log stream is consumed) is documented once, in the Sentinel documentation, and is not repeated on this page. Read it at [Sentinel configuration](/sentinel/configuration), starting from [Exegol Sentinel](/sentinel/) for the feature as a whole.

### `metadata`

A free-form annotation carried onto the container.

```yaml
metadata:
  comment: "Red team engagement - isolated network, session logging on"
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `metadata.comment` | string | `--comment` | A note attached to the container and shown by `exegol info`. It is also the value of the **Comment** column in the profile listing and in the interactive picker, which is what makes a profile identifiable there without opening the file |

## What a profile may override in the configuration file

Three tiers can answer for the same option, in one fixed order: the command line wins, then the profile, then `~/.exegol/config.yml`. Most of the keys tabled above correspond to an `exegol start` option, so declaring one in a profile pre-answers something that could have been typed instead. Two of them correspond to nothing outside a profile at all: `version`, which describes the file rather than the container, and `network.hosts`, whose inline host entries have neither a command-line option nor a `~/.exegol/config.yml` setting.

The twelve keys below are the remaining exception, and they are the complete set of the keys whose value can otherwise come only from `~/.exegol/config.yml`. None has a command-line option at all, so declaring one in a profile replaces that persistent setting, for the container being created, and at creation only. Each setting is named here by its **configuration-file key path**, exactly as `~/.exegol/config.yml` spells it and as [the wrapper configuration reference](/wrapper/configuration#configuration-file) describes it. For several of these pairs the two spellings deliberately do not correspond: the profile key and the configuration-file key sit in different sections, or carry a different name outright. That is why the pairing is listed explicitly rather than left to be inferred from the names.

| Profile key | Setting it replaces | Notes |
| ----------- | ------------------- | ----- |
| `image.custom_images` | `config.custom_images` | Image names recognised in addition to the official ones. See [`image`](#image) |
| `network.dedicated_range` | `config.network.exegol_dedicated_range` | The address range dedicated container networks are carved out of. See [`network`](#network) |
| `network.default_netmask` | `config.network.exegol_default_netmask` | The netmask of each dedicated container network. See [`network`](#network) |
| `customization.my_resources_path` | `volumes.my_resources_path` | **Host path.** Different section on each side. This is the one whose permissions are changed recursively (see [`customization`](#customization)) |
| `volumes.exegol_resources_path` | `volumes.exegol_resources_path` | **Host path.** See [`volumes`](#volumes) |
| `volumes.private_workspace_path` | `volumes.private_workspace_path` | **Host path.** See [`volumes`](#volumes) |
| `sentinel.gid` | `config.sentinel.log_group_gid` | Different name on each side. See [`sentinel`](#sentinel) |
| `sentinel.sentinel_logs_host_path` | `volumes.sentinel_path` | **Host path.** Different section *and* different name on each side. See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.enabled` | `config.sentinel.log_rotation.enabled` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.max_size` | `config.sentinel.log_rotation.max_size` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.max_files` | `config.sentinel.log_rotation.max_files` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.compress` | `config.sentinel.log_rotation.compress` | See [`sentinel`](#sentinel) |

Every host path in that table is subject to the refusal set described under [`volumes`](#volumes): a relative path, the filesystem root, and the home directory or any ancestor of it are all refused.

## What a profile may never set

Some settings are deliberately outside what a profile can reach at all, and they fall into three families: a setting that is the fallback half of something a profile already controls directly; a setting that governs how the wrapper behaves on the host rather than how a container is shaped; and a setting that decides where profiles are found in the first place.

| Setting | Why a profile cannot set it |
| ------- | --------------------------- |
| `config.desktop.default_protocol` | The fallback the desktop protocol falls back to when nothing chooses one. A profile already chooses it outright through `display.desktop.proto`, and one file owning both the choice and the fallback behind it is one file able to disagree with itself |
| `config.desktop.localhost_by_default` | The fallback for the address the desktop service binds to, which a profile already sets outright through `display.desktop.listen_ip`. The same reason as the protocol above |
| `config.sentinel.default_profile` | The persistent audit profile used when nothing names one. A profile names the audit profile it wants through `sentinel.profile`, so this setting is the fallback behind a choice the profile has already made |
| `volumes.exegol_images_path` | Where image sources are kept on this machine. It shapes how the host builds and updates images, and nothing about how a container is configured |
| `config.auto_remove_image` | Whether this host removes outdated images once nothing uses them. It is a disk-lifecycle policy for the machine, and a shared file able to set it could delete images its reader still wanted |
| `config.auto_check_update` | Whether the wrapper checks for its own updates on startup. It governs what an invocation does before any container exists |
| `config.enable_exegol_resources` | Whether Exegol resources are enabled on this host. The wrapper reads it only to decide whether to warn once a resources download has failed, so it answers a host-level question. The container-shape half (whether the resources volume is mounted) is `volumes.share_exegol_resources`, which a profile does control, and keeping the two apart is what stops the host-level flag from out-ranking the container-shape one |
| `config.sentinel.component_path` | Where Sentinel audit profiles are discovered. A profile able to move it would decide which audit profiles exist to be read |
| `config.profile.component_path` | Where container profiles themselves are discovered. A profile able to move it would decide which profiles are readable next, including its own replacement |
| `config.sentinel.sources` | The declared sources Sentinel audit profiles are fetched from. A shareable file able to set it would choose which remote repository the machine pulls audit-profile content from |
| `config.profile.sources` | The declared sources container profiles themselves are fetched from, and the sharpest case of the three: a profile able to set it would name the remote its own successor arrives from, and a container profile fetched from a remote someone else chose sets privileged mode, Linux capabilities, host bind-mounts and the network mode directly |

One further category is never settable and is not tabled, because it is not made of configuration-file settings at all: the per-invocation command-line options (the quiet and verbosity flags, the exec flag, the force flag, the offline flag, the licence credential flags and the rest) are outside a profile's reach by construction, because a profile shapes a container and does not drive a command.
