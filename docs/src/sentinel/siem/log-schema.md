# Log schema reference <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Exegol Sentinel writes one **newline-delimited JSON** (NDJSON) stream per container instance: every executed command produces exactly one JSON object, appended to the stream by the in-container logger when the command finishes. The file is `logs.json`, reachable from the Docker host at `~/.exegol/sentinel/{container_instance}/logs.json` and from inside the container at `/var/log/exegol/sentinel/logs.json`. Ingest it from the **host**. See [Getting started](/sentinel/getting-started) for enabling Sentinel and locating the directory, and [Actions](/sentinel/profiles/actions) for what produces the artifacts referenced by `artifact_id`.

This page defines every field an event can carry. It is the contract a SIEM parser is written against.

## Event fields

Fields are listed in **emission order**, which is also the key order on disk. The first twelve keys are `always` present. The four `output*` keys are governed by configuration and are described by their own [presence matrix](#the-inline-output-fields); [`metadata` and `tags`](#operator-supplied-metadata-and-tags) are governed by the operator's exported environment, which is re-read on **every** command, so two consecutive events from one container can legitimately differ; [`artifact_id`](#artifact-id) is conditional on runtime state. Complete examples are in [Sample events](#sample-events).

| Field | Type | Meaning |
| ----- | ---- | ------- |
| `start_time` | string | ISO 8601 UTC with **millisecond** precision and a single `Z`. Never a `+00:00` offset |
| `end_time` | string | Same format as `start_time`. The moment the command finished |
| `hostname` | string | The container's hostname. May be the empty string |
| `container_name` | string | The Exegol container name, falling back to `hostname` when unset |
| `working_directory` | string | The directory the command was launched from. May be the empty string |
| `shell` | string | Set by the shell hooks to `"bash"` or `"zsh"`. Not enforced at schema level: outside the hooks the logger emits `""` |
| `user_command` | string | The command **as typed**, aliases unexpanded. May be the empty string |
| `resolved_command` | string | Alias-resolved and `$VAR`-expanded form. [Expansion rules](#resolved-command) |
| `envs_in_command` | object (string→string) | Variables the command actually **referenced**. [Shape and redaction](#envs-in-command) |
| `exit_code` | integer \| null | Always a key; JSON `null` when unknown. [Nullability](#exit-code) |
| `event_id` | string | 32 **lowercase hexadecimal** characters, no dashes. Unique per event; the deduplication key |
| `schema_version` | integer | The version of this schema. See [`schema_version` policy](#schema-version-policy) |
| `output` | string | The cleaned terminal output of this command. Configuration-dependent. [Presence matrix](#the-inline-output-fields) |
| `output_truncated` | boolean | Whether bytes were dropped to fit the cap. Emitted with `output` |
| `output_bytes` | integer | The **true** total size of the capture before any cut. Emitted with `output` |
| `output_status` | string | `unavailable` or `error`. Emitted **only** when the capture did not succeed. [Presence matrix](#the-inline-output-fields) |
| `metadata` | object (string→string) | Operator-supplied engagement context, from `EXEGOL_SENTINEL_META`. [Presence and parse rules](#operator-supplied-metadata-and-tags) |
| `tags` | array of strings | Operator-supplied labels, from `EXEGOL_SENTINEL_TAGS`. [Presence and parse rules](#operator-supplied-metadata-and-tags) |
| `artifact_id` | string | Conditional join key, not "a rule fired". [Presence rules](#artifact-id) |

### `resolved_command`

The same command as `user_command`, after aliases are resolved and environment variables are expanded. Only `$VAR` and `${VAR}` are expanded, never `$(...)` or backticks, and never inside single quotes. The field is always present and may be the empty string.

### `envs_in_command`

Only the environment variables the command actually **referenced**. Keys are preserved. Values matching the profile's redaction denylist are replaced by `<REDACTED>`. The field is always present; when nothing was referenced the value is `{}`, not `null` and not absent.

### `exit_code`

Always present as a key. The JSON value is `null` whenever the shell hook did not report an integer exit code. A parser must accept `null` explicitly: treating it as a missing key, or coercing it to `0`, silently misreports command outcomes.

### `artifact_id`

Present when the artifact directory for this command **exists on disk at the moment the event is written**. 32 lowercase hexadecimal characters, no dashes. A parser must treat the field as optional, and must **not** infer that its absence means anything other than "the directory was not on disk when the event was written".

> [!WARNING] Presence is weaker than it looks
> The directory is created for **every** command, before any rule is evaluated, and the post-execution phase removes it again when nothing was collected. The event is written after a **one-second** head start for that phase, so an event can legitimately carry an `artifact_id` whose directory holds nothing but internal marker files, when the post-execution phase had not finished cleaning up within that second, or when it never ran at all because the profile configuration was missing or unparseable. In the latter case the directory is never cleaned up, so **every** command on that container carries an `artifact_id` pointing at an empty directory.
>
> Treat `artifact_id` as a *join key*, not as a boolean "this command produced artifacts". If you need that boolean, test the directory for at least one non-dotfile. Do not test the field.

### The inline output fields

`output`, `output_truncated`, `output_bytes` and `output_status` carry the terminal output of the command the event describes: what the operator saw, with stdout and stderr merged in the order the terminal interleaved them. They are governed by the `sentinel.log_output` configuration and by a profile's `log_output` block, both documented on the [wrapper configuration reference](/wrapper/configuration#sentinel), and they are **enabled by default**.

They are a **different destination** from the `output_capture` action's artifact. Nothing in the event announces that such an artifact was written; `artifact_id` is the only link, exactly as it is for `exec_command`.

**The presence matrix is what a parser has to implement.** There are five states, and no value in any of them is ever `null`:

| State | `output` | `output_truncated` | `output_bytes` | `output_status` |
| ----- | -------- | ------------------ | -------------- | --------------- |
| The inline field is disabled by configuration | absent | absent | absent | absent |
| The capture succeeded | present | present | present | **absent** |
| The command legitimately printed nothing | `""` | `false` | `0` | **absent** |
| No output was available to capture | absent | absent | **absent** | `"unavailable"` |
| The output was there and extraction failed | absent | absent | absent | `"error"` |

Four consequences follow, and each is a case that breaks a naive parser.

**Absence is the signal, and these fields are never `null`.** They follow the `artifact_id` precedent rather than the `exit_code` one: a key that is not applicable is not written at all. A `null` would be a sixth state no consumer of this schema was ever told about. See [Empty, null and placeholder values](#empty-null-and-placeholder-values).

**A successful capture carries no `output_status`.** The field exists to report the two ways a capture can fail to happen, so testing for `output_status == "ok"` matches nothing. Test for the presence of `output` instead.

**An empty string is not a failure.** A command whose output was redirected to a file, or piped away, printed nothing on the terminal. That is `output: ""` with `output_bytes: 0`, and it is a routine, expected event. Reporting it as an extraction failure would turn every redirection in an engagement into a false alarm.

**No byte count is guessed when the capture was unavailable.** `output_bytes` is derived from the boundaries of the recorded window; without both of them there is no honest number, so the key is omitted rather than filled with a partial one.

The remaining three facts a consumer needs:

- **`output_bytes` is the size of the raw terminal window**, before cleaning and before any cut, not the length of the `output` string. `output` is cleaned text, so `output_bytes` is larger than `len(output)` **even when `output_truncated` is `false`**: the difference is escape sequences, carriage returns and control bytes, not dropped content, and for colour-heavy tools it is a large fraction of the window. Only `output_truncated` tells you whether content was dropped, never the gap between the two numbers.
- **`output` is cleaned text, not the raw terminal stream.** Escape sequences are removed and carriage-return overwrites are collapsed to what the terminal finally showed, so a progress bar arrives as its final frame rather than as every frame it drew. Bytes that are not valid UTF-8 are decoded lossily and appear as the Unicode replacement character. The byte-exact original is what the `output_capture` action's `raw` artifact keeps.
- **The cap bounds the payload text, not the serialised line.** A capture full of quotes or control characters can make the JSON line somewhat longer than the configured limit once escaped. Size your ingest pipeline against the line, not against the setting.

> [!WARNING] Command output is not filtered the way environment variables are
> The redaction denylist masks the *values* of environment variables it was given, and it is applied to this field on a best-effort basis: it cannot mask a secret that was typed inline, one derived inside the command, or one the terminal wrapped across two lines. There is no per-rule suppression. The only complete control is `enabled: false`. See [Security considerations](/sentinel/security#what-leaves-the-container).

### Operator-supplied `metadata` and `tags`

These two fields carry whatever the **operator** chose to attach to the engagement's events, through two exported environment variables read inside the container:

| Variable | Field | Shape |
| -------- | ----- | ----- |
| `EXEGOL_SENTINEL_META` | `metadata` | An object mapping string to string |
| `EXEGOL_SENTINEL_TAGS` | `tags` | An array of strings |

They are the one Sentinel surface with **no host-side setting behind them**. Nothing in `~/.exegol/config.yml` and nothing in a profile enables, disables or constrains them; the operator's shell is the only input. See [Operator metadata and tags](/sentinel/configuration#operator-metadata-and-tags) for how they are set.

**The presence rule is the exported environment.** A key is emitted only when its variable is exported **and** yields at least one usable entry. Otherwise it is **absent** from the event: never `null`, never an empty object, never an empty array. Because the variables are re-read on every command, an operator who exports one mid-session changes the events from the next command onward, and two consecutive events from one container can legitimately differ.

The value rules a parser has to expect:

- **Values are strings, always.** `metadata` is string to string and nothing else: never nested, never a number, never a boolean. A value that looks like `8080` or `true` is the *string* `"8080"` or `"true"`.
- **A value may be the empty string.** `engagement=` is a key the operator deliberately left blank, and it is emitted as `""`.
- **Metadata keys are unique; the last occurrence wins.** A variable repeating a key yields one entry carrying the last value typed.
- **Tags are not de-duplicated and keep the order typed.** They are a list, not a set.

> [!IMPORTANT] A metadata key can never collide with a schema field, because the object is nested
> The operator picks these key names, so some of them will be names this schema already uses. Nesting is what makes that harmless: a metadata key named `exit_code` lives at `metadata.exit_code` and is a metadata key and nothing else. It cannot displace, shadow or retype the real `exit_code`, and there is no reserved-key list to memorise. Read the two namespaces separately and never merge `metadata` into the event root.

**These values are operator-supplied and unverified.** They are typed by the audited party, in a variable any process in the container can change. Treat them as engagement *context* for filtering and grouping, never as an attestation of who did what: see [Security considerations](/sentinel/security#operator-supplied-metadata-is-unfiltered-and-self-reported) for what that means for attribution, and for what is **not** filtered out of these values.

## Empty, null and placeholder values

Every field above is always present as a key except `output`, `output_truncated`, `output_bytes`, `output_status`, `metadata`, `tags` and `artifact_id`, but "present" does not mean "populated". These are the cases that break naive parsers.

**Several strings may be empty.** `hostname`, `working_directory`, `shell`, `user_command`, and `resolved_command` are always present as keys, but each may be the **empty string** (`""`) when the environment variable it is sourced from is unset. The key never disappears; only its value is empty. `shell` matters because it is mapped to `process.name` / CIM `process_name`, both of which detections are written against: a rule that matches on `shell IN ("bash","zsh")` silently drops any event where the variable was not exported.

**Any environment-sourced string may hold a binary-data placeholder.** Environment values are read as raw bytes. When a value fails UTF-8 decoding, the logger substitutes the literal string `<BINARY DATA>`. This can appear in `working_directory`, `user_command`, `resolved_command`, in any **value** inside `envs_in_command`, and in `tags`. It is a legitimate, expected value. A parser that treats it as corruption, or that drops the event, will misreport.

**The placeholder takes the whole variable, which matters for the two operator-supplied fields.** The variable is decoded as **one string** before it is split, so a single non-UTF-8 byte anywhere in it replaces all of it. In `EXEGOL_SENTINEL_TAGS` that yields exactly **one** tag holding the marker, whatever the operator typed; in `EXEGOL_SENTINEL_META` it yields **no `metadata` key at all**, because the marker contains no `=` and is therefore dropped as a malformed entry.

**Redacted values use angle brackets.** Values masked by the profile's `env_redact` denylist are replaced by the literal string `<REDACTED>`, in both `resolved_command` and `envs_in_command`. The marker is angle-bracketed; it is never square-bracketed.

> [!TIP] Two literals to allowlist in your parser
> `<BINARY DATA>` and `<REDACTED>` are the only two synthetic string values Sentinel injects. Neither indicates an error. Matching on them is a reliable way to surface commands whose context could not be fully captured.

## Event ordering

Each event is appended under an **exclusive advisory lock** at the moment its command *finishes*. File order is therefore **write-completion order, not command-start order**: a long-running command started first is appended *after* a short command started later.

> [!WARNING] Do not reconstruct an engagement timeline from file order
> A `tcpdump` launched at 09:00 and stopped at 09:45 lands in the file *after* an `ls` typed at 09:30. Sorting by file position produces a timeline that is wrong in exactly the cases an investigator cares about.

The consequences for an ingest pipeline are three concrete rules:

- **Sort on `start_time`.** It is the only field that reflects when the operator acted. Never rely on file order, and never rely on ingest order.
- **Deduplicate on `event_id`.** It is unique per event and exists for this purpose. Re-reading a file after an agent restart is normal and expected; the deduplication key is what makes it safe.
- **Events survive rotation.** Rotation *renames* the whole file rather than rewriting it, so no event is ever rewritten, split, or renumbered once written. Rotated generations are ordered oldest-first by the **timestamp segment** of their filename, which is lexicographically sortable, modulo same-microsecond collision names, whose relative order is not meaningful (see [Rotated filename format](#rotated-filename-format)).

## Rotated filename format

When `logs.json` exceeds its configured size limit, it is renamed. The rotated name is the literal prefix `logs.`, followed by a UTC timestamp produced with the `strftime` format `%Y%m%dT%H%M%S_%fZ`, followed by `.json`. When compression is enabled, `.gz` is appended.

```
logs.20260115T094107_812345Z.json.gz
     └──────┬──────┘└──┬───┘
      %Y%m%dT%H%M%S    %f (microseconds) + literal Z
```

> [!WARNING] This is not a parseable ISO 8601 string
> The timestamp is ISO 8601 **basic** form with an **underscore** before the microsecond field. That underscore makes it invalid ISO 8601. A parser must **not** attempt ISO 8601 parsing on a rotated filename. Extract it with a regular expression, or treat the name as an opaque, lexicographically sortable token. Informal descriptions of the shape as `logs.{ISO8601}Z.json` are imprecise; the format above is the one the code emits.

**Collisions insert a counter.** If two rotations land on the same timestamp, a counter segment is inserted between the timestamp and the `.json` extension: `logs.20260115T094107_812345Z.1.json`. Any glob or regular expression must tolerate **both** the counterless and the counter-bearing form:

```
logs.*.json      logs.*.json.gz
```

The counter is the one place where lexicographic order and creation order disagree: the **counterless** name is always written first, but `logs.<ts>.1.json` sorts *before* `logs.<ts>.json` because `'1'` < `'j'`. Since both names share a microsecond timestamp the practical impact is nil, so treat the ordering as meaningful only down to the timestamp segment, and do not build on the relative order of a collision pair.

## `schema_version` policy

`schema_version` is a published contract. It changes only under the following rule, and the distinction between the two cases is:

| Change to the schema                                    | Classification | `schema_version` |
| ------------------------------------------------------- | -------------- | ----------------- |
| A new field is added                                     | **additive**   | **not** bumped    |
| A field is removed                                       | **breaking**   | **bumped**        |
| A field is renamed                                       | **breaking**   | **bumped**        |
| A field's JSON type or meaning changes                   | **breaking**   | **bumped**        |

Either way, this page is updated. What differs is whether the version moves.

The four `output*` fields above are the worked example. They were **added**, so they are an additive change and `schema_version` stays **`1`**: no existing field was removed, renamed, or changed in type or meaning, and a parser that ignores unknown keys is unaffected by their arrival.

`metadata` and `tags` are the second worked example, and they landed the same way: two new keys, nothing existing touched, so `schema_version` is still **`1`**.

The practical consequences for a parser are two:

- **Ignore unknown keys.** A field you do not recognise is an additive change, and additive changes do not bump the version. A parser that rejects or errors on unknown keys will break on a routine release.
- **Gate on `schema_version` alone.** Because only breaking changes bump it, the version is sufficient on its own to decide which parsing behaviour applies. No other signal is needed.

## Fields that are absent on purpose

A SIEM engineer coming from process-execution data models will look for the following fields and not find them. They are not omitted by accident; they are not collected today.

| Expected field                          | Consequence                                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`                                  | The operating-system user is **not emitted**. Identity correlation must come from the container instance directory name or from the host itself      |
| `process_id`                            | No process identifier is emitted. Process-tree correlation is not possible from the event stream                                                    |
| `parent_process_id`                     | No parent process identifier is emitted. Parent/child lineage cannot be reconstructed                                                               |
| `process_exec`                          | No resolved executable path is emitted. Use `resolved_command` and parse the leading token if you need an approximation                              |
| `duration_ms`                           | Not emitted per event. **Derive it** as `end_time` minus `start_time`                                                                              |
| a flag saying an artifact was collected | Not emitted. No field reports that an `output_capture` (or any other) action wrote an artifact. Join through `artifact_id` and test the directory   |
| `profile` / `rule` / `severity`          | No per-event profile metadata is emitted. The profile version is correlated **per container instance** through `sentinel_config.json`, not per event. The `tags` field an event *does* carry is [operator-supplied](#operator-supplied-metadata-and-tags), not profile metadata |

See [Field mappings](/sentinel/siem/field-mappings) for what each of these absences costs in ECS and Splunk CIM terms.

## Sample events

Every value below is synthetic.

A complete event, with a profile rule fired (`artifact_id` present) and one redacted environment variable:

```json
{
  "start_time": "2026-01-15T09:41:07.812Z",
  "end_time": "2026-01-15T09:41:12.089Z",
  "hostname": "exegol-demo",
  "container_name": "exegol-demo",
  "working_directory": "/workspace",
  "shell": "zsh",
  "user_command": "curl -H \"Authorization: Bearer $API_TOKEN\" https://target.example/api",
  "resolved_command": "curl -H \"Authorization: Bearer <REDACTED>\" https://target.example/api",
  "envs_in_command": {
    "API_TOKEN": "<REDACTED>"
  },
  "exit_code": 0,
  "event_id": "0f1e2d3c4b5a69788796a5b4c3d2e1f0",
  "schema_version": 1,
  "output": "HTTP/1.1 200 OK\ncontent-type: application/json\n\n{\"status\":\"ok\"}\n",
  "output_truncated": false,
  "output_bytes": 74,
  "metadata": {
    "auditeur": "mathieu",
    "engagement": "SIE2026"
  },
  "tags": ["redteam", "internal"],
  "artifact_id": "a1b2c3d4e5f60718293a4b5c6d7e8f90"
}
```

The same command with no profile rule fired and an unknown exit code. Note that `artifact_id` is **absent** while `exit_code` is present and `null`, that the capture was unavailable here, so `output_status` is the only one of the four output keys present, with **no** guessed byte count beside it, and that neither operator variable was exported for this command, so neither `metadata` nor `tags` appears:

```json
{
  "start_time": "2026-01-15T09:41:07.812Z",
  "end_time": "2026-01-15T09:41:12.089Z",
  "hostname": "exegol-demo",
  "container_name": "exegol-demo",
  "working_directory": "/workspace",
  "shell": "zsh",
  "user_command": "ll /workspace",
  "resolved_command": "ls -lah --color=auto /workspace",
  "envs_in_command": {},
  "exit_code": null,
  "event_id": "9c8b7a6d5e4f30211302f4e5d6a7b8c9",
  "schema_version": 1,
  "output_status": "unavailable"
}
```
