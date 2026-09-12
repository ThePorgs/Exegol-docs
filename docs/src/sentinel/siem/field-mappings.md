# Field mappings <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

This page translates every field of an Exegol Sentinel log event into its Elastic Common Schema (ECS) and Splunk Common Information Model (CIM) equivalent. Each source field is defined on the [Log schema reference](/sentinel/siem/log-schema). That page is the contract; this one is the translation of it. The mappings below are applied by the shipper and search-head configurations on the [Ingest configuration](/sentinel/siem/ingest-configuration) page.

## Verified against

The field names on this page were checked against the following versions. A mapping is only as good as the schema version it was written for, so start by confirming these match your estate.

| Target | Version verified |
| ------- | ---------------- |
| Elastic Common Schema | **8.17.0**, the final 8.x minor. Every ECS name below was confirmed present, at the stated type and level, in the ECS 8.17.0 generated field reference |
| Filebeat | **8.x**, the shipper whose `processors` implement the ECS half |
| Splunk Enterprise / Universal Forwarder | **9.0 or later** |
| Splunk Common Information Model | **6.x** (checked against 6.1) |

Two version notes that change what you should paste:

- **The ECS mapping does not require ECS 8.5 or later.** `process.env_vars` reached general availability in ECS 8.5, but this mapping does not use it. See [the `exegol.*` custom namespace](#the-exegol-custom-namespace) for why. Every other ECS field used here has existed since ECS 8.0.
- **Field-alias resolution semantics changed in Splunk 9.0.** The behaviour of an alias when the source field is missing, or when the destination field already exists, is not the same on 8.x. If you run Splunk 8.x, read the vendor release note on the field-alias behaviour change before pasting the search-head configuration. The aliases below are written against 9.0 semantics.

> [!NOTE] Names that could not be confirmed are not published
> Every target field name on this page exists in the vendor schema at the version stated above. Where Sentinel has no equivalent, the row says so explicitly rather than offering an approximate name. An invented field name reads as authoritative and produces a silently empty field in production, which is worse than a documented gap.

## Exegol to ECS 8.x

Between them, the four tables in this section account for all nineteen Sentinel fields exactly once: eleven map directly onto a standard ECS field, and eight have no standard equivalent and live under the `exegol.*` custom namespace. Two further ECS fields are *derived* from Sentinel values rather than renamed from them, and five are constants set by the shipper.

### Direct field mappings

Rows are in the schema page's emission order, so the two pages read side by side.

| Sentinel field       | ECS 8.x field                              | ECS type   | Notes                                                                                                                       |
| -------------------- | ------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `start_time`         | `@timestamp`, `process.start`, `event.start` | date       | One source, three destinations. The ISO 8601 UTC form Sentinel emits parses natively as an ECS `date`                          |
| `end_time`           | `process.end`, `event.end`                 | date       | Same format as `start_time`                                                                                                   |
| `hostname`           | `host.hostname`                            | keyword    | Core-level field. May be the empty string. See the schema page                                                               |
| `container_name`     | `container.name`                           | keyword    | The Exegol container name, which is what identifies the engagement instance                                                   |
| `working_directory`  | `process.working_directory`                | keyword    | May be the empty string                                                                                                       |
| `shell`              | `process.name`                             | keyword    | The shell **is** the process that ran the command line. Always `bash` or `zsh`                                                |
| `resolved_command`   | `process.command_line`                     | wildcard   | The alias-resolved, environment-expanded form is the true command line. This is a **standard** mapping, not a custom field     |
| `exit_code`          | `process.exit_code`                        | long       | **Nullable.** Sentinel emits JSON `null` when the shell hook reported no integer code; do not coerce it to `0`                 |
| `event_id`           | `event.id`                                 | keyword    | Also the natural Elasticsearch document `_id`. Using it as the document id makes re-ingest idempotent, which is what makes re-reading a rotated file safe |
| `metadata`           | `labels`                                   | object     | Core-level field, described by ECS as custom key/value pairs — an exact shape match for Sentinel's string-to-string object. **Emitted only when the operator exported the variable:** configure your rename to tolerate its absence |
| `tags`               | `tags`                                     | keyword    | Core-level field, normalized as an **array**, described by ECS as a list of keywords used to tag each event. **Emitted only when the operator exported the variable:** configure your rename to tolerate its absence |

**`tags` is the one field that needs no transformation at all.** The emitted name, the type and the semantics are already the ECS core field, so the shipper renames nothing and passes it through as it stands. Every other row on this page is a rename.

### Derived fields

These two ECS fields have **no** single Sentinel source field. They are computed by the shipper from fields above. They are listed separately so nobody looks for a rename that does not exist.

| ECS 8.x field    | ECS type | Derived from             | Rule                                                                                                       |
| ---------------- | -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `event.duration` | long     | `end_time` − `start_time` | The result must be expressed in **nanoseconds**                                                             |
| `event.outcome`  | keyword  | `exit_code`              | `0` maps to `success`, any non-zero value to `failure`, and JSON `null` to `unknown`. Those three are the only values ECS allows |

> [!WARNING] `event.duration` is in nanoseconds, not milliseconds
> ECS defines `event.duration` as the duration of the event **in nanoseconds**. Sentinel timestamps carry millisecond precision, so the natural subtraction yields milliseconds and must be multiplied by 1,000,000. Getting this wrong is silent: nothing fails, and every command in your index reports a duration one million times too long.

### Constants set by the shipper

These are not mapped from anything. The shipper sets them so the events are categorised correctly and are discoverable alongside other process data.

| ECS 8.x field    | ECS type        | Value                        |
| ---------------- | --------------- | ---------------------------- |
| `event.kind`     | keyword         | `event`                      |
| `event.category` | keyword (array) | `["process"]`. The value must be an **array**, even with one member |
| `event.type`     | keyword (array) | `["start", "end"]`. A Sentinel event records a completed execution, so it carries both |
| `event.module`   | keyword         | `exegol_sentinel`            |
| `event.dataset`  | keyword         | `exegol_sentinel.command`    |

### The `exegol.*` custom namespace

Eight Sentinel fields have no standard ECS equivalent. The rule this documentation follows, without exception:

**A field with no standard equivalent is published under the documented `exegol.*` prefix, never as an unprefixed key at the document root, and never force-fitted into a loosely related standard field.** A root-level custom key is a liability because ECS may later claim that name, at which point your index has a mapping conflict and the field stops being queryable. Force-fitting is worse: a value in the wrong standard field silently corrupts every dashboard and detection built on that field.

| Sentinel field    | Custom ECS field         | Type                   | Why there is no standard equivalent                                                                                                                     |
| ----------------- | ------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_command`    | `exegol.user_command`    | wildcard               | ECS has no concept of an *as-typed, pre-alias-resolution* command line. `process.command_line` already holds the resolved form, and putting both in it would be lossy |
| `envs_in_command` | `exegol.envs_in_command` | object (string→string) | **Shape mismatch, not a missing concept.** See below                                                                                                       |
| `schema_version`  | `exegol.schema_version`  | long                   | A Sentinel-specific contract version. No ECS field describes the version of a producer's own event schema                                                    |
| `artifact_id`     | `exegol.artifact_id`     | keyword                | Identifies the Sentinel artifact directory produced by a profile rule. ECS has no concept for it. Remember this field is **conditional**. Configure your rename to tolerate its absence |
| `output`          | `exegol.output`          | wildcard               | **Custom by concept.** ECS models process *metadata*, not the terminal output a process produced; there is no field for it at any level, and no loosely related one to force-fit it into. Configuration-dependent: configure your rename to tolerate its absence |
| `output_truncated`| `exegol.output_truncated`| boolean                | **Custom by concept.** Whether the captured output was cut to fit the configured cap. Emitted with `exegol.output` |
| `output_bytes`    | `exegol.output_bytes`    | long                   | **Custom by concept.** The size of the raw terminal window, before cleaning and before any cut. It is larger than the length of `exegol.output` **even when `exegol.output_truncated` is `false`**: the difference is escape sequences and control bytes, not dropped content. Only `exegol.output_truncated` tells you whether content was dropped; never the gap between the two numbers. Emitted with `exegol.output` |
| `output_status`   | `exegol.output_status`   | keyword                | **Custom by concept.** `unavailable` or `error`, emitted only when the capture did not succeed. It is **not** an ECS `event.outcome`: that field already carries the command's own exit status, and overwriting it with the capture's status would report a successful command as failed |

**On `metadata` and `tags`, the `exegol.*` rule sends them elsewhere, and that is the rule working rather than an exception to it.** The rule is that a field with **no standard equivalent** goes under the prefix. These two *have* standard equivalents — `labels` and `tags` are core ECS fields for exactly this data — so the same rule puts them there. Prefixing them would hide operator context from every dashboard and query that already reads those two fields.

> [!WARNING] `labels` and `tags` are operator-supplied and unverified
> Both are typed by the audited party, in an environment variable any process in their container can read, change or unset. They are a convenience for filtering and grouping an engagement's events; they are **never** an identity, an attestation or a scoping control. Do not key an access restriction, an index-routing rule or an attribution report on either of them.

**On the four `output*` fields, be precise about the reason too.** They are custom because ECS has **no concept** for the terminal output of a process, not because of a shape mismatch. That distinction decides what you may do about it: a shape mismatch can be resolved by a shipper-side transform, as `envs_in_command` can be below, while a missing concept cannot. There is nothing to derive them into.

> [!WARNING] `exegol.output` is the field most likely to break an index mapping and a licence budget
> It is free-form text of arbitrary size, one field per event, on every event. Two consequences to decide before you ingest it: index it as `wildcard` or `match_only_text` rather than `keyword`, because a `keyword` mapping is bounded and long values are silently dropped at index time by `ignore_above`; and size your daily volume against it, because it can dwarf every other field of the event combined. If neither is acceptable, the control is upstream: turn the inline field off in the Sentinel configuration rather than dropping it in the shipper, so the data never leaves the container in the first place.

**On `envs_in_command`, be precise about the reason.** ECS *does* have a field for this data: `process.env_vars`, general since ECS 8.5. It is not used here because of a **shape mismatch**: `process.env_vars` is a `keyword` **array of `"KEY=value"` strings**, while Sentinel emits an **object** mapping variable name to value. The object form is kept as the recommended default because it is lossless, keyed, and needs no scripting in the shipper.

If your team prefers ECS-native interoperability, the array can be **derived** from the object with a script processor in the shipper: emit one `"KEY=value"` string per entry into `process.env_vars`. Two consequences to weigh first: the data is then stored twice, and every environment value that escaped the redaction denylist is exposed in a second indexed field. The default keeps that surface as small as possible.

> [!WARNING] `user.name` cannot be populated
> ECS `user.name` is the primary identity-correlation field for process events: it is what a command-execution detection is keyed on. Sentinel does **not** emit the operating-system user, so this field stays empty. There is no mapping, no derivation, and no workaround at ingest time; the fix is upstream, in what the agent emits. See [Fields that are absent on purpose](/sentinel/siem/log-schema#fields-that-are-absent-on-purpose) on the Log schema reference for the full list of fields a process-data-model consumer will look for and not find.

## Exegol to Splunk CIM

### Read this before the tables

Three facts determine what this section can and cannot give you. Read them together. Taken separately, any one of them invites the wrong conclusion.

1. **The `Endpoint` data model is not directly searchable.** A search targets one of its datasets: `Processes`, `Ports`, `Services`, `Filesystem`. A command-execution event belongs semantically in `Endpoint.Processes`.
2. **Dataset membership is gated by tags, not by field aliases.** Aliasing every field correctly still puts nothing into a data model. Membership comes from an `eventtype` definition plus the `tags` the `Processes` dataset constrains on: `process` and `report`. The [Ingest configuration](/sentinel/siem/ingest-configuration) page carries the `eventtypes.conf` and `tags.conf` stanzas.
3. **Sentinel events cannot satisfy the `Processes` required-field set today.** Five of its required fields have no source in a Sentinel event.

The consequence of the third fact: **these events will not populate an accelerated `Endpoint.Processes` data model, and Enterprise Security correlation searches keyed on the missing fields will not match.** Adding the tags anyway does not change that. The events enter the dataset but arrive incomplete, which is a worse failure mode than staying out of it, because a search returns results and nobody notices the population is wrong.

What this section therefore publishes is **CIM-style field aliases**: the CIM naming you expect for every field that genuinely can be normalized, plus an explicit account of what is not satisfiable. It does not assert `Endpoint.Processes` data-model membership.

### Mappings that are satisfiable today

| Sentinel field                  | CIM field                   | Status                                                                                                     |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `container_name`                | `dest`                      | **Required**, satisfiable. The Exegol container is the endpoint the command ran on                            |
| `hostname`                      | `dest`                      | **Required**, satisfiable. An alternative source for the same destination; alias whichever of the two identifies an endpoint in your estate, not both |
| `resolved_command`              | `process`                   | **Required**, satisfiable. The alias-resolved command line                                                    |
| `shell`                         | `process_name`              | **Required**, satisfiable. Always `bash` or `zsh`                                                             |
| `working_directory`             | `process_current_directory` | Optional                                                                                                       |
| *(constant `"Exegol Sentinel"`)* | `vendor_product`            | Optional. A constant set on the search head, not mapped from the event                                         |
| *(constant `"Linux"`)*          | `os`                        | Optional. Exegol containers are Linux-only                                                                     |
| `start_time`                    | *(the event time, `_time`)* | Populated at **index time** through the timestamp-field setting on the forwarder, not through a search-time alias |

### Sentinel fields with no CIM `Processes` equivalent

These stay in the custom namespace. The `Processes` dataset simply has no field for them.

| Sentinel field    | Status                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `exit_code`       | **No CIM equivalent.** `process_exit_code` is not a `Processes` field. The dataset models process *execution*, not process *outcome* |
| `end_time`        | No CIM equivalent. `Processes` carries a single event time, not a start/end pair                                              |
| `user_command`    | No CIM equivalent. The as-typed form has no counterpart                                                                      |
| `envs_in_command` | No CIM equivalent                                                                                                            |
| `event_id`        | No CIM equivalent. Keep it: it is your deduplication key                                                                      |
| `schema_version`  | No CIM equivalent                                                                                                            |
| `artifact_id`     | No CIM equivalent                                                                                                            |
| `output`          | **No CIM equivalent.** The `Processes` dataset models process execution and carries no field for what a process printed        |
| `output_truncated`| No CIM equivalent                                                                                                            |
| `output_bytes`    | No CIM equivalent                                                                                                            |
| `output_status`   | **No CIM equivalent**, and specifically not `action`: that field is an endpoint allow-or-block verdict, and this one reports whether the output capture itself succeeded |
| `metadata`        | No CIM equivalent. Operator-supplied key/value context, emitted only when the operator exported the variable                  |
| `tags`            | **No CIM equivalent, and not the Splunk `tag` field.** Fact 2 above uses the word *tags* for the `tags.conf` stanza that gates `Processes` dataset membership; this is a different thing entirely. Sentinel's `tags` is operator-supplied **event content**, it is emitted only when the operator exported the variable, and it has no bearing on dataset membership, which still comes from the stanza on the [Ingest configuration](/sentinel/siem/ingest-configuration) page |

### Required fields not satisfiable today

Each row below is a `Processes` **required** field that Sentinel has no source for. This table is the reason the section above stops at "CIM-style aliases".

| CIM required field  | Why it is absent                                                                                                           | What that costs you                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`              | The operating-system user is **not emitted** by Sentinel today. Capturing it is a requirement that has not yet shipped         | **The highest-impact gap.** Identity is what a command-execution detection is keyed on: every correlation search that groups, filters or risk-scores by user silently returns nothing for these events |
| `process_id`        | No process identifier is emitted                                                                                              | No process-tree correlation, and no join to any other endpoint source that keys on PID                                                                        |
| `parent_process_id` | No parent process identifier is emitted                                                                                       | Parent/child lineage cannot be reconstructed, which rules out the whole family of "suspicious parent spawned X" detections                                     |
| `process_exec`      | No resolved executable path is emitted                                                                                        | Detections matching on an executable name or path do not match. The leading token of `resolved_command` is an approximation, not the resolved path              |
| `action`            | Sentinel records that a command ran; it has no allow/deny verdict to report                                                   | Any search filtering on an endpoint allow-or-block outcome excludes these events entirely                                                                     |

The absence of the identity field is stated in three places in this documentation: on the [Log schema reference](/sentinel/siem/log-schema#fields-that-are-absent-on-purpose), in the ECS callout above, and here, so that no one deploys this integration believing identity correlation works.

> [!WARNING] These values are not synthesized
> It is technically easy to make the events look complete: give `user` a constant placeholder, derive an allow-or-block verdict for `action` from the command's return status, invent a process identifier. This documentation does none of it, and neither should your configuration.
>
> A process return status is **not** an endpoint allow/block verdict, and a placeholder identity is **not** an identity. Fabricating either one makes the events pass a data-model check while corrupting every correlation, dashboard and risk score built on top of them. A detection that reports coverage it does not have is worse than one that reports none.
>
> If you need the full required-field set, the fix is upstream: emit the missing fields from the agent. There is no search-time workaround.

### Verify the required-field list against your own installation

CIM required and optional field lists differ between CIM major versions, and this page is a snapshot. Do not trust it indefinitely. The dataset definitions ship as JSON with the CIM app itself, in the data-models directory of `Splunk_SA_CIM` under your Splunk apps path (`$SPLUNK_HOME/etc/apps/Splunk_SA_CIM/default/data/models`). Open the `Endpoint` model there and read the `Processes` dataset's constraints and field list on the version you actually run. That file, not this page, is the arbiter for your estate.

## How to keep this page current

This documentation set relies on one convention, which keeps the two mapping targets and the two ingest postures from quietly drifting apart:

- **Field *names* in both target schemas are decided here.** ECS and CIM naming decisions are made here and nowhere else.
- **The [Ingest configuration](/sentinel/siem/ingest-configuration) page implements these rows.** It must not introduce a mapping that does not appear here. If a configuration needs a mapping this page does not carry, this page changes first.
- **Automated drift protection covers the source fields only.** A test in the Exegol wrapper repository pins the *emitted* Sentinel structures against a golden list and fails when a field is added, removed, renamed or reordered, naming the pages to update. It does **not** pin the ECS or CIM target names. A change in a vendor schema is caught by review against the versions in [Verified against](#verified-against), not by the test suite. Re-check those versions whenever you upgrade a target platform.
