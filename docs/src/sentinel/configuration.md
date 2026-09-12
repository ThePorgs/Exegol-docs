# Configuration <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Every Sentinel key and its default comes from the [wrapper configuration reference](/wrapper/configuration). That page lists the keys; this page shows a working block and the CLI options that enable or override it. For what those keys govern once they are set, see [Sources and updates](/sentinel/profiles/sources) for the source model and [Getting started](/sentinel/getting-started) for what lands on the host.

Every path, host name and organisation name below is **synthetic**.

## A working configuration block

Sentinel is configured from two places in `~/.exegol/config.yml`: one entry under `volumes:` decides **where the audit data is written on the host**, and a `sentinel:` block under `config:` decides **how it behaves**. Putting `sentinel_path` inside the `sentinel:` block does nothing: it is a volume, not a setting.

```yaml :scroll
# ~/.exegol/config.yml
# Only the Sentinel-related entries are shown; the rest of the file is unchanged.
# Every key below, with its accepted values and its default, is listed once in
# the wrapper configuration reference linked at the bottom of this page.

volumes:
    # The host directory Sentinel creates one sub-directory in per container
    # instance. Point it somewhere the log agent can reach and the disk can
    # grow. It holds the event streams and every collected artifact.
    sentinel_path: /var/lib/exegol/sentinel

config:
    sentinel:
        # Set to True on a fleet where every engagement container must be
        # audited, so enabling it is not left to an operator remembering -S.
        enabled_by_default: False

        # The GID the log shipper runs as. The Sentinel directory is readable
        # by this group, which is what lets an agent ingest the stream without
        # running as the operator. -1 keeps the operator's own group and shares
        # the data with nobody else.
        log_group_gid: 8042

        # Where profile sources are cloned and scanned on the host. Move it if
        # the Exegol configuration directory is not where your configuration
        # management deploys profiles.
        component_path: ~/.exegol/components/sentinel

        # The profile applied when -SP is not given and no container
        # profile declares sentinel.profile. Written source-qualified so
        # it stays unambiguous the day a second source publishes a
        # profile of the same name.
        default_profile: core.demo

        # on_restart picks up a source update at the next restart of a
        # container. Set it to disabled to freeze a container's deployed
        # configuration for the length of an engagement.
        update_strategy: on_restart

        # Used only when the active profile carries no log_rotation block of
        # its own. A profile that defines one wins for the containers using it.
        log_rotation:
            enabled: True
            max_size: "100MB"
            # Keep a bounded history on a shared host. 0 keeps every rotated
            # file, which is the safer choice when the agent may fall behind.
            max_files: 10
            compress: True

        # Used only when the active profile carries no log_output block of its
        # own. This is the `output` field carried by every event, which is a
        # different destination from the output_capture action's artifact, and
        # it is enabled by default. Raised here from the shipped 4KB because
        # this estate's Splunk has TRUNCATE = 0 applied, per the ingest guide.
        log_output:
            enabled: True
            max_size: "8KB"
            truncation: both

        sources:
            # The drop-in source created on first setup. Profiles dropped in
            # this directory are scanned where they are and never fetched.
            local:
                path: ~/.exegol/components/sentinel/local

            # A team source pinned to a tag. The pin is the supply-chain
            # control: without ref, every update takes whatever the default
            # branch says that day.
            team-profiles:
                git: https://git.example.com/org/sentinel-profiles.git
                ref: v1.0
```

## The `core` source key

`core` is the official Exegol profile source. It is a **reserved key**: it is always available without appearing under `sources:`, and it cannot be redefined there. Declaring it under `sources:` is a **fatal** configuration error rather than an override, and every `exegol` command exits until the entry is removed. That is why `core.demo` can be selected on a machine whose `sources:` block is otherwise empty.

`local` is not reserved. It is the drop-in source Exegol writes into `sources:` on first setup, so a profile authored by hand has somewhere to live; it can be moved or removed like any other entry. See [Sources and updates](/sentinel/profiles/sources) for how a source is declared, pinned, fetched and trusted.

## CLI options

Four options relate to Sentinel. `-S`/`--sentinel`, `-SP`/`--sentinel-profile` and `--sentinel-strategy` are **creation-only**: they are read when a new container is built and ignored on an existing one. `-S` turns Sentinel on for the container being created and `--no-sentinel` refuses it, in both cases whatever a container profile or the configuration file say. When neither is typed, a container profile's `sentinel.enabled` decides if it declares one, and the configuration file's `enabled_by_default` key decides otherwise. Naming an audit profile enables the feature by doing so, whatever `enabled_by_default` is set to, on both surfaces: `-SP`/`--sentinel-profile` on the command line, and a container profile writing `sentinel.profile` with `sentinel.enabled` omitted. The two keys can disagree inside one container profile, and there the answer is that `sentinel.enabled: false` beside a `sentinel.profile` is disabled, silently. Typed on the command line the answer is the other way round: `-SP` out-ranks a container profile's `sentinel.enabled: false` and enables the feature with no warning, and only `--no-sentinel` refuses it, warning when both are typed that the audit profile named with `-SP` is not applied. That `enabled_by_default` key is **creation-only too**: it is the standing default for *new* containers when nothing above it decides, and has no effect on one that already has Sentinel. An existing container carries the feature in its volume mount, so turning it off there means recreating the container with `--no-sentinel`.

