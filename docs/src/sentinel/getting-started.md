# Getting started <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Exegol Sentinel is turned on **per container, at creation time**, and everything it produces lands on the Docker host in one directory per container instance: an NDJSON event stream carrying one object per finished command, next to the artifacts the container's profile rules collected. Sentinel records what an operator types **interactively**. It is not a full process audit, and the invocations it does not see are enumerated on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#command-coverage). See the [Log schema reference](/sentinel/siem/log-schema) for the shape of an event and [Actions](/sentinel/profiles/actions) for what a rule can collect.

This page takes a container from no Sentinel at all to a readable event stream, and then to a first artifact on disk.

Every container name, path and host name below is **synthetic**.

## 1. Enable Sentinel on a container

**Sentinel is decided at container creation and at no other time.** A flag on the creation command is the direct way to turn it on; `config.sentinel.enabled_by_default` in `~/.exegol/config.yml` and a container profile's `sentinel` section can each enable it with no flag typed at all. Three options control it from the command line, all of them creation-only: they are read when a new container is built and ignored on an existing one. Enabling Sentinel on a container that already exists means creating a new one.

| Option | Description |
| ------ | ----------- |
| `-S`, `--sentinel`, `--no-sentinel` | Enable Sentinel logging on the container being created; `--no-sentinel` refuses it (default: Disabled) |
| `-SP SENTINEL_PROFILE`, `--sentinel-profile SENTINEL_PROFILE` | Name the Sentinel audit profile to deploy in the container; supplying it also enables Sentinel (default: no profile is applied) |
| `--sentinel-strategy STRATEGY` | When the container's deployed configuration is regenerated from the host sources: `on_restart` regenerates it at every restart, `disabled` freezes it until forced (default: `on_restart`) |

```bash
# new container, Sentinel enabled, default profile
exegol start demo full --sentinel

# the same, naming the profile explicitly and freezing its configuration
exegol start demo full --sentinel-profile core.demo --sentinel-strategy disabled
```

`-S` takes no value: it enables Sentinel, and the profile comes from a container profile's `sentinel.profile` if one declares it, and otherwise from `default_profile` in `~/.exegol/config.yml` (empty out of the box). `-SP`/`--sentinel-profile` names one explicitly, and supplying it enables Sentinel by doing so. With no profile in force, Sentinel records commands and collects nothing else, because no rule exists to fire. Where a profile name like `core.demo` comes from, and how the `sourcekey.name` form resolves, is the subject of the [Configuration](/sentinel/configuration) page.

`-S`/`--sentinel` enables the feature on the container being created and `--no-sentinel` refuses it, in both cases whatever a container profile or `config.sentinel.enabled_by_default` in `~/.exegol/config.yml` say; when neither half is typed, a container profile's `sentinel.enabled` decides if it declares one, and `config.sentinel.enabled_by_default` decides otherwise; typing `-SP` is the exception to both arms: a name given on the command line out-ranks a container profile's `sentinel.enabled: false` and enables Sentinel with no warning, and only `--no-sentinel` refuses a `-SP`, warning when both are typed that the audit profile named with `-SP` is not applied; a container profile writing `sentinel.profile` with `sentinel.enabled` omitted enables it too, whatever `config.sentinel.enabled_by_default` says. The full key list lives in the [wrapper configuration reference](/wrapper/configuration), and the option tables in the [start command reference](/wrapper/cli/start).

> [!WARNING] Without the Sentinel feature, the wrapper warns and creates the container anyway
> Sentinel is an Enterprise add-on. Any session without the Sentinel optional feature cannot use it: `-S` prints a warning and container creation **proceeds without Sentinel** rather than failing. The container starts, the shell opens, and no event stream is ever written. This is the most common reason for step 2 finding nothing at all. See the [Overview](/sentinel/) for the licensing path.

## 2. Locate and read the stream

The host-side directory is `~/.exegol/sentinel/{container_instance}/`, one per container instance. `{container_instance}` is the container's **Docker name** (the tag you passed to `exegol start`, prefixed with `exegol-`) joined by an underscore to a **Unix epoch integer**, not an ISO timestamp; an eight-character alphanumeric suffix is appended only when that name is already taken. So `exegol start demo full --sentinel` writes to `~/.exegol/sentinel/exegol-demo_1767225667/`, not to a directory named after the bare tag. The parent directory is the sentinel path, which defaults to `~/.exegol/sentinel/` and is overridable with the `volumes.sentinel_path` key in `~/.exegol/config.yml`.

