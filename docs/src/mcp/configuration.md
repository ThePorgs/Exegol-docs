# User config

Exegol MCP reads an optional operator configuration file, `config.yml`, once at startup. The file is never created or written by the server: when it is absent or empty, the built-in defaults listed on this page apply. A file only overrides the keys it sets, so a deployment can hold a single line.

Every section refuses keys it does not know. An unknown, misspelled or invalid key stops startup with an error that names the dotted field, for example `Invalid config.yml: field 'execution.timeout_max_s': ...`, instead of being silently ignored. A section written with no value (`files:` alone on its line) keeps that section's defaults.

The launch settings ([see below](#launch-settings)) can also be given on the command line. The precedence is **command line, then `config.yml`, then the built-in default**. Every other section is set only through the file.

## File location

`config.yml` lives in `~/.exegol-mcp`, next to the Exegol wrapper's `~/.exegol`. The same directory holds the bearer secret file (`bearer.secret`) and the update-check cache (`update-check.json`).

::: tabs
=== Linux and macOS
```text :scroll
~/.exegol-mcp/config.yml
```
=== Windows
```text :scroll
%USERPROFILE%\.exegol-mcp\config.yml
```
:::

Earlier versions kept these files in a platform directory: `~/Library/Application Support/exegol-mcp` on macOS, `$XDG_CONFIG_HOME/exegol-mcp` (or `~/.config/exegol-mcp`) on Linux and `%APPDATA%\exegol-mcp` on Windows. On the first start, the server moves `config.yml` and `update-check.json` from there into `~/.exegol-mcp` when it does not hold them yet, and `bearer.secret` too when the secret is kept in a file rather than the OS keyring. A file it cannot move safely (a symbolic link or not a regular file, or, when the server runs as root, a file owned by another user or hard-linked) is left where it is, and for `config.yml` the server then refuses to start with a message naming both paths.

## `execution`

Bounds on command execution, background jobs and paginated listings. Durations are in seconds and sizes in bytes.

- `timeout_default_s`: timeout of a foreground `exec_command` or `exec_remote_command` call that gives none. (Default: `50`)
- `timeout_max_s`: largest foreground timeout a call may request. A larger request is clamped to this value. (Default: `600`)
- `output_cap_bytes`: per-stream cap on the captured standard output and standard error of a command. The end of the output is kept and a marker reports how much was dropped. (Default: `1048576`)
- `job_buffer_cap_bytes`: per-stream cap on the output buffer of a running background job. (Default: `1048576`)
- `max_concurrent_jobs`: number of background jobs that may run at the same time on one server. (Default: `16`)
- `finished_job_ttl_s`: how long a finished job and its output are kept before being removed. (Default: `3600`)
- `max_job_runtime_s`: longest wall-clock runtime of a background job, after which it is stopped automatically. (Default: `86400`)
- `kill_grace_s`: delay between SIGTERM and SIGKILL when a process inside a container is stopped. (Default: `5`)
- `listing_page_size`: default page size of paginated listings (`list_installed_tools`, `list_offline_resources`, `list_directory` and the MCP resource list). (Default: `200`)
- `container_op_timeout_s`: internal timeout of container start, stop and removal, separate from the execution timeouts above. (Default: `50`)

> [!NOTE]
> Every value in this section must be greater than zero, except `kill_grace_s`, which may be `0`.

## `security`

- `allow_no_auth`: allows the HTTP transport to start without authentication. Unauthenticated HTTP starts only when this key is `true` **and** `auth: none` is set in the same file. There is no command-line flag for it, and `--auth bearer` on the command line still turns authentication back on. See [Security considerations](/mcp/security) before changing it. (Default: `false`)

## `tool_groups`

Every tool except `server_info` belongs to one of four groups. A group listed under `disabled` is not registered: its tools are absent from the tool list and a call to one of them fails as an unknown tool. The resources of that group are hidden the same way.

- `disabled`: list of groups to disable. An unknown group name stops startup. (Default: `[]`, every group enabled)

| Group | Tools | Resources |
|-------|-------|-----------|
| `containers` | `list_containers`, `start_container`, `stop_container`, `create_container`, `remove_container`, `cleanup_containers`, `list_installed_tools`, `list_offline_resources` | `exegol://containers/{name}/info`, `exegol://containers/{name}/tools` |
| `images` | `list_images`, `download_image` | none |
| `execution` | `exec_command`, `get_job`, `stop_job`, `list_jobs`, `get_tool_help`, `exec_remote_command` | none |
| `files` | `read_file`, `write_file`, `list_directory` | `exegol://containers/{name}/workspace/{+path}` |

`server_info` belongs to no group and is never gated.

> [!WARNING] Gating is not a security boundary
> Disabling a group hides its tools and resources from the AI client. It does not restrict what a container can do. For example, with `files` disabled, `exec_command` can still read and write any file a shell can reach in the container. Gating reduces the surface an agent is offered; isolation comes from the container itself.

## `profiles` <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The [Exegol container profiles](/wrapper/profiles/) an agent may pass to `create_container`. Exegol MCP keeps no profile format of its own: entries name Exegol's own profiles. Profiles need a Pro, Team or Enterprise licence on the host. When the cached Exegol licence session does not grant one, running the Exegol wrapper once (for example `exegol info`) refreshes it.

- `allowed`: profile selections agents may use, written `sourcekey.name` or as a bare name. A name starts with a letter or a digit, uses only letters, digits, `_`, `.` and `-`, is at most 128 characters long and is listed once. When the list is not empty, each profile is resolved and validated by Exegol at startup, and a profile Exegol cannot use, or a licence session that does not grant profiles, stops startup. An empty list offers no profile. (Default: `[]`)
- `require_profile`: when `true`, `create_container` refuses any call that does not name an allowlisted profile. (Default: `false`)

## `lifecycle`

Removal defaults and the host workspace allowlist.

- `allow_remove_unmanaged`: lets `remove_container` remove Exegol containers this server did not create. Off by default, so containers created by hand are protected. `cleanup_containers` never removes them either way. (Default: `false`)
- `keep_workspace`: default of the `keep_workspace` argument of `remove_container` and `cleanup_containers` when a call omits it. A host directory mounted as a workspace is never deleted. (Default: `true`)
- `keep_logs`: default of the `keep_logs` argument of `remove_container` and `cleanup_containers` when a call omits it. (Default: `true`)
- `workspace_allowlist`: host directories an agent may mount as a container workspace through `create_container`. (Default: `[]`, every container gets a private Exegol workspace)

### Workspace allowlist

Each entry allows **exactly** the listed directory, never one of its parents or subdirectories: `create_container` accepts a host workspace only when it resolves to one of the entries. An empty list refuses every host workspace, and agents only get private workspaces.

Entries are absolute paths or start with `~/`, which is the invoking user's home under `sudo`. Each entry is resolved to its real path (symbolic links followed) when the server starts. On macOS and Windows, every comparison below ignores letter case, so a spelling that differs only by case counts as the same directory.

The checks run at startup. The paths they compare against come from Exegol's configuration, the allowlisted profiles and the running Python interpreter, so the server must be restarted after one of them changes, for example after an allowlisted profile is edited. If those paths cannot be read, startup stops.

#### Stops startup

Each of the following stops startup with an error naming `lifecycle.workspace_allowlist.<index>` and the reason:

- An empty entry, an entry holding a NUL character, an entry longer than 4096 characters, a relative path, or the `~user` form: only absolute paths and `~/` are accepted.
- `/`: the filesystem root is never mountable.
- A home directory or an ancestor of one: under `sudo`, both the invoking user's home and root's are checked.
- An entry inside another entry: a container that mounts the outer directory could replace the inner one with a symbolic link before Docker mounts it. Two identical entries are not nested.
- An entry inside or containing a directory Exegol mounts read-write into containers: Exegol's my-resources and exegol-resources directories, the X11 and Wayland display sockets shared with GUI containers, and the read-write mounts of the allowlisted profiles. "Containing" also covers every path Docker walks through, symbolic links included, to mount one of them.
- An entry inside, containing or equal to a directory whose entries Exegol hands to containers one by one: the private workspaces directory and the Sentinel logs directory (Exegol's and the allowlisted profiles'), and every device the allowlisted profiles map (`system.devices`). A container mounting the entry could plant a symbolic link or a device node for the next container.
- An entry containing a file or directory Exegol binds read-only into containers, or a path Docker walks to bind it: `spawn.sh`, `entrypoint.sh`, the Sentinel hooks and logger from Exegol's install directory, `/etc/timezone` and `/etc/localtime` on Linux, and the read-only mounts and VPN files of the allowlisted profiles. A container mounting the entry could swap that path and expose any host path to the next container.
- An entry inside, containing or equal to a directory Exegol reads its mount settings from: Exegol's configuration directory, its container profile directory and every `path:` profile source.
- An entry inside, containing or equal to exegol-mcp's own configuration directory, `~/.exegol-mcp`, or the directory earlier versions used (see [File location](#file-location)). Under `sudo` on Linux, this also covers root's v1 directory (`/root/.config/exegol-mcp` by default), whose bearer secret a `sudo` start copies. A container mounting the entry could rewrite `config.yml`, or read or plant the bearer secret.
- An entry inside, containing or equal to a directory exegol-mcp and Exegol run code from: the Python environment exegol-mcp runs in (for example a project's `.venv`), the virtual environment the interpreter starts in, the base Python installation (`/usr` for a system Python), Exegol's install directory, exegol-mcp's package directory, the user site directory, and every directory on Python's import path at startup (`PYTHONPATH` and `.pth` entries included). A container mounting the entry could change what runs on the host.

> [!NOTE]
> The user site directory is checked for the current start's `HOME` and `PYTHONUSERBASE`, even before it exists and even when the start disables it. It is skipped only in a virtual environment whose `pyvenv.cfg` excludes system site packages. The launch command printed by `--print-config` keeps the client's working directory off the import path; a `python -m exegol_mcp` or `python -c` launch typed by hand puts it there, and that directory is then checked too.

#### Loads

- An entry equal to a directory Exegol mounts read-write, such as the my-resources directory, when Exegol's configured path for it is that directory itself rather than a symbolic link to it.
- An entry inside or equal to a read-only mount of an allowlisted profile.
- Two identical entries.
- A sibling directory sharing a name prefix with another entry or a refused directory, for example `/srv/engagement-2` next to `/srv/engagement`: whole path components are compared.

#### Not checked

The following are outside what the server can see or decide, and stay the operator's responsibility. Allowlisted directories should be kept apart from them.

- The WSLg display socket of a native Windows host, the Wayland socket of another environment (such as the Exegol wrapper's), and Exegol's `/dev/net/tun` device.
- A profile's `network.hosts_file`, which Exegol reads on the host, and links placed in a profile source that point into an allowlisted directory.
- Directories other than the user site added to Python's import path after startup, and code an import hook loads from outside it.
- A user site directory another start's `HOME` or `PYTHONUSERBASE` would select, or one a start reaches through `PYTHONEXECUTABLE` or `__PYVENV_LAUNCHER__` on macOS.
- Another Python environment, such as the Exegol wrapper's own.
- The Python installation or an import-path directory lying inside a directory Exegol mounts, which only the operator's own setup puts there.
- Other directories whose contents the host runs or trusts: `PATH` directories, the directory of the interpreter a printed `python` launch names when it lies outside the Python installation (such as Homebrew's `opt` link), and `~/.ssh`.
- Directories other containers mount (the Exegol wrapper's `-V` option, a hand-made `docker run`), a profile that is not on the allowlist, and an Exegol configuration or profile edited after startup.

## `files`

Size limits of the file tools and of the workspace resource.

- `max_bytes`: largest file `read_file` or `write_file` transfers, and largest file the `exegol://containers/{name}/workspace/{+path}` resource returns, in raw bytes before base64 encoding. A larger file is refused, never truncated. (Default: `10485760`, 10 MiB)
- `max_list_depth`: largest depth `list_directory` accepts. (Default: `5`)
- `max_list_entries`: number of entries `list_directory` collects before paging. (Default: `10000`)

> [!TIP]
> Claude Code stops reading a response from an HTTP MCP server once it passes 16 MiB ([source](https://code.claude.com/docs/en/mcp)). File contents travel base64-encoded, which grows them by a third, so a `max_bytes` value far above about 12 MiB breaks large reads over HTTP.

## Launch settings

These top-level keys mirror the command-line flags. A flag given on the command line wins over the file. When neither sets a value, the built-in default applies.

- `transport`: `http` or `stdio`. Mirrors `--type`. (Default: `http`)
- `port`: port of the HTTP server, which always binds `127.0.0.1`. Mirrors `--port`. (Default: `2187`)
- `auth`: `bearer` or `none`. Mirrors `--auth bearer` on the command line, which is still accepted though `--help` no longer lists it. `none` takes effect only together with `security.allow_no_auth: true`; otherwise the server falls back to `bearer`. (Default: `bearer`)
- `update_check`: whether the server checks PyPI for a newer exegol-mcp release in the background. `--no-update-check` on the command line always turns it off. (Default: `true`)

### Command-line options

- `-t`, `--type`: transport, `http` or `stdio`. (Default: `http`)
- `-p`, `--port`: port of the HTTP server. (Default: `2187`)
- `-pc`, `--print-config`: print the client configuration entry for the chosen transport, bearer token included, then exit. The first HTTP start prints that entry once; later starts print a line pointing at this option.
- `--accept-eula`: accept the Exegol EULA for this run without a prompt, for stdio launches and pipelines, which have no terminal. Nothing is recorded.
- `--no-update-check`: do not check PyPI for a newer exegol-mcp release, for offline or air-gapped use.
- `version`: print the Exegol MCP and Exegol library versions, and the Exegol wrapper's when it differs, then exit. It starts no server, needs neither Docker nor the EULA, and never creates or moves a file. With `-vvv` it always shows both and adds debug information for bug reports (Exegol MCP and Exegol directories, config file state, EULA state, installation, Python, host, Docker, update check), and never prints the bearer token.
- `-v`, `-vv`, `-vvv`: verbosity (verbose, advanced, debug), with the same meaning as in the Exegol wrapper. A start prints one line with the address by default; `-v` adds the versions, the Docker state, the config directories and the update check. The debug output of the libraries (MCP, HTTP) appears only with `-vvv`.

`--auth bearer`, which earlier client entries may pass, is still accepted and changes nothing. `--auth none` is refused: unauthenticated HTTP is set with `security.allow_no_auth` in `config.yml`.

## Example

A complete file listing every key. The commented values differ from the defaults; in practice only those lines need to be written.

```yaml :scroll
# ~/.exegol-mcp/config.yml

# Launch settings. A command-line flag wins over each of them.
transport: http
port: 2187
auth: bearer
update_check: true

execution:
  # Give long scans more room before they must move to a background job.
  timeout_default_s: 120
  timeout_max_s: 900
  output_cap_bytes: 1048576
  job_buffer_cap_bytes: 1048576
  # A smaller host: fewer parallel background jobs, none longer than 12 hours.
  max_concurrent_jobs: 8
  finished_job_ttl_s: 3600
  max_job_runtime_s: 43200
  kill_grace_s: 5
  listing_page_size: 200
  container_op_timeout_s: 50

security:
  # Keep false. See the Security considerations page before changing it.
  allow_no_auth: false

tool_groups:
  # Hide the file tools from this deployment's agents.
  # This is not a security boundary.
  disabled: [files]

profiles:
  # Offer two Exegol container profiles (requires a Pro, Team or Enterprise licence).
  allowed: [local.redteam, lab]
  require_profile: false

lifecycle:
  allow_remove_unmanaged: false
  keep_workspace: true
  keep_logs: true
  # Each entry allows exactly this directory, never a parent or a subdirectory.
  workspace_allowlist:
    - ~/engagements/lab-01
    - /srv/exegol-mcp/shared

files:
  max_bytes: 10485760
  max_list_depth: 5
  max_list_entries: 10000
```