| Option                                                        | Description                                                                                                                                                                                                                      |
|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-S`, `--sentinel`, `--no-sentinel`                           | On `exegol start`: enable Sentinel on the new container; `--no-sentinel` refuses it (default: Disabled)                                                                                                                          |
| `-SP SENTINEL_PROFILE`, `--sentinel-profile SENTINEL_PROFILE` | On `exegol start`: name the Sentinel audit profile to apply, overriding `default_profile`; supplying it also enables Sentinel (default: no profile is applied)                                                                   |
| `--sentinel-strategy STRATEGY`                                | On `exegol start`: set this container's update strategy, overriding `update_strategy`. `on_restart` regenerates the deployed configuration from the host sources at every restart, `disabled` freezes it (default: `on_restart`) |
| `--sentinel-refresh`                                          | On `exegol restart`: force one regeneration of the deployed configuration from the host sources, even for a container whose strategy is `disabled`. It fetches nothing itself                                                    |

See [start](/wrapper/cli/start#sentinel) and [restart](/wrapper/cli/restart#sentinel) for these options in their per-action reference, alongside the rest of each action's flags.

## Operator metadata and tags

These are the only Sentinel settings that do **not** live in `~/.exegol/config.yml`, and deliberately so: they describe the **engagement**, not the machine. They are two environment variables the operator exports inside the container, so a client name or an auditor's name never has to be written into a host configuration file that outlives the engagement.

| Variable | Emitted as | Format |
| -------- | ---------- | ------ |
| `EXEGOL_SENTINEL_META` | the event's `metadata` object | comma-separated `key=value` pairs |
| `EXEGOL_SENTINEL_TAGS` | the event's `tags` array | a comma-separated list |

Both surfaces work, and the values below are synthetic:

```bash
# At spawn time, on the container being started
exegol start demo -e EXEGOL_SENTINEL_META='auditeur=mathieu,engagement=SIE2026,client=EnterpriseX' \
                  -e EXEGOL_SENTINEL_TAGS='redteam,internal'

# Or mid-session, from inside the container
export EXEGOL_SENTINEL_META='auditeur=mathieu,engagement=SIE2026,client=EnterpriseX'
export EXEGOL_SENTINEL_TAGS='redteam,internal'
```

**The change takes effect on the very next command.** The variables are read fresh on every command, so exporting, changing or unsetting one mid-session affects only the events written from then on. Events already written are never revisited.

**`-e` behaves differently at creation than on an existing container**, and that difference is the `-e` option's own, not Sentinel's: set when the container is **created**, the variable is persistent in every shell of that container; passed to an **existing** container, it lives only in the shell being started. See [`-e`, `--env`](/wrapper/cli/start#session-specific) on the `start` reference.

**They must be exported.** The logger reads the exported environment, which is what `-e` and `export` produce. A bare `EXEGOL_SENTINEL_TAGS=redteam` shell assignment does not export, so it is invisible to the logger; neither does a `VAR=value` prefix typed in front of a single command, which lives only in that one command's environment.

The format rules, which the [log schema reference](/sentinel/siem/log-schema#operator-supplied-metadata-and-tags) states in parser terms:

- Elements are separated by commas, and whitespace around an element is stripped. Empty elements are ignored, so a doubled comma or a trailing one is harmless.
- `EXEGOL_SENTINEL_META` splits each element on the **first** `=` only, so a value may itself contain `=`.
- An element with no `=`, or with an empty key, is dropped. An element like `engagement=` is **kept**, as a key with an empty value.
- A repeated key keeps the **last** one typed.
- Tags keep the order typed, and duplicates are kept.

> [!WARNING] There is no escaping mechanism, so a value cannot contain a comma
> The comma is the separator and nothing overrides it. `client=Enterprise, Inc.` becomes the pair `client=Enterprise` plus a dropped `Inc.` element, silently. Keep values comma-free.

**Nothing here is validated, capped or truncated.** There is no limit on how many keys or how long a value may be, and no filtering is applied to what you put in them. Read [Security considerations](/sentinel/security#operator-supplied-metadata-is-unfiltered-and-self-reported) before using them: whatever goes in reaches the SIEM verbatim, on every event.

## The full key reference

The exhaustive per-key list (every `sentinel.*` key, its accepted values and its default) is maintained in one place, in the wrapper configuration documentation, and is not repeated here.

Read it at [Sentinel configuration keys](/wrapper/configuration#sentinel).
