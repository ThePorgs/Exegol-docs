# Profile file reference <Badge type="new"/><Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Every key a container profile file can carry. One file is one whole profile, the file name is the profile name, and the file is read at container creation only.

For concepts, precedence and sources, see [Container profiles](/wrapper/profiles/). For where sources and `component_path` are declared, see [user config](/wrapper/configuration#container-profiles). For the flags that select a profile, see [start](/wrapper/cli/start#container-profile).

## Where a profile file lives

```
<component_path>/<source>/<name>.yml
```

`component_path` defaults to `~/.exegol/components/profiles` ([user config](/wrapper/configuration#container-profiles)). `<source>` is the collection (`local` needs no declaration; others are declared in the [user config](/wrapper/configuration)). Git sources are refreshed by [`exegol update`](/wrapper/cli/update#modules-updates).

A file at `~/.exegol/components/profiles/local/redteam.yml` defines the profile `redteam`. Nothing inside the file restates that name.

## Authoring rules

- **Every key is optional.** Omitting a key means the profile has no opinion; the [CLI](/wrapper/cli/start) or [user config](/wrapper/configuration) decides. An explicit `null` is different: it pins the option to nothing and stops the search. `exegol info --profile <name>` prints only declared keys, including `null`.
- **Unknown keys are rejected** when the file is read, with an error naming the key. Same rule at the root and inside every nested section. A key duplicated inside one mapping is a parse error, not a last-wins merge.
- **No credentials.** VPN fields are paths to files on the operator's disk, never inline secrets. That is what makes a profile safe to share and commit.
- Defaults live in the [user config](/wrapper/configuration) and in the wrapper's builtins, never in the profile schema. Where a table below states an effective default, it comes from one of those two places.

> [!NOTE] Safe YAML loader
> Profile files are read with a safe YAML loader, so parsing cannot construct arbitrary objects. That is a parsing guarantee only; it says nothing about what the values go on to configure.

## Editor completion

A JSON Schema is published for key completion and validation in editors that run a YAML language server. Add one comment at the top of the profile:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/ThePorgs/Exegol/master/schemas/container-profile.schema.json
```

Use that absolute URL. A repository-relative `./container-profile.schema.json` only works next to the checked-in schema, not under `~/.exegol/components/profiles/`.

Two artifacts in the Exegol repository `schemas/` directory (not installed by `pip install exegol`):

- [Annotated profile template](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.example.yml) — every section, commented, kept in step with the schema
- [JSON Schema](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.schema.json) — the file the comment above points at

## Sections

Keys are grouped like the option groups of `exegol start`. A section may be omitted entirely; a present section may declare as few keys as needed. For a single file with every section, use [the annotated template](https://github.com/ThePorgs/Exegol/blob/master/schemas/container-profile.example.yml).

### `version`

Metadata about the file shape, not a container default.

```yaml
version: 1
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `version` | integer | none | Default **1** (only version today). Omitting the key means version 1 |

### `image`

Which image the container is created from.

```yaml
image:
  tag: full
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `image.tag` | string | `IMAGE` positional | The Exegol image, same value as `exegol start <CONTAINER> <IMAGE>` |
| `image.custom_images` | list of strings | none | Overrides `config.custom_images` in the [user config](/wrapper/configuration). Extra image names beyond the official ones |

### `network`

Network attachment, published ports, and name resolution.

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
| `network.mode` | string | `--network` | `nat`, `docker`, `disabled`, `host`, or an existing Docker network name. An unrecognised name is treated as a Docker network to attach to (**warning**, not rejection); if it matches nothing, a new host network is created under that name |
| `network.ports` | list of strings | `-p`, `--port` | Host↔container port mappings, one per entry: `[<host_ipv4>:]<host_port>[-<end_port>][:<container_port>[-<end_port>]][:<proto>]`. Any declared port disables the default host network |
| `network.hostname` | string | `--hostname` | Default `exegol-<container name>` |
| `network.hostname_ask_user` | boolean | none | When true, creating a container from this profile asks the operator for the hostname and offers `network.hostname` as the default. A value given with `--hostname` answers the question and no prompt appears. When stdin cannot answer, as in a piped or scripted run, no prompt appears and the value that would otherwise apply is used |
| `network.hosts_file` | string | `--hosts-file` | Host path to a file in `IP HOSTNAME` format, imported into the container |
| `network.hosts` | mapping of string to string | none | Inline hostname→address entries. Merged with `hosts_file`; on collision, this mapping wins. A list of `"hostname=address"` strings is also accepted. Hostnames must be non-empty and free of whitespace; values must be IPs |
| `network.dedicated_range` | string | none | Overrides `config.network.exegol_dedicated_range`. Address range for dedicated container networks |
| `network.default_netmask` | integer, **1 to 32** | none | Overrides `config.network.exegol_default_netmask`. Outside that range: rejected, not clamped |

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
| `volumes.mounts` | list of strings | `-V`, `--volume` | Extra mounts, one per entry: `/path/on/host/:/path/in/container/[:ro\|rw]` |
| `volumes.workspace_path` | string | `-w`, `--workspace` | Host directory linked to `/workspace` |
| `volumes.share_exegol_resources` | boolean | `--exegol-resources`, `--no-exegol-resources` | Mount Exegol resources at `/opt/resources` |
| `volumes.update_fs_perms` | boolean | `-fs`, `--update-fs`, `--no-update-fs` | Rewrite workspace permissions so container-created files stay usable by the host user. Changes permissions **on the host** |
| `volumes.exegol_resources_path` | string, host path | none | Overrides `volumes.exegol_resources_path` in the [user config](/wrapper/configuration) |
| `volumes.private_workspace_path` | string, host path | none | Overrides `volumes.private_workspace_path`. Where per-container workspaces are created when none is named |

> [!NOTE] Host path refusals
> Every host path a profile can set is constrained the same way: **relative** paths, the **filesystem root**, and the **home directory or any ancestor of it** are refused. There is no profile key for mounting the current working directory.

### `customization`

The my-resources volume, separate from the engagement mounts in `volumes`.

```yaml
customization:
  share_my_resources: true
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `customization.share_my_resources` | boolean | `--my-resources`, `--no-my-resources` | Mount my-resources at `/opt/my-resources` |
| `customization.my_resources_path` | string, host path | none | Overrides `volumes.my_resources_path`. Subject to the [host path refusals](#volumes); the directory is created if missing and its permissions are changed **recursively** so the container user can write |

### `display`

GUI sharing: X11/Wayland passthrough and the Exegol desktop.

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
| `display.share_x11` | boolean | `--gui`, `--no-gui` | Share the host GUI (X11 or Wayland). The CLI flag was renamed to `--gui`; the key stays `share_x11` so existing profiles keep working |
| `display.desktop.enabled` | boolean | `--desktop`, `--no-desktop` | Start the Exegol desktop with the container (publishes a remote-desktop port) |
| `display.desktop.proto` | string | `--desktop-config` | `http` or `vnc` |
| `display.desktop.listen_ip` | string | `--desktop-config` | Bind address. `0.0.0.0` exposes every interface; loopback is the conservative value |
| `display.desktop.port` | integer, **1 to 65535** | `--desktop-config` | Default: the protocol's own default port |

### `vpn`

VPN at container creation. Both keys are **paths** — see [No credentials](#authoring-rules).

```yaml
vpn:
  config: /home/user/vpn/client.ovpn
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `vpn.config` | string, path | `--vpn` | Path to an OpenVPN (`.ovpn`) or WireGuard (`.conf`) file. A path, never the config text |
| `vpn.auth_file` | string, path | `--vpn-auth` | Path to an OpenVPN credentials **file**. The file stays on the operator's disk |

Neither path is expanded or checked for existence when the profile is read (`~` and env vars stay as written). Existence is decided at container creation.

### `shell`

Default shell and environment.

```yaml
shell:
  default: zsh
  env:
    - "HTTP_PROXY=http://127.0.0.1:8080"
    - "TARGET_DOMAIN=corp.example.com"
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `shell.default` | string | `-s`, `--shell` | Defaults to `config.default_start_shell`. `bash`, `tmux` or `zsh`. Outside that set: **warning**, value kept as written |
| `shell.env` | list of strings | `-e`, `--env` | `KEY=value` strings. A name→value mapping is accepted and normalised to the list (canonical form; the reverse would lose repeated names or `=` in values) |

List-valued: entries are **concatenated** across CLI / profile / config, not replaced. Treat this as configuration, never secrets.

### `logging`

Shell session recording into the workspace. Different from audit logging in [`sentinel`](#sentinel).

```yaml
logging:
  enabled: true
  method: asciinema
  compress: true
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `logging.enabled` | boolean | `-l`, `--log`, `--no-log` | Defaults to `config.shell_logging.always_enable`. Record to `/workspace/logs/` |
| `logging.method` | string | `--log-method` | Defaults to `config.shell_logging.logging_method`. `asciinema` or `script`. Outside that set: **warning** |
| `logging.compress` | boolean | `--log-compress`, `--no-log-compress` | Defaults to `config.shell_logging.enable_log_compression`. Gzip each log when the session ends |

See [Shell logging](/wrapper/#shell-logging) for what each method captures.

### `system`

Host sharing and container privileges.

> [!WARNING] Widening keys apply without asking
> `privileged`, `devices` and `capabilities` widen what the container may do on the host. They are applied as declared at creation: no confirmation. Read a third-party profile before using it (`exegol info --profile <name>`). See [Security considerations](/wrapper/profiles/#security-considerations).

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
| `system.share_timezone` | boolean | `--share-timezone`, `--no-share-timezone` | Share the host timezone with the container |
| `system.privileged` | boolean | `--privileged`, `--no-privileged` | **Widening.** Full administrative privileges. Prefer a named capability below when possible |
| `system.devices` | list of strings | `-d`, `--device` | **Widening.** Host device paths exposed inside the container |
| `system.capabilities` | list of strings | `--cap` | **Widening.** Extra capabilities: `NET_ADMIN`, `NET_BROADCAST`, `SYS_MODULE`, `SYS_PTRACE`, `SYS_RAWIO`, `SYS_ADMIN`, `LINUX_IMMUTABLE`, `MAC_ADMIN`, `SYSLOG`, `ALL` (`ALL` ≈ privileged). Unknown entry: **warned at load, rejected at creation** |

`devices` and `capabilities` are list-valued (concatenated across tiers). `privileged` is a scalar: highest tier with an opinion wins.

### `sentinel` <Badge type="enterprise"/><Badge type="add-on"/>

Audit logging via [Exegol Sentinel](/sentinel/). Container profiles themselves need Professional or above; this section additionally needs the Sentinel add-on.

A container profile decides **whether** audit logging runs and **which** Sentinel profile it uses, then stops. Behaviour of events and audit profiles is documented under [Sentinel](/sentinel/) and [Sentinel configuration](/sentinel/configuration).

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
| `sentinel.enabled` | boolean | `-S`, `--sentinel`, `--no-sentinel` | On/off switch. Defaults to `config.sentinel.enabled_by_default` only when no `sentinel.profile` is set and no `-SP` is typed. Naming a `profile` with `enabled` omitted still enables audit logging. `-SP` out-ranks this key; only `--no-sentinel` refuses a `-SP` |
| `sentinel.profile` | string | `-SP`, `--sentinel-profile` | Names a **Sentinel audit profile** (not a container profile). With `enabled: false`, disabled regardless of this key (silently). With `enabled` omitted, naming a profile enables the feature |
| `sentinel.update_strategy` | string | `--sentinel-strategy` | Defaults to `config.sentinel.update_strategy`. `on_restart` or `disabled`. Outside that set: **warned at load, rejected at creation** when Sentinel is enabled |
| `sentinel.gid` | integer | none | Overrides `config.sentinel.log_group_gid`. Host group allowed to read audit logs. `-1` = group of the user running Exegol |
| `sentinel.sentinel_logs_host_path` | string, host path | none | Overrides `volumes.sentinel_path`. Host path for audit logs. Subject to [host path refusals](#volumes) |
| `sentinel.log_rotation.enabled` | boolean | none | Overrides `config.sentinel.log_rotation.enabled` |
| `sentinel.log_rotation.max_size` | string | none | Overrides `config.sentinel.log_rotation.max_size`. Quoted byte count (`"104857600"`) or unit suffix (`"100MB"`, `"512K"`, …); `K`/`M`/`G`/`T` = powers of 1024. Unquoted integer rejected. Invalid / non-positive → Exegol's `100MB` default (not the user-config value) |
| `sentinel.log_rotation.max_files` | integer | none | Overrides `config.sentinel.log_rotation.max_files`. **`0` keeps all** |
| `sentinel.log_rotation.compress` | boolean | none | Overrides `config.sentinel.log_rotation.compress` |
| `sentinel.log_output.enabled` | boolean | none | Overrides `config.sentinel.log_output.enabled`. Whether every event carries the cleaned terminal output of its command. Setting it to `false` is the only complete way to keep command output out of the event stream |
| `sentinel.log_output.max_size` | string | none | Overrides `config.sentinel.log_output.max_size`. Byte count or unit suffix (`"4KB"`, `"64KB"`, …); how much cleaned text is embedded per event. Must be **strictly positive** — `0` is rejected rather than meaning "off", which is what `enabled` is for. Invalid / non-positive → Exegol's `4KB` default |
| `sentinel.log_output.truncation` | string | none | Overrides `config.sentinel.log_output.truncation`. `head`, `tail` or `both`: which end of an oversized output survives. `both` spends half the budget on each end and names the dropped byte count in between |

### `metadata`

Two fields that read alike and are not: one describes the **profile**, the other annotates the **container** the profile creates.

```yaml
metadata:
  description: "Red team engagement - isolated network, session logging on"
  comment: "Ticket INC-4471"
```

| Field | Type | CLI | Meaning |
| ----- | ---- | --- | ------- |
| `metadata.description` | string | none | What this **profile** is for. Shown as the **Description** column in `exegol info --profiles` and in the interactive picker, which is what makes a profile identifiable there without opening its file. Never applied to the container |
| `metadata.comment` | string | `--comment` | Note carried onto the **container** the profile creates, shown in that container's `exegol info` recap. Pre-answers `--comment`. Not shown in the profile listing |
| `metadata.comment_ask_user` | boolean | none | When true, creating a container from this profile asks the operator for the comment and offers `metadata.comment` as the default. A value given with `--comment` answers the question and no prompt appears. When stdin cannot answer, as in a piped or scripted run, no prompt appears and the value that would otherwise apply is used |

## What a profile may override in the configuration file

Most keys above map to an `exegol start` flag. Five map to nothing outside a profile: `version` (file shape), `metadata.description` (what the profile is for), `network.hosts` (inline hosts), `network.hostname_ask_user` and `metadata.comment_ask_user` (each selects who supplies the value beside it).

The fifteen keys below replace a [user config](/wrapper/configuration) setting only (no CLI flag). Declaring one applies for that container, at creation only. Profile key and config key do not always share a name or section — the pairing is listed explicitly.

| Profile key | Setting it replaces | Notes |
| ----------- | ------------------- | ----- |
| `image.custom_images` | `config.custom_images` | See [`image`](#image) |
| `network.dedicated_range` | `config.network.exegol_dedicated_range` | See [`network`](#network) |
| `network.default_netmask` | `config.network.exegol_default_netmask` | See [`network`](#network) |
| `customization.my_resources_path` | `volumes.my_resources_path` | **Host path.** Permissions changed recursively. See [`customization`](#customization) |
| `volumes.exegol_resources_path` | `volumes.exegol_resources_path` | **Host path.** See [`volumes`](#volumes) |
| `volumes.private_workspace_path` | `volumes.private_workspace_path` | **Host path.** See [`volumes`](#volumes) |
| `sentinel.gid` | `config.sentinel.log_group_gid` | Different name. See [`sentinel`](#sentinel) |
| `sentinel.sentinel_logs_host_path` | `volumes.sentinel_path` | **Host path.** Different section and name. See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.enabled` | `config.sentinel.log_rotation.enabled` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.max_size` | `config.sentinel.log_rotation.max_size` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.max_files` | `config.sentinel.log_rotation.max_files` | See [`sentinel`](#sentinel) |
| `sentinel.log_rotation.compress` | `config.sentinel.log_rotation.compress` | See [`sentinel`](#sentinel) |
| `sentinel.log_output.enabled` | `config.sentinel.log_output.enabled` | See [`sentinel`](#sentinel) |
| `sentinel.log_output.max_size` | `config.sentinel.log_output.max_size` | See [`sentinel`](#sentinel) |
| `sentinel.log_output.truncation` | `config.sentinel.log_output.truncation` | See [`sentinel`](#sentinel) |

Host paths in that table use the same [refusals](#volumes) as `volumes`.

## What a profile may never set

Three families: fallbacks behind a choice the profile already makes; host/wrapper behaviour; where profiles themselves are discovered.

| Setting | Why a profile cannot set it |
| ------- | --------------------------- |
| `config.desktop.default_protocol` | Fallback behind `display.desktop.proto` |
| `config.desktop.localhost_by_default` | Fallback behind `display.desktop.listen_ip` |
| `config.sentinel.default_profile` | Fallback behind `sentinel.profile` |
| `volumes.exegol_images_path` | Host image layout, not container shape |
| `config.auto_remove_image` | Host disk-lifecycle policy |
| `config.auto_check_update` | Wrapper startup behaviour, before any container |
| `config.enable_exegol_resources` | Host-level resources flag; mount control is `volumes.share_exegol_resources` |
| `config.sentinel.component_path` | Where Sentinel profiles are discovered |
| `config.profile.component_path` | Where container profiles are discovered |
| `config.sentinel.sources` | Which remotes supply Sentinel profiles |
| `config.profile.sources` | Which remotes supply container profiles (sharpest case: a profile naming its own successor source) |

Per-invocation CLI flags (quiet/verbosity, exec, force, offline, licence credentials, …) are also outside a profile by construction: a profile shapes a container, it does not drive a command.
