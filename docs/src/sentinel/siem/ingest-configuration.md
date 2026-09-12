# Ingest configuration <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Paste these configurations as-is. The page covers **one classic on-premises deployment per product**: a Filebeat shipping to Elasticsearch, and a Splunk Universal Forwarder shipping to a Splunk indexer. There is no Elastic Cloud or Splunk Cloud variant and no vendor-neutral collector section. If you run one of those, the field work below still applies, but the file layout does not. Standing this up in your estate, including analysis, is also offered as an [Enterprise service](/sentinel/#profile-authoring-and-ingest-help).

Every field rename and every alias below comes from the [Field mappings](/sentinel/siem/field-mappings) page. For the hazards these configurations sit on top of (the rotation contract, artifact retention, and the ways an audit trail can be lost), see [Artifacts and limitations](/sentinel/siem/artifacts-limitations).

## Verified against

| Component | Version these examples target |
| --------- | ----------------------------- |
| Filebeat | **8.x**. The `file_identity` default changed in 9.x. See the pin in section 3 |
| Elastic Common Schema | **8.17.0**, as pinned on the [Field mappings](/sentinel/siem/field-mappings#verified-against) page |
| Splunk Enterprise / Universal Forwarder | **9.0 or later**. Field-alias resolution semantics changed in 9.0 |
| Splunk Common Information Model | **6.x** |

## 1. What to read, and from where

**The ingest agent runs on the Docker host, not inside the container.** This is the only topology documented here, and it is the one the rest of this site assumes when it says logs are read from the host.

That choice buys three things:

- **Nothing is installed in the image.** The container needs no agent, no agent configuration, and no agent credentials.
- **It survives container deletion.** The host-side directory outlives the container it belonged to, so the events of a container that has already been removed are still shippable, for as long as the directory exists.
- **One agent covers every container.** Instances come and go throughout an engagement; a glob over the sentinel path picks up new ones with no reconfiguration.

### The host-side layout

The sentinel path defaults to the `sentinel` directory inside your Exegol configuration directory (`~/.exegol/sentinel/`) and is overridable with the `volumes.sentinel_path` key in `~/.exegol/config.yml`. It lives under the top-level `volumes:` section; a bare top-level `sentinel_path:` is silently ignored. Every path below assumes the default; substitute yours if you changed it.

Each container instance gets its own subdirectory, named from the container name and a Unix timestamp, with an eight-character random suffix appended only when that name is already taken:

``` text :scroll
~/.exegol/sentinel/
└── {container_name}_{unix_timestamp}[_{random8}]/
    ├── logs.json                        ← the event stream. This is what you glob
    ├── logs.<timestamp>.json[.gz]       ← rotated generations, see section 4
    ├── sentinel_config.json             ← DO NOT INGEST: carries profile source URLs
    ├── sentinel_runner_debug.log        ← DO NOT INGEST: runner debug output
    ├── .logs.removing                   ← DO NOT INGEST: transient, exists only while a container is being removed
    └── artifacts/
        └── {artifact_id}/
            ├── env_vars.json            ← ingested by default (section 3)
            ├── exec_{name}.json         ← ingested by default (section 3)
            ├── capture_{interface}.pcap ← left on disk by default (section 5)
            ├── krb5cc_{uid}             ← left on disk by default (section 5)
            └── .pre_exec_pid, .pre_exec_done, .{capture_name}.pid
                                         ← DO NOT INGEST: runner internals
```

### The glob, and why it is that narrow

The event-stream glob is the instance wildcard plus the event file name, and nothing else:

```
~/.exegol/sentinel/*/logs.json
```

Do not write `~/.exegol/sentinel/*/*` and stop there. That wildcard sweeps in four things you did not ask for:

| Swept in by a wider glob | Why that is a problem |
| ------------------------ | ---------------------- |
| `sentinel_config.json` | It carries the **profile source URLs** for the deployment. HTTPS credentials are stripped before the file is written, but an SSH remote is preserved verbatim, and the file is not audit data |
| `sentinel_runner_debug.log` | Unstructured runner debug output. It is not NDJSON, so it produces a stream of parse failures |
| `.logs.removing` | The transient name `logs.json` is given while a container is being removed. Ingesting it produces a final burst of **duplicate** events for a container that is being destroyed |
| the whole `artifacts/` tree | Packet captures and Kerberos credential caches. Section 5 makes that an explicit, warned choice. A glob should never make it for you |

Both configurations in section 3 therefore glob narrowly **and** carry exclusion patterns for those files, so that a later widening of the glob does not silently start shipping them.

## 2. Permissions the agent needs

Without this section the configurations in section 3 fail with permission errors on an otherwise standard deployment. This is the model as it ships.

**Ownership splits by writer, and only the group is the same throughout.** The wrapper creates the instance directory and writes `sentinel_config.json` **as you**, so those are owned by the invoking user. Everything else is written from inside the container, where the writer is `root`. The wrapper does attempt to chown the instance directory to `root` first, but that needs `CAP_CHOWN` and the wrapper is an ordinary user process reaching Docker through the docker group, so on a standard Linux host that attempt fails and it falls back to your own uid. **What matters for ingest is the group, and the group is correct in every case.**

| Path | Written by | Ownership | Mode |
| ---- | ---------- | --------- | ---- |
| the container instance directory | the Exegol wrapper, on the host | the invoking user : the configured sentinel group | `2750`: group read and traverse, set-group-id so new entries inherit the group |
| `sentinel_config.json` | the Exegol wrapper, on the host | the invoking user : the configured sentinel group | `0644`: not audit data, do not ingest it |
| `logs.json` and rotated generations | the container | `root` : the configured sentinel group | `0660`: **from the container umask, not an explicit chmod** |
| `artifacts/` | the container | `root` : the configured sentinel group | `2770`, group readable and writable, set-group-id. **From the container umask, not an explicit chmod** |
| `artifacts/{artifact_id}/` | the container | `root` : the configured sentinel group | **`2750`**: group read and traverse, nothing for other, set-group-id so the manifests inside stay group-owned by the sentinel group |
| the manifests, captures and credential caches inside `artifacts/{artifact_id}/` | the container | `root` : the configured sentinel group | `0640`: group read, nothing for other |

The group is set by the `config.sentinel.log_group_gid` key in `~/.exegol/config.yml`. If Exegol could not set it either (it warns and prints the exact `sudo chown -R` command to run), then no ownership in the table above holds, and the agent will fail on the whole tree rather than on part of it.

**Two of those modes are emergent, not enforced.** The instance directory, `artifacts/{artifact_id}/` and the files inside it are given their modes by an explicit `chmod`. `logs.json` and the `artifacts/` root are not: they get whatever the container umask leaves, and the `0660` and `2770` above hold only because the Exegol image sets `umask 0007` in `/opt/.exegol_shells_rc`, which both `bashrc` and `zshrc` source unconditionally. If you see `0644` on `logs.json` or `2755` on `artifacts/` (world-readable command history, a world-traversable artifact root), that is a umask problem in whatever context invoked the logger, not a bug in your deployment.

**The operational instruction is one line:** add the agent's service account to that group.

```bash
sudo usermod -aG <your sentinel group> filebeat     # or splunkfwd, or whatever the agent runs as
```

> [!NOTE] The agent does not need to run as root
> Group membership is sufficient for **both** halves of the configuration: the event stream and the artifact manifests. Nothing on this page asks you to run a log shipper as `root`, and you should not, because a shipper reading an engagement's command history is a high-value process to compromise.

**On a single-user deployment there is nothing to administer.** `log_group_gid` defaults to `-1`, which means "fall back to the invoking user's own group". If you have left it at the default and the agent already runs as that same user, the permissions above are already satisfied and the `usermod` step does not apply.

> [!WARNING] Artifacts created before the mode change stay owner-only
> The `2750` directory mode and the `0640` file mode are recent. Directories created by an earlier version were owner-only (`2700`, or `0700` on a deployment predating the set-group-id parent) and the files inside took whatever the container umask gave them; neither is **retrofitted**. No upgrade path walks the tree and relaxes them. On a host that has been running Sentinel for a while, the artifact input will silently see nothing from those older directories while working correctly for every new one. The remediation is on the [Artifacts and limitations](/sentinel/siem/artifacts-limitations#the-permission-model-and-the-directories-it-does-not-retrofit) page.

## 3. Shipper configuration

> [!WARNING] Check the `/home/*/` glob before you paste
> Every path and `[monitor://...]` stanza below is anchored at `/home/*/.exegol/sentinel/`, which covers operators whose home directories sit under `/home` and **nothing else**. It does not match `/root/.exegol/sentinel/` (Exegol run as `root`, which is common on a dedicated ingest host), and it does not match a relocated `volumes.sentinel_path`.
>
> Substitute the glob if either applies to you. The failure mode is silent: the agent starts, reports itself healthy, and ships nothing at all. After rolling out, confirm the agent's registry actually lists a file rather than trusting that the process is up.

::: tabs

=== Filebeat

Paste the whole block into `/etc/filebeat/filebeat.yml`. It targets **Filebeat 8.x**. The renames implement the [ECS tables](/sentinel/siem/field-mappings#exegol-to-ecs-8-x) exactly.

```yaml :scroll
# /etc/filebeat/filebeat.yml -- deployed on the DOCKER HOST
# Targets Filebeat 8.x. Read "What this configuration does not do" at the
# bottom of this page before rolling this out to production.

filebeat.inputs:

  # ===========================================================================
  # Input 1 -- the event stream (one logs.json per container instance)
  # ===========================================================================
  - type: filestream                # the older `log` input is deprecated; filestream is its supported successor
    id: exegol-sentinel-events      # required, must be unique, and must never change:
                                    # changing an input id discards its file state and re-reads everything
    enabled: true
    paths:
      - /home/*/.exegol/sentinel/*/logs.json

    # Sentinel rotates by RENAMING logs.json, which preserves the inode, so a
    # reader holding the descriptor keeps draining the renamed generation.
    # `native` (inode + device) is the identity strategy that follows that.
    # It is the 8.x default and is pinned explicitly because Filebeat 9.x
    # changed the default to `fingerprint`.
    #
    # Do NOT change this on a running deployment. Filebeat supports migrating
    # native -> fingerprint and nothing else; any other change makes every file
    # look new and re-ingests all of it.
    file_identity.native: ~

    # A rename-following reader can only follow ONE inode hop per scan. If two
    # rotations happen between two scans, the intermediate generation is skipped
    # entirely. Keep this well under your expected rotation cadence.
    prospector.scanner.check_interval: 5s

    # Defence in depth. The glob above already excludes these; the patterns
    # ensure that widening the glob later cannot start shipping them silently.
    prospector.scanner.exclude_files:
      - 'sentinel_config\.json$'       # carries the profile source URLs
      - 'sentinel_runner_debug\.log$'  # unstructured runner debug output
      - '\.logs\.removing$'            # transient file created while a container is removed
      - '\.gz$'                        # rotated + compressed generations -- see section 4

    parsers:
      - ndjson:
          target: ""                   # promote the event's keys to the document root
          add_error_key: true          # surface a malformed line instead of dropping it silently
          overwrite_keys: true

    # Keep draining a generation that was renamed or unlinked out from under us.
    close.on_state_change.renamed: false
    close.on_state_change.removed: false

    # Processors are scoped to THIS input on purpose: the artifact manifests
    # below are a different shape and must not be run through these renames.
    processors:

      # --- ECS renames. Every row here appears on the Field mappings page. ---
      - rename:
          fields:
            - { from: "resolved_command",  to: "process.command_line" }
            - { from: "working_directory", to: "process.working_directory" }
            - { from: "shell",             to: "process.name" }
            - { from: "exit_code",         to: "process.exit_code" }
            - { from: "start_time",        to: "process.start" }
            - { from: "end_time",          to: "process.end" }
            - { from: "hostname",          to: "host.hostname" }
            - { from: "container_name",    to: "container.name" }
            - { from: "event_id",          to: "event.id" }
            # `labels` is a core ECS object field for custom key/value pairs,
            # which is the exact shape of the operator's `metadata`. It is NOT
            # renamed into exegol.* -- see the Field mappings page for why the
            # custom-namespace rule sends it here instead.
            - { from: "metadata",          to: "labels" }
            # --- exegol.* custom namespace (no standard equivalent) ---
            - { from: "user_command",      to: "exegol.user_command" }
            - { from: "envs_in_command",   to: "exegol.envs_in_command" }
            - { from: "schema_version",    to: "exegol.schema_version" }
            - { from: "output",            to: "exegol.output" }
            - { from: "output_truncated",  to: "exegol.output_truncated" }
            - { from: "output_bytes",      to: "exegol.output_bytes" }
            - { from: "output_status",     to: "exegol.output_status" }
            - { from: "artifact_id",       to: "exegol.artifact_id" }
            #
            # `tags` is deliberately absent from this list, and its absence is
            # the mapping rather than an omission. Sentinel emits it already
            # named `tags`, already an array of keywords -- which is the core
            # ECS field itself -- so there is nothing to rename. Adding a
            # tags -> tags row here would error, not no-op.
          # Required, not defensive: SIX of the fields above are CONDITIONAL and
          # absent from a majority of events. `artifact_id` appears only when a
          # profile rule fired; the four `output*` fields depend on the inline
          # capture setting and on whether a window was found; `metadata` appears
          # only when the operator exported the variable. With fail_on_error left
          # at its default the whole rename set is reverted on any event missing
          # any one of them, so none of the other renames are applied either.
          #
          # With fail_on_error: false the converse also holds, and it is worth
          # knowing: a rename whose DESTINATION already exists fails silently and
          # the source field keeps its original name while every other rename
          # still applies. That is the failure you get if something else in your
          # pipeline already sets `labels`. Do not set one globally.
          ignore_missing: true
          fail_on_error: false

      # --- Constants. `category` and `type` must be ARRAYS even with one member. ---
      - add_fields:
          target: event
          fields:
            kind: event
            category: ["process"]
            type: ["start", "end"]
            module: exegol_sentinel
            dataset: exegol_sentinel.command

      # --- Derived fields. Neither is a rename; both are computed. ---
      - script:
          lang: javascript
          tag: exegol_sentinel_derived
          source: >
            function process(event) {
                // event.outcome from the NULLABLE exit code. event.Get() returns
                // null both for a JSON null and for an absent key, and ECS maps
                // that same case to "unknown", so one branch covers both.
                var code = event.Get("process.exit_code");
                if (code === null) {
                    event.Put("event.outcome", "unknown");
                } else if (code === 0) {
                    event.Put("event.outcome", "success");
                } else {
                    event.Put("event.outcome", "failure");
                }

                // event.duration is defined by ECS in NANOSECONDS. Sentinel
                // timestamps carry millisecond precision, so the subtraction
                // yields milliseconds and must be scaled by 1e6. Getting this
                // wrong is silent: every command reports a duration one million
                // times too long. The timestamps are exactly the ECMAScript
                // Date Time String Format, so Date.parse handles them natively.
                var started = event.Get("process.start");
                var ended = event.Get("process.end");
                if (started !== null && ended !== null) {
                    var ms = Date.parse(ended) - Date.parse(started);
                    if (!isNaN(ms)) {
                        event.Put("event.duration", ms * 1000000);
                    }
                }
                return event;
            }
            function test() {
                // Filebeat runs this at load time and refuses to start the
                // processor if it throws -- your deployment validates itself.
                var e = process(new Event({
                    process: {
                        exit_code: 0,
                        start: "2026-01-15T09:41:07.812Z",
                        end: "2026-01-15T09:41:12.089Z"
                    }
                }));
                if (e.Get("event.outcome") !== "success") {
                    throw "expected event.outcome === success";
                }
                if (e.Get("event.duration") !== 4277000000) {
                    throw "expected event.duration === 4277000000 nanoseconds";
                }
                var u = process(new Event({process: {exit_code: null}}));
                if (u.Get("event.outcome") !== "unknown") {
                    throw "expected a null exit_code to map to unknown";
                }
            }

      # --- Deduplication. This is what makes a re-read harmless. ---
      # `event_id` is unique per event and exists for exactly this purpose, so
      # it is the natural document id. Assigning it makes ingest IDEMPOTENT:
      # re-reading a rotated generation after an agent restart overwrites the
      # same documents instead of duplicating them.
      - copy_fields:
          fields:
            - from: event.id
              to: "@metadata._id"
          fail_on_error: false
          ignore_missing: true

  # ===========================================================================
  # Input 2 -- artifact manifests (default posture: manifests as events,
  # binaries stay on disk). See section 5 to change that.
  # ===========================================================================
  - type: filestream
    id: exegol-sentinel-artifacts
    enabled: true
    paths:
      - /home/*/.exegol/sentinel/*/artifacts/*/env_vars.json
      - /home/*/.exegol/sentinel/*/artifacts/*/exec_*.json
    file_identity.native: ~
    prospector.scanner.check_interval: 10s

    parsers:
      # Manifests are pretty-printed JSON DOCUMENTS, one per file -- not NDJSON.
      # Reassemble each file into a single message: every line that does not
      # start a new document is appended to the one that did.
      - multiline:
          type: pattern
          pattern: '^{'
          negate: true
          match: after

    processors:
      - decode_json_fields:
          fields: ["message"]
          target: "exegol.artifact"
          add_error_key: true

      - add_fields:
          target: event
          fields:
            kind: event
            module: exegol_sentinel
            dataset: exegol_sentinel.artifact

      # The artifact directory NAME is the artifact_id -- the manifests do not
      # carry it inside them. Lifting it out of the path is what correlates a
      # manifest back to the command event that produced it.
      - script:
          lang: javascript
          tag: exegol_sentinel_artifact_id
          source: >
            function process(event) {
                var path = event.Get("log.file.path");
                if (path !== null) {
                    var match = /\/artifacts\/([0-9a-f]{32})\//.exec(path);
                    if (match !== null) {
                        event.Put("exegol.artifact_id", match[1]);
                    }
                }
                return event;
            }
            function test() {
                var e = process(new Event({log: {file: {path:
                    "/home/op/.exegol/sentinel/inst_1/artifacts/" +
                    "a1b2c3d4e5f60718293a4b5c6d7e8f90/env_vars.json"}}}));
                if (e.Get("exegol.artifact_id") !== "a1b2c3d4e5f60718293a4b5c6d7e8f90") {
                    throw "expected the artifact id to be lifted out of the path";
                }
            }

output.elasticsearch:
  hosts: ["https://elasticsearch.example.internal:9200"]
  index: "exegol-sentinel-%{+yyyy.MM.dd}"
```

> [!WARNING] `exegol.output` needs an index template decided before you ship it
> The renames above now carry the inline terminal output into Elasticsearch, and the `output.elasticsearch` block writes to a date-suffixed index with **no template**, so the field is typed by dynamic mapping. That default is `text` with a `keyword` sub-field capped by `ignore_above: 256`: the full text is indexed at a cost proportional to your whole captured volume, while the aggregatable sub-field silently holds nothing for any command that printed more than 256 characters.
>
> Decide before the first ingest, not after: map `exegol.output` as `wildcard` or `match_only_text` in an index template, and size the daily volume against it, because one free-form field of arbitrary size on every event can dwarf the rest of the event combined. If neither is acceptable, the control is upstream -- set `log_output.enabled: false` in the Sentinel configuration so the data never leaves the container, rather than dropping it here. See [the `exegol.*` custom namespace](/sentinel/siem/field-mappings#the-exegol-custom-namespace).

> [!WARNING] Environment dumps can still contain secrets
> `env_vars.json` is redacted by a **deny-by-pattern list**, not an allow-by-default filter. Only variables whose *name* matches a configured pattern are masked; a credential in a variable nobody thought to name in the list ships in clear, into an index with a different reader population than the host filesystem it came from.
>
> Before enabling the artifact input, read the redaction list your profiles actually use, and treat the resulting index as credential-bearing.

> [!WARNING] The event's own `tags` silently replaces any Filebeat input tags
> The `ndjson` parser above runs with `target: ""` and `overwrite_keys: true`, which is what promotes the event's keys to the document root. `tags` is one of the fields Filebeat itself normally sets, so on any event where the operator exported `EXEGOL_SENTINEL_TAGS` the decoded value **overwrites** whatever the input's own `tags:` option or an `add_tags` processor put there. It does not merge with them.
>
> That is the correct outcome for the ECS mapping, and it is a trap for anything else: if you route, filter or bill on a Filebeat-side tag, those tags disappear from exactly the events an operator chose to tag, and nothing reports it. Keep shipper-side routing markers in a field of your own under `exegol.*` or `fields:`, never in `tags`.

**Two alternatives.**

The `ndjson` parser has a `document_id` option that sets the document id straight from a JSON key. `document_id: event_id` would replace the `copy_fields` processor entirely. It is not used above because the vendor documents that the named key is **removed from the document** once consumed, which would leave `event.id` unpopulated and break the mapping row for it. Use it only if you do not need `event.id` as a searchable field.

`process.env_vars` is the ECS-native home for environment data, but it is a `keyword` array of `"KEY=value"` strings while Sentinel emits an object. The [Field mappings](/sentinel/siem/field-mappings#the-exegol-custom-namespace) page explains why the object form under `exegol.envs_in_command` is the default and what deriving the array costs you.

=== Splunk

**Read the tier table before you paste anything.** Which tier a stanza lands on is the single most commonly misconfigured part of this integration, and the failure mode is silent.

| File | What it carries | Deployed on |
| ---- | --------------- | ----------- |
| `inputs.conf` | the `monitor` stanzas, source types, index | **Universal Forwarder** |
| `props.conf` | `INDEXED_EXTRACTIONS`, `TIMESTAMP_FIELDS`, `TIME_FORMAT`, `TZ`, line breaking, `TRUNCATE` | **Universal Forwarder** |
| *(nothing)* | no parsing configuration is needed or has any effect | **Indexer** |
| `props.conf` | `KV_MODE`, `FIELDALIAS-*`, `EVAL-*` | **Search head** |
| `eventtypes.conf`, `tags.conf` | data-model membership | **Search head** |

Read as a sentence: the monitor stanzas and the structured-data extraction settings go on the Universal Forwarder, the indexer needs no parsing configuration at all, and the field aliases, the evaluated constants and the event-type and tag definitions go on the search head.

The parsing half of that table is the part people get wrong. Splunk documents it plainly: when you forward structured data to an indexer, **it is not parsed when it arrives at the indexer, even if you have configured `props.conf` on that indexer with `INDEXED_EXTRACTIONS`**. Forwarded data skips the indexer's parsing, merging and typing pipelines entirely, and the vendor's own instruction is that field-extraction settings for forwarded structured data must be configured on the forwarder.

Put the extraction on the indexer and you get no error message, no warning, and an index full of raw JSON text with none of the fields the rest of this page assumes.

> [!NOTE] This corrects the usual two-way framing
> "The forwarder forwards, the indexer parses" is the shape most Splunk integration guides describe, and for unstructured data it is right. Structured-data extraction is the exception: it is the one parsing job a Universal Forwarder does perform, and it is the one the indexer will not. The real split is three-way, and each block below is labelled with the tier it belongs on.

#### Universal Forwarder

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/inputs.conf
# TIER: UNIVERSAL FORWARDER (the Docker host)

[monitor:///home/*/.exegol/sentinel/*/logs.json]
disabled   = false
sourcetype = exegol:sentinel:event
index      = exegol_sentinel
# The source-checksum salt is deliberately left unset. Sentinel rotates by
# renaming the file, so a salted checksum would see the renamed generation as a
# brand-new source and re-index the entire generation as duplicate events.
# Leave crcSalt alone; the default checksum follows the rename correctly.

# Artifact manifests get their OWN source type so the event stream can keep a
# sane truncation bound while manifests get an unlimited one (see props.conf).
[monitor:///home/*/.exegol/sentinel/*/artifacts/*/env_vars.json]
disabled   = false
sourcetype = exegol:sentinel:artifact
index      = exegol_sentinel

[monitor:///home/*/.exegol/sentinel/*/artifacts/*/exec_*.json]
disabled   = false
sourcetype = exegol:sentinel:artifact
index      = exegol_sentinel
# These two stanzas need only sentinel-group membership on the forwarder's
# service account -- per-command artifact directories are mode 750. See
# section 2; running the forwarder as root is not required and not advised.
```

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/props.conf
# TIER: UNIVERSAL FORWARDER -- this is where structured-data parsing happens.

[exegol:sentinel:event]
INDEXED_EXTRACTIONS = json
TIMESTAMP_FIELDS    = start_time
TIME_FORMAT         = %Y-%m-%dT%H:%M:%S.%3NZ
TZ                  = UTC
SHOULD_LINEMERGE    = false
LINE_BREAKER        = ([\r\n]+)
TRUNCATE            = 0
# %3N is Splunk's enhanced-strptime millisecond specifier, matching the
# millisecond ISO 8601 form Sentinel emits, with the literal Z designator.
# Sub-second parsing depends on ADD_EXTRA_TIME_FIELDS being left enabled.
# The event stream is true NDJSON -- one object per line -- so the newline
# line breaker above is both correct and what INDEXED_EXTRACTIONS would pick.

[exegol:sentinel:artifact]
INDEXED_EXTRACTIONS = json
TRUNCATE            = 0
# TRUNCATE = 0 is not optional here. The product default is 10000 bytes, while
# a single execution manifest can carry up to 1 MB of standard output plus
# another 1 MB of standard error. The default cuts the JSON mid-value and the
# manifest stops being parseable at all.
#
# No line-breaking settings on purpose: manifests are pretty-printed JSON
# DOCUMENTS spanning many lines, not one object per line. INDEXED_EXTRACTIONS
# selects the line-breaking defaults appropriate to the format; overriding them
# here with a newline breaker would shred each manifest into unparseable lines.
```

#### Search head

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/props.conf
# TIER: SEARCH HEAD -- search-time normalization only.

[exegol:sentinel:event]
KV_MODE = none
# Explicit, and required. The forwarder already extracted these fields at index
# time. Setting KV_MODE = json here would extract the same JSON a SECOND time at
# search time, duplicating every value in every event. The vendor calls this out
# directly: do not set both.

FIELDALIAS-exegol_sentinel_cim = resolved_command AS process shell AS process_name container_name AS dest working_directory AS process_current_directory
EVAL-vendor_product = "Exegol Sentinel"
EVAL-os             = "Linux"

# Alias container_name OR hostname to dest -- whichever identifies an endpoint
# in your estate -- but not both. The line above uses container_name.
#
# Five fields that Endpoint.Processes requires have no source in a Sentinel
# event: the operating-system user, the process and parent process identifiers,
# the resolved executable path, and the allow/deny action. They are deliberately
# given no evaluated stanza here. Synthesizing them would make these events pass
# a data-model check while corrupting every correlation built on top of them.
# See the Field mappings page, "Required fields not satisfiable today".
#
# Six fields carry NO alias here, and that is the mapping rather than an
# oversight: `metadata`, `tags` and the four `output*` fields have no CIM
# Processes equivalent at all. The dataset models process EXECUTION and has no
# field for what a process printed, nor for operator-supplied context. They stay
# under their emitted names, queryable directly, and are left out of the data
# model rather than force-fitted into a loosely related field. In particular
# `output_status` is NOT `action`: that field is an endpoint allow-or-block
# verdict, and this one reports whether the output capture itself succeeded.
```

Three things to expect from the Splunk side of these two fields, none of which need configuration but all of which are easier to know now than to discover in a search.

**Sentinel's `tags` is not Splunk's `tag`, and it has no bearing on data-model membership.** `tags.conf` below produces the multivalue `tag` field, singular, from the event type. Sentinel's `tags` is plural, is ordinary indexed event content typed by the operator, and gates nothing. The two names are close enough to be read as the same mechanism and are not related at all, so a search that filters on the wrong one silently returns the wrong population.

**`metadata` arrives flattened, not as an object.** `INDEXED_EXTRACTIONS = json` on the forwarder flattens nested JSON into dot-separated field names, so an operator who exported `client=EnterpriseX` gets a field named `metadata.client`, not a `metadata` object to reach into. Search for `metadata.client="EnterpriseX"`. Because the operator picks these key names, the resulting field names are not knowable in advance and cannot be enumerated in a configuration — which is the other reason there is no alias stanza for them. Confirm the exact flattened spelling against a live event before you build saved searches on it.

**Both are unverified operator input.** They are typed by the audited party, in an environment variable any process in their container can read or change. Use them to filter and group an engagement's events; never key an access restriction, an index-routing rule or an attribution report on either. See the [Field mappings](/sentinel/siem/field-mappings#exegol-to-splunk-cim) page.

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/eventtypes.conf
# TIER: SEARCH HEAD

[exegol_sentinel_process]
search = sourcetype=exegol:sentinel:event
```

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/tags.conf
# TIER: SEARCH HEAD

[eventtype=exegol_sentinel_process]
process = enabled
report  = enabled
```

**These last two files are not optional polish. They are the mechanism.** Field aliases alone put nothing into a data model, however correctly they are written: the `Processes` dataset gates membership on an event type carrying the `process` and `report` tags. Without `eventtypes.conf` and `tags.conf` the aliases produce correctly named fields that no data-model search will ever see.

> [!WARNING] Decide about `tags.conf`
> Applying these tags places the events **into** `Endpoint.Processes` with five of its required fields empty. The [Field mappings](/sentinel/siem/field-mappings#required-fields-not-satisfiable-today) page argues that this is a *worse* outcome than staying out of the dataset, because searches then return results that look complete and nobody questions the population.
>
> `eventtypes.conf` on its own is safe and useful: it gives you a named event type to search without asserting any dataset membership. Deploy `tags.conf` only if you have read that page and want dataset membership on those terms.

> [!NOTE] These examples target Splunk 9.0 or later
> Field-alias resolution semantics changed in the 9.0 release, specifically the behaviour when a source field is missing or the destination field already exists. If you run an earlier version, read the vendor's release note on the field-alias behaviour change before pasting the search-head block.

:::

## 4. Rotated generations and compression

The rotation contract raises a question this page has to answer, because the answer changes a setting you may already have on.

**Filebeat 8.x does not decompress rotated generations.** The `filestream` input reads plain files. When rotation compresses a generation to `logs.<timestamp>.json.gz`, that generation is not readable by the agent, which is why `\.gz$` is in the exclusion list above rather than being quietly harvested and producing binary garbage.

That matters because of a specific, realistic failure: **an agent that is down across a rotation misses a whole generation.** The agent follows `logs.json` through the rename via its open descriptor, so a rotation while it is running is transparent. A rotation while it is *stopped* is not: it restarts on a fresh, empty `logs.json` and never looks at what was rotated away.

You have two supportable postures.

**Recommended for a SIEM-integrated deployment: disable compression.** Set `compress` to `false` in the profile's `log_rotation` configuration. Rotated generations then stay plain JSON, and you can add `logs.*.json` to the input's `paths` as a catch-up path. This is safe precisely because deduplication is configured: `event_id` is the document id, so re-reading a generation the agent already shipped overwrites the same documents rather than duplicating them. The cost is disk on the host.

**Keep compression, and treat rotated generations as archival only.** Compressed generations remain on disk for forensics and are retrieved by hand. Accept that a generation rotated while the agent was down is **not** recoverable through the agent.

> [!TIP] Retention decides how long you have to notice
> `max_files` defaults to `0`, meaning generations are never pruned, so a catch-up is always possible, however late. Setting a non-zero limit converts agent downtime into a hard deadline: once enough rotations have happened, the missed generation is deleted and the events in it are gone.

Newer Filebeat releases can read GZIP files, but only with the `fingerprint` file identity, which is mutually exclusive with the `native` pin the rename-rotation contract depends on. It is not a way out of this choice.

## 5. Optional: ingest the artifact binaries too

**The default is everything above, and everything above leaves binaries on disk.** Packet captures and Kerberos credential caches stay in the artifact directory; the JSON manifests become events, and the `exegol.artifact_id` on a command event is what points an analyst at the directory holding them:

```
~/.exegol/sentinel/{container_instance}/artifacts/{artifact_id}/
```

That is a chosen posture, not an omission. This section describes what changes if your team wants the binaries in the index as well. It is **optional**, it is not what the rest of this page configures, and it should be a decision somebody makes on the record.

> [!DANGER] Read both of these before enabling binary ingestion
> **Your licensed index volume grows by the full size of every capture.** A packet capture is not a log line. One long-running capture on a busy interface can exceed the entire day's event volume for the deployment, and the licensing cost is charged at ingest whether or not anybody ever searches it.
>
> **You are moving credential material into a searchable index.** Kerberos credential caches are usable credentials. Environment values that escaped the redaction denylist are usable credentials. On disk they sit behind a filesystem access-control model with a small, known reader population; in an index they sit behind that index's access-control model, with a much larger one. **DO NOT** enable this without deciding, explicitly, that everyone who can search that index is allowed to hold the engagement's credentials.

**Splunk.** Add a source type for the binaries on the forwarder, and the monitor stanzas that feed it. Binary files are ignored by default, so this needs an explicit opt-in. The `/home/*/` [caveat from section 3](#_3-shipper-configuration) applies to these stanzas too.

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/inputs.conf
# TIER: UNIVERSAL FORWARDER -- OPTIONAL, in addition to the stanzas in section 3.

[monitor:///home/*/.exegol/sentinel/*/artifacts/*/*.pcap]
disabled   = false
sourcetype = exegol:sentinel:binary
index      = exegol_sentinel_artifacts

[monitor:///home/*/.exegol/sentinel/*/artifacts/*/krb5cc_*]
disabled   = false
sourcetype = exegol:sentinel:binary
index      = exegol_sentinel_artifacts
```

```ini
# $SPLUNK_HOME/etc/apps/exegol_sentinel/local/props.conf
# TIER: UNIVERSAL FORWARDER -- OPTIONAL.

[exegol:sentinel:binary]
NO_BINARY_CHECK = true
TRUNCATE        = 0
# Binary files are skipped by default. This opt-in is what makes the stanzas
# above do anything at all -- which is also your last chance to not do it.
```

A separate index is used on purpose. It keeps the licensing impact measurable, and it lets the credential-bearing data carry different retention and different access control from the event stream.

**Filebeat.** No equivalent configuration is published here. The `filestream` input is a line-oriented reader with no binary transport: pointing it at a packet capture produces a stream of mangled pseudo-text, not the file. Teams that want binaries in Elasticsearch move them with an out-of-band job that encodes and posts them, which is a different piece of infrastructure with its own review. Publishing a wrong-shaped input here would only make it look easy.

## What this configuration does not do

Two limits to know before you roll this out.

**These configurations were reviewed, not executed.** Every setting above was checked against the vendors' current published references (the Filebeat processor and `filestream` references, the Splunk structured-data extraction topic, and the `props.conf` specification), but the configurations were **not run against a live Filebeat or Splunk instance**. Deploy them against a test index first and confirm that fields arrive parsed rather than as raw text before pointing them at production. The two `script` processors carry `test()` functions that Filebeat runs at load time, so those at least fail loudly rather than silently.

**The Splunk half is alias-and-tag based, not data-model compliant.** The aliases give you CIM naming for every field that genuinely has a source. They do not make these events satisfy the `Endpoint.Processes` required-field set, because five of those fields are not emitted at all. See [Required fields not satisfiable today](/sentinel/siem/field-mappings#required-fields-not-satisfiable-today) for what each absence costs, and re-read the warning above `tags.conf` before granting dataset membership.