Three things live in an instance directory, and only the first is audit data:

- **`logs.json`**: the event stream. One JSON object per line, appended when a command finishes. Every field it can carry is defined on the [Log schema reference](/sentinel/siem/log-schema).
- **`sentinel_config.json`**: the profile configuration deployed into that container. It carries the profile source URLs and is **not** audit data; do not ship it to a SIEM.
- **`artifacts/`**: one subdirectory per artifact identifier, holding whatever the rules collected. The layout, ownership and permission modes are documented on [Artifacts and limitations](/sentinel/siem/artifacts-limitations).

Open an interactive shell in the container, type any command, and the stream picks it up:

```bash
ls ~/.exegol/sentinel/
tail -f ~/.exegol/sentinel/exegol-demo_1767225667/logs.json
```

An empty or absent `logs.json` after a few interactive commands means one of three things: the container was created without `-S`, the session was not licensed for Sentinel (see the callout above), or the commands were not typed at an interactive prompt. A `exegol exec` invocation, a container-start command and the individual commands inside a script are all outside the [capture boundary](/sentinel/siem/artifacts-limitations#command-coverage).

For reading the stream from a log agent rather than by hand (the glob to use, the permissions the agent needs, and the files it must not sweep in), see [Ingest configuration](/sentinel/siem/ingest-configuration).

## 3. Generate an artifact with `core.demo`

This step is optional. It exists to show the other half of Sentinel: a **rule** that fires on a command and collects something the event alone does not carry.

`core.demo` is the profile shipped by the official source, and the rule walked here copies the Kerberos credential cache whenever a ticket is used against a target:

```yaml
# The rule this walkthrough exercises, as core.demo declares it.
# The profile's own config block and its second rule are omitted here.
profiles:
  demo:
    rules:
      - triggers:
          - kerberos_pass_the_ticket
        actions:
          - dump_kerberos
```

Create the container with that profile:

```bash
exegol start demo full --sentinel-profile core.demo
```

> [!WARNING] All three conditions must hold on the same command, or nothing is collected
> `kerberos_pass_the_ticket` is a composite trigger combining three separate conditions with `AND`, and a command satisfying only two of them fires nothing:
>
> - `KRB5CCNAME` is **exported** in the shell that runs the command. Exporting it in a different shell, or setting it without `export`, does not count.
> - The command's basename, with its extension ignored, appears in the `impacket_scripts` name list. `ignore_extension: true` is what makes `secretsdump.py` match the list entry `secretsdump`.
> - `-k` or `--kerberos` appears in the arguments.

From an interactive shell inside the container:

```bash
export KRB5CCNAME=/tmp/krb5cc_1000
secretsdump.py -k -no-pass 'corp.example/operator@dc01.corp.example'
```

When the command finishes, a new directory appears under `artifacts/` in that container's instance directory, holding a copy of the credential cache under **its own basename** (`krb5cc_1000` in the example above, not a name invented by the action). The matching command event in `logs.json` carries the same identifier in its `artifact_id` field, which is how the two are joined.

With `KRB5CCNAME` unset the action does not give up: it scans `/tmp` for names matching `krb5cc_` followed by digits and copies what it finds. The trigger, however, still requires the variable, so the fallback only matters for rules written differently from this one.

The profile's second rule fires `capture_net` on `responder_or_bettercap`, a network capture running for the life of the matching process. It is not walked here because it needs a live interface and a running tool, and it is documented on [Actions](/sentinel/profiles/actions).

## Where to go next

- [Configuration](/sentinel/configuration): the `sentinel` block in `~/.exegol/config.yml`, and where profile names resolve from.
- [Profile concepts](/sentinel/profiles/concepts): triggers, actions and rules, and how a profile of your own is put together.
- [Security considerations](/sentinel/security): what a profile source is trusted to do, and what ends up in the logs.
- [Log schema reference](/sentinel/siem/log-schema): the contract a SIEM parser is written against.
