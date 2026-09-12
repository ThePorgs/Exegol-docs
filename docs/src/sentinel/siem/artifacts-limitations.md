# Artifacts and limitations <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

An **artifact** is the extra data a profile rule collects when it fires. A command event records *what was typed*; an artifact records the surrounding context a rule asked for: the environment the command ran in, the packets it sent, the Kerberos credential caches it touched, or the output of a follow-up command the profile ran on your behalf. See [Actions](/sentinel/profiles/actions) for what each rule can collect.

Artifacts live on disk, not in the event stream. The link between the two is the **artifact identifier**: a command event carries `artifact_id` when the artifact directory for that command exists on disk at the moment the event is written, and that identifier is the name of the directory. The field itself is defined on the [Log schema reference](/sentinel/siem/log-schema#event-fields). This page maps that identifier to the files on disk, and lists what the arrangement does not do.

> [!INFO] `artifact_id` is a join key, not a "this command produced artifacts" flag
> The directory is created for **every** command, before any rule is evaluated, and removed again by the post-execution phase when nothing was collected. The event is written after a one-second head start for that cleanup, so an `artifact_id` can point at a directory holding nothing but the internal marker files below. If the profile configuration is missing or unparseable the cleanup never runs at all, leaving one such directory per command for the life of the instance. To decide whether a command actually produced artifacts, test the directory for at least one non-dotfile; do not test the field.

Every path, container name, artifact identifier and source name below is **synthetic**.

## Where these facts come from

| What is documented here | Established by |
| ----------------------- | -------------- |
| Directory naming, ownership and modes of the instance directory | `ContainerConfig.enableSentinel` |
| Artifact directory mode, the manifests, and the internal marker files | `sentinel_runner.py` |
| Rotation, the inode contract and the write lock | `sentinel_logger.py` |
| The deployed configuration file and its provenance block | `SentinelProfileManager.get_consolidated_config` |
| Which command invocations are captured | `entrypoint.sh`, `bash_hooks.sh`, `zsh_hooks.sh`, `ExegolContainer` |
| Container removal | `ExegolContainer` |
| The session recorder, its gate and the lifecycle of the session stream | `spawn.sh` |
| The output manifest, the window extraction and the space release | `sentinel_runner.py`, `sentinel_output.py` |

## The host-side layout

The sentinel path defaults to `~/.exegol/sentinel/` and is overridable with `volumes.sentinel_path` in `~/.exegol/config.yml`. Every container instance gets its own subdirectory below it, named from the container name and a Unix timestamp, with an eight-character random suffix appended only when that name is already taken.

```text :scroll
~/.exegol/sentinel/                              # the sentinel path
└── exegol-demo_1767225667/                      # 2750  invoking user : sentinel group
    │                                            #   one directory per CONTAINER INSTANCE
    ├── logs.json                                # 0660  root : sentinel group, the event stream (NDJSON)
    ├── logs.20260101T091107_812345Z.json        # 0660  rotated generation
    ├── logs.20260101T094431_057219Z.json.gz     # 0660  rotated + compressed generation
    ├── sentinel_config.json                     # 0640  invoking user, the deployed profile configuration
    ├── sentinel_runner_debug.log                # 0644  only when runner debug output is enabled
    ├── .logs.removing                           # transient: exists only while the container is removed
    └── artifacts/                               # 2750  root : sentinel group
        └── 3f9c1ab27d5e4c0f8b6a2d41e7c93b05/    # 2750  one directory per ARTIFACT IDENTIFIER
            ├── env_vars.json                    # 0640  environment dump
            ├── exec_collect_hostinfo.json       # 0640  execution manifest, one per exec action
            ├── capture_eth0.pcap                # 0640  packet capture
            ├── capture_any_30.pcap              # 0640  packet capture with a duration
            ├── output_keep_full.raw             # 0640  captured terminal output, one per output action
            ├── output_keep_full.json            # 0640  output manifest, one per output action
            ├── krb5cc_1000                      # 0640  copied credential cache, original name kept
            ├── .pre_exec_pid                    #  ┐
            ├── .pre_exec_done                   #  │  internal coordination state
            └── .capture_eth0.pid                #  ┘  DO NOT COLLECT
```

The set-group-id bit on the instance directory and on `artifacts/` is what makes new entries inherit the sentinel group rather than the creating process's own group. The group is set by `config.sentinel.log_group_gid` in `~/.exegol/config.yml`; leaving it at its default of `-1` means the group of the user running Exegol.

**Ownership splits by writer.** The instance directory and `sentinel_config.json` are created by the Exegol wrapper on the host, which is an ordinary user process (it reaches Docker through the docker group, not as `root`), so both are owned by the **invoking user**. Exegol does try to chown the instance directory to `root` first, but that requires `CAP_CHOWN` and the attempt fails on a standard host; it falls back to your own uid, and warns with the exact `sudo chown -R` command if even the group could not be set. Everything written from inside the container (`logs.json`, the rotated generations, `artifacts/` and everything below it) is owned by `root`. The group is the sentinel group throughout, and the group is the only part an ingest agent depends on.

Inside the container the same directory is mounted at:

```
/var/log/exegol/sentinel
```

Reading it from the container is not a supported ingest topology. See [Ingest configuration](/sentinel/siem/ingest-configuration#_1-what-to-read-and-from-where) for the supported one.

### Files an ingest agent must never collect

The runner writes several dotfiles to coordinate its two execution phases with each other. They are internal state with no analytical value whatsoever, and a wildcard glob over an artifact directory will pick up every one of them.

| File | What it is | Why collecting it is wrong |
| ---- | ---------- | -------------------------- |
| `.pre_exec_pid` | The process identifier of the pre-execution runner, written the moment the artifact directory is created | A bare integer. Produces one noise event per command that fired a rule |
| `.pre_exec_done` | A marker showing the pre-execution phase finished, so the post-execution phase stops waiting for it | Empty or near-empty. Its existence is the signal, not its contents |
| `.{capture_name}.pid` | The process identifier of the packet-capture process, so the post-execution phase can stop it | A bare integer. It is deleted again **only** for a capture with no `duration`: the post-execution phase stops that process and unlinks the file. A capture that sets a `duration` stops on its own, so nothing unlinks its pid file and it stays in the artifact directory for the life of the instance |

Collecting them costs licensed index volume and produces events that no parser can turn into anything. Both configurations on the [Ingest configuration](/sentinel/siem/ingest-configuration#_3-shipper-configuration) page glob narrowly enough to miss them and carry exclusion patterns as a second line of defence.

Note also that `sentinel_config.json`, `sentinel_runner_debug.log` and the transient `.logs.removing` are not audit data and must not be swept into the event stream. The first carries the profile source locations for the deployment, the second is unstructured debug output, and the third exists only while a container is being [removed](#container-removal-destroys-the-entire-local-record).

## The execution manifest

An `exec_command` action writes one manifest per action, as a **pretty-printed JSON document**, not one object per line. A line-oriented NDJSON parser will fail on every one of them.

| Key | JSON type | Presence |
| --- | --------- | -------- |
| `command` | string | always |
| `stdout` | string | always |
| `stderr` | string | always |
| `exit_code` | integer or `null` | always, nullable. `null` when the process never spawned (`spawn_error` present) **or** when it was killed on timeout and its exit status could not be collected (`timed_out: true`, and **no** `spawn_error`) |
| `timed_out` | boolean | always |
| `truncated` | boolean | always |
| `duration_ms` | integer | always |
| `spawn_error` | string | **only** when the spawn itself failed |

Three things a parser needs beyond the key list:

**`spawn_error` is not a reliable discriminator for a `null` `exit_code`.** The obvious reading ("`exit_code` is `null`, so look at `spawn_error` for why") has a second case it does not cover. On the timeout path the runner kills the process group and then drains the pipes under a bounded timeout; if a child escaped that group (`setsid`, a double-forked daemon, `nohup ... &`) it keeps the write end open, the drain gives up, and no exit status is ever collected. The result is a manifest with `timed_out: true`, `exit_code: null` and **no** `spawn_error`. Branch on `timed_out` first, then on `spawn_error`.

**Each output stream is truncated independently, and `truncated` is not per-stream.** Both `stdout` and `stderr` are cut to a configurable byte limit whose default is **1,000,000 bytes** (1 MB) each, and are decoded as UTF-8 with undecodable bytes replaced rather than raising. The `truncated` flag is set when **either** stream exceeded the limit before slicing, so a `true` does not tell you which stream was cut, and a manifest can carry up to 2 MB of captured output in total. Splunk's default `TRUNCATE` of 10,000 bytes destroys such a manifest outright; the [Ingest configuration](/sentinel/siem/ingest-configuration#_3-shipper-configuration) page sets `TRUNCATE = 0` on the artifact source type for this reason.

**The filename is a sanitised form of the action name, so it may not match the action name.** The manifest is written to `exec_{name}.json`, where `{name}` is the profile's action name with every character outside `A-Za-z0-9_.-` replaced by an underscore. This is path-traversal hardening: an action name containing `../` must not be able to place a file outside the artifact directory. The side effect is that an action named `collect host-info!` produces `exec_collect_host-info_.json`. **Do not assume the filename and the profile action name are the same string.** If you need the exact action name, read the profile, not the directory listing.

## The output manifest

An `output_capture` action writes **two** files per action: the captured bytes, as `output_{name}.raw` for `format: raw` or `output_{name}.txt` for `format: text`, and a manifest, `output_{name}.json`. Like the execution manifest it is a **pretty-printed JSON document**, not one object per line.

**The payload is a sibling file and is never embedded in the manifest.** This is the opposite of what `exec_command` does with its own `stdout` and `stderr`, and it is deliberate: a terminal capture is unbounded by default, manifests are what an ingest agent collects, and a manifest carrying the payload would put an arbitrary amount of raw terminal bytes into your index.

| Key | JSON type | Presence |
| --- | --------- | -------- |
| `stream` | string | always. The literal `terminal`: a pty is **one** merged stream, and the manifest declares that rather than pretending stdout and stderr were ever separated |
| `format` | string | always. `raw` or `text`, echoing what the action asked for |
| `bytes_total` | integer | always. The **true** size of the captured window before any cut. Counted in raw bytes for `raw`, in cleaned bytes for `text` |
| `bytes_written` | integer | always. How many bytes actually landed in the data file. Equal to `bytes_total` when nothing was cut, and `0` when nothing was captured |
| `truncated` | boolean | always |
| `truncated_at_byte` | integer | always. The offset, in the original window, at which the kept head ends. Equal to `bytes_total` when nothing was cut |
| `status` | string | always. `ok`, `unavailable` or `error` (the same three words the event's `output_status` uses) |
| `tail_from_byte` | integer | **only** when a tail was actually kept (`truncation: tail` or `both`, and the capture was over the limit) |
| `cap_source` | string | **only** when the cut was made by a limit the profile did not set. The single value `runner_default` means a `format: text` action carried no `max_size`, so the container applied its own 1 MB bound |
| `start_source` | string | **only** when the window's start is a lower bound rather than the real start. The single value `scan_floor` means the command printed more than the 512 MiB the extractor scans backwards, so the capture begins at a proven floor and **earlier bytes are absent**. `truncated` is `true` whenever it appears, even if no configured limit applied. Absent means the start is exact |

Five things a consumer needs beyond the key list.

**The offsets are the only seam a `raw` artifact has.** Nothing is inserted into a raw capture to mark where the cut landed (a marker inside the stream would corrupt it and break replay), so a truncated `output_{name}.raw` is two byte ranges of the original concatenated with nothing in between. Only the manifest says where. A `text` capture does carry a visible marker naming the dropped byte count, because cleaned text is already not a byte-exact copy.

**The reconstruction identity holds for every mode**, and it is what lets a consumer map a position in the artifact back to a position in what the terminal showed:

```
truncated_at_byte + (bytes_total - tail_from_byte) + marker_len == bytes_written
```

`tail_from_byte` defaults to `bytes_total` when the key is absent, and `marker_len` is zero for a `raw` capture and for the `head` and `tail` modes. **Absence is not null**: the key is omitted rather than written as `null` precisely so that this default stays unambiguous.

**`status: unavailable` means there was nothing to copy, and it is not an error.** It has exactly these causes, and it is worth knowing them because the word is read as benign:

- the **recorder was not running** — no `script` in the image, a container where it never started, or a shell that was refused a stream of its own (limitations 3, 12 and 14);
- the command **ran inside a program that had opened its own pty** — a multiplexer, a remote shell, an operator-run recorder (limitation 3). Its output is not lost: it is attributed to the enclosing command;
- the command's **end marker was never reached**, because more than **4 MiB** was written to the terminal by something else between the command ending and the scan starting (limitation 21);
- the **markers were never emitted or were forged away** by the operator's own shell (limitation 19).

**A command that simply printed too much is no longer one of them.** Past 512 MiB the extractor cannot find the window's start, but it can prove a floor, so the capture is written from that floor and marked `truncated` with `start_source: scan_floor` (limitation 20). `unavailable` therefore means *nothing was captured*, never *too much was*. The manifest is still written (with zeroed counts) and **no data file is created at all**. An artifact directory holding an output manifest and no output file is that case, not a collection failure. `status: error` is the different fact: the recording was there and extraction failed, and any partial data file is removed rather than left claiming to be whole.

**`cap_source` tells you the cut was not the one the profile asked for.** `truncated: true` on its own does not say which limit produced it. A `format: text` action with no `max_size` is refused when the profile is loaded, but a container whose config was deployed before that rule (or edited afterwards) still runs it, and the runner then applies a 1 MB bound of its own. That case, and only that case, adds `cap_source: "runner_default"`. Absence means the limit was the profile's own (or that nothing was cut), following the same absence-is-not-null rule as `tail_from_byte`. Treat its presence as a configuration finding, not a collection failure: the artifact is a valid prefix, it is simply shorter than anyone chose.

**The filename is a sanitised form of the action name, so it may not match it.** Every character outside `A-Za-z0-9_.-` is replaced by an underscore, for the same path-traversal reason as the execution manifest above, and with the same consequence: do not assume the filename and the profile action name are the same string.

```json
{
  "stream": "terminal",
  "format": "raw",
  "bytes_total": 41238,
  "bytes_written": 2081,
  "truncated": true,
  "truncated_at_byte": 1024,
  "tail_from_byte": 40181,
  "status": "ok"
}
```

## The environment dump

A `dump_env` action writes `env_vars.json`: a **flat object mapping variable names to string values**, with no wrapper key and no metadata of any kind. It carries no identifier of its own. The artifact directory it sits in *is* the identifier.

```json
{
  "AWS_REGION": "eu-west-1",
  "AWS_SECRET_ACCESS_KEY": "<REDACTED>",
  "TARGET_DOMAIN": "corp.example"
}
```

Three behaviours decide whether this file exists and what is in it.

**An allowlist selects, then a denylist masks.** The action's `filters` are glob patterns matched against variable *names*; an empty or absent filter list means every variable is selected. The profile's `env_redact` denylist is then applied to what was selected, replacing matched **values** with the literal string `<REDACTED>` while keeping the key. Deny runs after allow, so a variable can be selected and still be masked.

**Repeated writes merge, they do not overwrite.** If the file already exists, its contents are read first and the new selection is merged on top. Two rules firing for the same command therefore produce one file containing the union of both selections, and a variable captured twice keeps the later value. Nothing is ever removed by a subsequent write.

> [!INFO] A missing `env_vars.json` means "nothing matched", not "the action failed"
> When the filtered result is empty, the file is **not written at all**. There is no empty `{}` on disk to distinguish the two cases. An analyst who finds an artifact directory with no environment dump should read it as "the allowlist selected nothing", not as an error, and an ingest pipeline must not treat the absence as a collection failure worth alerting on.

## The deployed configuration file

`sentinel_config.json` sits beside the event stream and holds the profile configuration as it was deployed into that container. **It is what correlates events to the profile version that produced them**, and that correlation is **per container instance, not per event**, because the provenance block lives in this file and no profile metadata is carried on the events themselves.

That distinction matters when you build a pipeline. To answer "which profile version produced this event", you join the event to the container instance directory it came from, and read the provenance from this file. There is no per-event shortcut.

The surface you may rely on:

| Path in the file | Meaning |
| ---------------- | ------- |
| `profile.config.log_rotation.enabled` | Whether the event stream rotates at all |
| `profile.config.log_rotation.max_size` | The rotation threshold, **in bytes** |
| `profile.config.log_rotation.max_files` | How many rotated generations are kept; `0` means never prune |
| `profile.config.log_rotation.compress` | Whether a rotated generation is gzipped |
| `profile.config.env_redact` | The redaction denylist, as glob patterns matched against variable names. **Optional in two different ways.** See the caveat below |
| `profile.config.log_output.enabled` | Whether the inline `output` field is recorded at all and, when no `output_capture` action consumes output either, whether a session recorder is started. Written into **every** deployed configuration, profile or not, and what the in-container recorder gate reads |
| `profile.config.log_output.max_size` | The inline field's cap, **in bytes**, counted on cleaned text |
| `profile.config.log_output.truncation` | `head`, `tail` or `both`: which end of an over-cap inline field survives |
| `_meta.sources.{key}.type` | `git` or `path` |
| `_meta.sources.{key}.url` | The source location, for a `git` source |
| `_meta.sources.{key}.path` | The source location, for a `path` source |
| `_meta.sources.{key}.ref` | The reference that was requested |
| `_meta.sources.{key}.commit` | The commit actually deployed |

```json :scroll
{
  "profile": {
    "config": {
      "log_rotation": { "enabled": true, "max_size": 104857600, "max_files": 0, "compress": true },
      "log_output": { "enabled": true, "max_size": 4096, "truncation": "both" },
      "env_redact": ["*SECRET*", "*TOKEN*", "PASSWORD"]
    }
  },
  "_meta": {
    "sources": {
      "core":   { "type": "git",  "url": null, "ref": null, "commit": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b" },
      "local":  { "type": "path", "path": "/home/analyst/.exegol/components/sentinel/local", "ref": null, "commit": null },
      "team":   { "type": "git",  "url": "https://git.example/security/sentinel-profiles.git", "ref": "v2.4.0", "commit": "0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a" }
    }
  }
}
```

Five caveats:

- **`env_redact` may be absent *or* `null`, and the two mean the same thing.** Unlike the `log_rotation` block, which is always written out in full, `env_redact` has no default and is not backfilled. A profile that declares no `config` block at all produces a `config` object with **no `env_redact` key**; a profile whose `config` block simply omits it produces **`"env_redact": null`**. Handle both, and treat both as an empty denylist. The example below shows the populated case only, which is the one you are least likely to have to defend against. Code written against it alone raises on a key error or on iterating `null`.
- **`max_size` is a byte count, in both blocks.** The profile and `~/.exegol/config.yml` accept a human-readable `"100MB"` / `"4KB"`-style string, but `log_rotation.max_size` and `log_output.max_size` are both normalised to bytes before this file is written. Never parse either as a suffixed string.
- **`log_output` is always written out in full**, like `log_rotation`: when the profile declares none, the block carries the host's `sentinel.log_output` defaults, and a container started without any profile still receives it.
- **`core` is the reserved key for the official source, and its `url` is always `null`.** That source is never declared by a user, so there is no location to record. Do not document, alert on, or index `core.url` as a usable value. Its absence is the normal state. (Informal notes that call this reserved key by another name are stale; the key is `core`.)
- **`commit` is `null` for a `path` source.** A local directory has no commit to record. It is not a missing value to backfill.
- **Credentials are stripped from a source location before this file is written.** HTTPS URLs are passed through a sanitisation step that removes embedded credentials, because this file is mounted into the container. An SSH remote is preserved verbatim, which is why the file is still not something to ship to an index. See the exclusion patterns on the [Ingest configuration](/sentinel/siem/ingest-configuration#the-glob-and-why-it-is-that-narrow) page.

## Artifact retention

Two things live in the instance directory, and only one of them is managed.

**Rotated event generations are pruned** according to `max_files`. Its default is `0`, which means *no* pruning: every generation is kept forever. Set it to a positive number and the oldest generations are deleted once that many exist, oldest first.

**Artifact directories are never pruned by Sentinel.** There is no retention setting for them, no age limit, and no size cap. They accumulate for the entire life of the container instance: one directory per command that fired a rule, holding whatever that rule collected, including packet captures that can be arbitrarily large.

**Captured output follows the same posture, and it is the artifact most likely to be large.** There is no quota, no age limit and no pruning for `output_{name}.raw` or `output_{name}.txt` either. The per-action `max_size` is the only guard there is, and it is **unlimited** unless the profile sets one, so a rule matching a command that prints a gigabyte keeps a gigabyte. Set a limit on any `output_capture` action whose matched command is not trivially bounded.

The only thing that removes an artifact directory is removal of the container it belongs to, which [removes **everything**](#container-removal-destroys-the-entire-local-record). There is no middle ground built into the product.

> [!TIP] Retention is your policy
> If artifact growth needs a bound, the bound is a job you run on the host: age out artifact directories under the sentinel path on whatever schedule your evidence-handling policy requires, and make sure that schedule is longer than the window in which the artifacts might still be needed. Sizing it against a capture-heavy profile rather than an average day is the difference between a working policy and a full disk mid-engagement.

## Known limitations

Everything below is a property of behaviour that ships **today**, and each claim names the source that establishes it. Source files are named rather than line numbers, so a statement here does not quietly become false at the next refactor.

### Command coverage

Sentinel captures commands through shell hooks, and shell hooks only exist in a shell that has a prompt. That single fact draws the coverage boundary.

The chain is:

- `entrypoint.sh` appends the hook-loading line to `/etc/bash.bashrc` and to `/etc/zsh/zshrc`, the **system rc files**, which bash and zsh read only when the shell is interactive.
- `bash_hooks.sh` then wires its hooks behind an explicit interactive-shell test on `$-`. Even if a non-interactive bash somehow read the file, no trap would be installed.
- `zsh_hooks.sh` registers itself in the `preexec` and `precmd` hook arrays. Those fire when a command is read from the command line and before a prompt is drawn. A shell handed its work with `-c` does neither.
- `ExegolContainer` builds every non-interactive execution as a `zsh -c` invocation carrying an inline command, and that payload sources the user's own `~/.zshrc`, **not** the system rc where the hook-loading line was appended. `entrypoint.sh` uses the same `zsh -c` form for a command supplied at container start.
- `spawn.sh` is the interactive entry point. It execs the user's shell with no `-c`, attached to a terminal, so the system rc is read and the hooks install.

| Invocation | Captured | Established by |
| ---------- | -------- | -------------- |
| The shell opened by `exegol start` or `exegol shell` | **Yes** | `spawn.sh`, `entrypoint.sh` |
| Any interactive shell you open yourself inside the container, including a terminal in the graphical desktop | **Yes** | `entrypoint.sh`, `bash_hooks.sh`, `zsh_hooks.sh` |
| A command run non-interactively with `exegol exec` | **No** | `ExegolContainer` |
| A command supplied to run at container start | **No** | `entrypoint.sh` |
| The individual commands inside a script or program launched by a captured command | **No**. One event records the command line that was typed | `bash_hooks.sh`, `zsh_hooks.sh` |
| Anything started by a scheduler or a daemon inside the container | **No** | `bash_hooks.sh`, `zsh_hooks.sh` |

> [!WARNING] This is a record of what an operator typed, not a process audit
> A detection or a compliance control that assumes *every process* in the container is recorded will be wrong in both directions: it will miss non-interactive execution entirely, and it will see one event where a script ran two hundred commands. If your threat model needs process-level coverage, run host-level process auditing alongside Sentinel rather than in place of it.

The boundary above was established by reading the sources named in the table, not by observing a running container. It reflects the code as shipped; if you need to confirm it for your own image version, run a command through `exegol exec` and check whether a new event appears in `logs.json`.

### What output capture does and does not record

Capturing a command's own terminal output is done with a **session-wide recorder**: the shell is started under a pty recorder, each command's output is bracketed in the recorded stream, and the bracketed window is what becomes the inline `output` field and the `output_capture` artifact. Everything that mechanism can and cannot do follows from that one choice, and the list below is the whole of it. Read it before enabling the feature: it is what an informed opt-in decision is made on.

1. **stdout and stderr arrive as one stream.** A terminal merges them, so what is recorded is what the terminal showed, in the order it showed it, which is the true interleaving, and is more faithful than two separated streams would be. It cannot be un-merged afterwards. The manifest declares `stream: terminal` rather than implying otherwise.

2. **The cleaned text of a full-screen program is redraw noise.** An editor, a pager or a process viewer paints the whole screen repeatedly; cleaning collapses that to the last frame, which is rarely meaningful on its own. The inline `output` field of such a command has little analytical value. The `raw` artifact does not have this problem: it replays.

3. **A program that opens its own terminal hides the commands inside it.** This is *the* incompatible-tool category. A terminal multiplexer (`tmux`, `screen`), a remote shell (`ssh`), an operator-run recorder (`script`, `asciinema`) or an `expect` script allocates a **new** pty for its children, and the outer recorder never sees the boundaries between the commands run inside it. Those inner commands' own events carry `output_status: unavailable`. **For these tools the information is not lost**: everything they displayed is attributed, raw, to the enclosing command's window, so the `tmux` event captures the whole session as one capture. What breaks is attribution, not capture. And note what does *not* break: a program running under the recorder finds a real terminal on both of its streams, exactly as it would without Sentinel, so tools that behave differently when their output is not a terminal are unaffected.

    A nested *shell* (`zsh`, `bash`) is a different case again: it re-sources the hooks, so rather than share the enclosing window it records itself into its own recorder (see [limitation 12](#known-limitations)). Both the inner commands and the enclosing command's capture are faithful there.

4. **Background jobs land in whichever window happens to be open.** `cmd &` prints when it prints. Its output is attributed to whatever command's window was open at that moment, or to no command at all if it arrived between two.

5. **Truncation is configurable, and the true total is always recorded.** The inline field keeps head and tail by default; the action's mode is `head` unless the profile says otherwise. Either way `output_bytes` and `bytes_total` are the size **before** any cut, so a consumer always knows how much it is not looking at.

    **They are not in the same unit, so do not compare them across destinations.** The event's `output_bytes` counts **raw** terminal bytes (escape sequences and control bytes included), while the manifest's `bytes_total` counts raw bytes for `format: raw` and **cleaned** bytes for `format: text`. For the same command with colourised output, a `text` capture's `bytes_total` is legitimately smaller than the event's `output_bytes`, and neither number is wrong.

6. **A capture occupies container disk until it is released, and a full filesystem degrades the recording silently.** The recorded stream lives in the container's own `/tmp`, never on the audit volume and never on the workspace, and each command's consumed region is released as soon as that command's output decision has been made. Where the filesystem refuses that release, or where no window was located at all, the stream grows until the shell exits. The over-512 MiB case is **not** one of those: it locates a floor window and releases it (limitation 20). The bytes that are never reclaimed are the ones no window covers — what the terminal showed between commands, which for a session driven through a fuzzy finder or history search is not negligible. If the filesystem fills, the recorder prints **one** line on standard error, keeps running, and simply stops recording: the shell is not killed, the operator's commands are unaffected, and the only downstream signal is a run of `unavailable` captures. Do not look for a dead recorder process. There is not one. That single stderr line is also the one place this feature is visible to the operator at all.

7. **Binary output is lossy in the event and exact in the artifact.** Bytes that are not valid UTF-8 become replacement characters in the event's `output`. The `raw` artifact keeps them as they were.

8. **Command output reaches the SIEM by default, and it cannot be filtered the way environment variables are.** The inline field is enabled unless it is turned off, there is no per-rule suppression, and the masking of environment-variable values in the captured text is best effort. See [Security considerations](/sentinel/security#what-leaves-the-container).

9. **The event stream grows much faster.** Every event can now carry kilobytes of output, so rotation happens far more often than it did. Re-check `log_rotation.max_size` and `max_files` against your agent's scan interval: a stream that rotates constantly is the case where a rename-following reader can skip a generation.

10. **Sentinel and the wrapper's own session logging record at the same time.** With `--log`, one recorder wraps the other: two recordings of the same terminal exist, and the bytes are duplicated into the workspace log directory. Both recordings are intact and independent of each other.

11. **The window markers are invisible on mainstream terminals, but they are bytes.** They are a private terminal escape sequence, discarded by every mainstream terminal emulator and by multiplexers. They are nevertheless **present** in a `--log` recording of the same session, and an exotic terminal or a serial console may display them.

12. **A nested interactive shell records itself, in its own stream.** Typing `zsh` or `bash` at a recorded prompt starts a shell that re-sources the hooks, and because it is not the shell the session recorder started directly, it begins its **own** `script` on its own session stream rather than sharing the enclosing one. The inner commands are bracketed, windowed and released in that nested stream, and cleaned up when the inner shell exits. The enclosing command (`zsh` itself) keeps a faithful window too: the outer recorder still sees every byte the inner shell's terminal displays, so its `output` and `output_capture` hold the whole inner session, raw. Two shells therefore never share a stream: a nested shell that *cannot* start a recorder of its own (no `script` in the image, no interpreter, a session directory it cannot write, or a recorder that fails to start at all) is given **no** stream instead of the enclosing one, so its commands report `output_status: unavailable` rather than opening a window inside the enclosing command's. **The shell itself still starts** in every one of those cases; it is the capture that is refused, not the shell. (The session shell in [limitation 14](#known-limitations) is the opposite trade, and deliberately so: there the operator gets a message naming a remedy.) No inner command's release can reach into an enclosing command's window.

    **The break-away replaces the shell, so it only happens when the invocation can be reproduced.** `script` starts the replacement through a command string, and the startup files run *before* a shell acts on its arguments, so the only invocation properties that can survive are the ones those startup files can see and that fit in that string: **interactivity** and the **login flag**. Everything the startup files can see and that would *not* survive is a refusal rather than a substitution: no recorder is started, the shell keeps its own original invocation and runs unrecorded, and its commands carry `output_status: unavailable` exactly as above. The refused set is exactly these five:

    * **A command string.** `bash -i -c '…'` / `zsh -i -c '…'` (how `tmux set default-command`, `xterm -e`, IDE terminals and `ssh -t host 'bash -ic …'` ask for a shell carrying your aliases) **runs that command**, unrecorded, rather than being replaced by an interactive shell that never runs it.
    * **A script file operand.** `bash -i prog.sh` / `zsh -i prog.zsh` (how a wrapper asks for "run this script with the user's interactive environment") **runs that script**, unrecorded. This is a distinct case from the one below: such a shell reaches its startup file with *no* positional parameters, so it is recognised through `$0` (bash) and `$ZSH_SCRIPT` (zsh) instead.
    * **Positional parameters.** `bash -is a b`: they would be silently dropped from the replacement shell.
    * **A restricted shell.** `bash -r` / `zsh -r`, which a break-away would have released from its restriction.
    * **An option that changes execution and is visible in `$-`**: `-x`, `-v`, `-u`, `-e`, `-f`, `-n`, `-t`, `-k`, `-a`, `-C`, `-p`, `-r` (the last being the restricted shell above, refused twice over). Note that `-f` is *noglob* in bash but *no-rcs* in zsh; a `zsh -f` never loads the hooks at all and so simply has no Sentinel capture.

    **Two shapes look like they belong on that list and do not.** A shell reading commands from a **redirected standard input** (`echo cmd | bash -i`, `bash -i < file`, `bash -is`) is *not* refused, because nothing is lost: `script` copies its own standard input into the pty, so those commands are forwarded to the replacement shell and run there. (That is precisely why a script *operand* is lost and this is not: an operand is read by the shell itself, never through standard input, so there is nothing to forward.) And a **POSIX-mode** shell (`bash --posix`, `zsh --emulate sh`) never reaches the decision at all: it does not read the startup file these hooks live in, so it is never replaced, and it simply has no Sentinel capture.

    **What remains, and is published rather than papered over.** Two classes of invocation property are neither reproduced nor reliably detectable, so a break-away that *does* happen silently drops them:

    * **A custom startup file**: `bash --rcfile <file> -i`, `bash --init-file`, `ZDOTDIR`. The replacement shell re-reads the default startup files rather than `<file>`, because a startup file is given no way to learn it was named explicitly.
    * **Options with no `$-` letter**: `bash -o pipefail`, `bash -O extglob`, and zsh's many `setopt`-only options. These *are* readable, but from inside a startup file an option set on the command line is indistinguishable from the same option set by an earlier line of that same startup file. Refusing on the option's state would therefore disable capture for every shell in any image whose profile happens to set one (a systematic loss traded for a rare substitution), so it is not done. The `$-` denylist above accepts that same ambiguity only for letters a startup file is very unlikely to set.

    The boundary is a process that reaches the same terminal **without** re-sourcing the hooks, which is [limitation 3](#known-limitations) and is unchanged: the hooks are what answer the question, so anything that never loads them (`tmux`, `ssh`, a `script` you run by hand) is attributed to the enclosing command as raw output and never gets a window of its own.

    Which shell is "nested" is decided in two steps, and both are needed. A shell is **not** nested only when its parent is the `script` that is writing the stream (tested against that process's open descriptor, not just its environment). Otherwise it is nested if a recording `script` is visible above it, **or** if any live `script` is writing the stream it inherited. The second half is what covers a shell that has been *reparented away* from its recorder: `setsid zsh -i`, `(bash -i &)`, any wrapper whose intermediate process exits, all of which leave the recorder out of the shell's ancestry while its output still reaches the enclosing terminal. Earlier releases decided this by asking whether the shell was a session leader, which let `setsid`, `sudo -i` and `screen` share the enclosing stream; the release after that asked only what the shell could *see* above it, which still let the reparented spelling share it.

    A stream that **nobody is writing** is not a shared stream, and is the one case that falls through to the ordinary resolution: an inherited `SENTINEL_SESSION_LOG` with no live recorder behind it (a container whose recorder never started, or a value exported by hand) names a file no recorder holds open, so there is nothing to break away from. That has to be a **positive** answer, not merely the absence of one: where the shell cannot inspect the stream or the processes that might be writing it (the file is behind a directory it may not search, a candidate recorder's `/proc` entry is refused), it is treated as **nested**, not as free. "I was not allowed to look" is not evidence that nobody is writing it, and the case is reachable with no adversarial intent at all, from `sudo -E -u other zsh` at a recorded prompt.

    A **candidate** here means a `script` process that could plausibly be holding *this* stream: one whose command line names it (the typescript is an argument to `script`, and a process's command line is readable even where its descriptors are not), or that shares this shell's session, or that shares its controlling terminal. An unrelated recorder (another uid's, in another session, on another terminal) is not evidence about this stream and does not make the answer "cannot tell". Without that scoping a single foreign `script` anywhere in the pid namespace, which a `--pid=host` container or a service account running one makes ordinary, would put every shell in the container on the nested path and make the fall-through above unreachable.

    This is why [limitation 3](#known-limitations)'s "the information is not lost" **does** extend to a nested shell, unlike a `tmux`/`ssh`/`script` inner pty where attribution (but not capture) breaks: the nested shell's own hooks keep per-command attribution as well. In the refusal case above the information is still not lost (the enclosing command's window holds every inner byte, raw), but the per-command attribution inside that shell is, exactly as for a `tmux` pane.

13. **Non-interactive execution is not captured at all.** The same coverage boundary as the event stream applies, for the same reason: no shell hooks means no window. See [Command coverage](#command-coverage).

14. **A session that requires output, or that might, does not start without a recorder.** If output is required and the recorder is missing or fails to start, the shell **refuses to start**, with a message naming the remedy. The same refusal covers the case where Sentinel cannot *tell* whether output is required (a deployed configuration that is unreadable or malformed, or an image with no `python3` to read it with), because "we could not read the configuration" is not evidence that nothing consumes output. Audit completeness is preferred to availability in those cases only: the fast path is taken when Sentinel is off (no deployed configuration at all) or when the configuration says nothing consumes output, and an older image is unaffected.

15. **The recorder is a process layer, and a few environment details reflect that.** The terminal device name, `$SHLVL` and the process tree differ from a shell started without it. Only a tool that inspects its own parent process or its controlling terminal's name notices.

16. **A long-running command yields nothing until it ends.** The window closes when the command returns, and the capture is taken then. There is no partial capture of a command still running, and no live view.

17. **A `raw` capture cut with `tail` or `both` is not an exact prefix of the stream.** The seam can fall in the middle of an escape sequence, so replaying such a file can garble the first line after the cut. `truncation: head` avoids it entirely, and the manifest offsets locate it in every mode.

18. **Keystrokes are not captured, by design.** Only what the terminal echoed is recorded. Capturing input would record typed passwords, and is deliberately not implemented.

19. **An operator can forge the capture of their own commands, and the result looks benign.** The markers delimiting each window are printed by hooks in the operator's own interactive shell, and the marker id is a readable shell parameter, so a command line can print a second start marker to shrink its own window to nothing (the event then carries `output_status: unavailable`, the same value produced by a container with no recorder, an image without `script`, or a program that allocated its own pty), or print a whole marker pair around text of its choosing, which is published as that event's `output` with `output_truncated: false` and a consistent `output_bytes`. **There is no downstream signal that distinguishes either from a real capture.** The hooks themselves are functions in that shell too, so they can be redefined; that is true of every Sentinel event, which the same hooks produce.

    What an operator can **not** do is redirect or disable the capture by touching a variable. A directly-recorded shell reads the stream path from its parent `script`'s exec-time environment (which its own `unset`, `export`, or `exec env SENTINEL_SESSION_LOG=… zsh` cannot reach), while any other shell falls back to the outermost ancestor carrying the variable, so a planted value in a shell's own environ still loses to the real stream above it, and a shell with no *carrier of the variable* in its ancestry resolves nothing and emits nothing whatever the variable says, while a shell whose inherited stream a live recorder is writing, or one that cannot tell whether a recorder is writing it, is nested (limitation 12) and records itself into a **new** stream of its own rather than writing into the one it named; the resolved value is then held in a **read-only** shell parameter, so it cannot be reassigned at the prompt to point the logger elsewhere or blanked to switch marker emission off. The stream is also confined to a private directory the wrapper creates, so the path can never be aimed at `logs.json`, at an artifact, or at any file outside that directory. That directory is `0700` under the operator's *own* uid, so they may still append markers to another shell's session stream in it and have the runner punch a hole in that range.

    That is a closed environment/parameter route, not a boundary: **the hooks are functions in the operator's own shell** and can be redefined or unhooked, and a forged marker pair can be printed from the command line. The two paragraphs above are the residual, and it is unchanged. **Treat `output` as evidence of what a cooperative session did, never as tamper-evident.** See [Security considerations](/sentinel/security#what-the-record-covers-and-what-happens-to-it).

20. **A single command that prints more than 512 MiB is captured only from its last 512 MiB.** Each command's window is located by scanning backwards from its end marker to its start marker, and that scan gives up after 512 MiB. Past it the true start is unknown — but the give-up is itself the proof that everything in the last 512 MiB belongs to this command, because the nearest marker of any other command lies further back still. So the capture is taken from that **floor**: the data file is written, `truncated` is `true`, and `start_source` is `scan_floor`. What is lost is everything the command printed *before* the floor, and nothing says how much that was.

    Read `start_source: scan_floor` as "this is the tail of the output, not the output". It is the one truncation whose dropped amount is not reported: `bytes_total` describes the located window, so for a floor capture it describes the floor, not what the terminal actually showed.

    The bytes **are** released, unlike before: a located window is a punched window (limitation 6).

    The ceiling is on **one command's own output**, not on the session stream, which may be far larger; a shell may run any number of commands under it. It sits well above what interactive tooling produces: a `/24` `nmap -A`, a large `ffuf` or `nuclei` run, `ls -laR /` and `find / -ls` are all comfortably inside it. Redirect the genuinely enormous ones to a file: the point of the ceiling is that locating a window costs a pass over it, and the audit event must not wait on an unbounded one.

21. **A command that finishes while another process keeps writing to the same terminal can be reported `unavailable` too.** Locating a window takes two backward scans, and they have separate ceilings. Limitation 20 is about the second one. The **first** starts at the end of the session stream and looks for this command's end marker, and it gives up after **4 MiB**.

    So if more than 4 MiB is appended to the terminal between the moment a command ends and the moment the backgrounded logger scans (a `&`-backgrounded job still printing to the same terminal is the obvious case), the end marker is never reached, and the event carries `output_status: unavailable`: the value read as benign everywhere else.

    The ceiling exists because the distance scanned here is a property of the **session stream**, not of the command, and an audit event must not wait on an unbounded read. In practice it is only reachable with a loud concurrent producer; redirect such a job's output to a file if its commands' captures matter.

### The sentinel path must be on a local filesystem

The event writer serialises appends with an **exclusive advisory lock**, plus a re-check that the file descriptor it holds still points at the inode the path names. The two together are what make concurrent writers safe (`sentinel_logger.py`).

Advisory locking is not reliable over a network filesystem. Over **NFS** in particular, locks may be silently downgraded or simply not propagated between clients, and the guarantee the writer depends on stops holding. Two writers can then interleave, and the event stream is corrupted rather than merely delayed.

**Put the sentinel path on a local filesystem.** If you need the data elsewhere, ship it there with the agent. Do not mount the sentinel path over the network.

The symptom is specific enough to recognise. A corrupted stream produces JSON parse errors on `logs.json`, and the failing lines look like one of two things: a single line containing **two concatenated JSON objects** (`}{`), or a truncated line immediately followed by a complete one. Both mean interleaved writes, not a bug in your parser.

### Rotation and the inode contract

When the event stream passes its size limit it is **renamed**, not copied-and-truncated (`sentinel_logger.py`). The rename preserves the inode, which is precisely the point: an agent that holds the file open keeps reading the renamed generation to its end through the same descriptor, and loses nothing across the rotation. This was chosen because it is the behaviour both Filebeat and the Splunk Universal Forwarder rely on.

Three consequences an operator has to plan for.

**A rename-following reader can follow only one inode hop per poll.** If two rotations happen between two scans, the generation in the middle is skipped entirely. The reader never had a descriptor on it. The product debounces rotation with a minimum interval of half a second to make that rare, at the cost of the event stream briefly exceeding its size limit while the debounce holds. Your counter-measures are a scan interval comfortably under the expected rotation cadence, and a size limit that is not absurdly small: a limit of a few kilobytes will rotate constantly under any real workload and defeat the debounce.

**An agent that is down across a rotation misses that generation permanently.** It restarts on a fresh, empty event stream and never looks at what was rotated away while it was gone. The counter-measure is to glob the rotated generations as well and **deduplicate on `event_id`**. That field is unique per event and exists for this. Re-reading a generation you already shipped then costs nothing but I/O. Note that this only works while the generations are readable: see [Rotated generations and compression](/sentinel/siem/ingest-configuration#_4-rotated-generations-and-compression), which explains why a SIEM-integrated deployment should turn compression off, and note that a non-zero `max_files` puts a hard deadline on how long a catch-up remains possible.

**Rotated filenames are lexicographically sortable on their timestamp segment, so generations sort oldest-first.** The name is the literal prefix `logs.`, a UTC timestamp in a fixed-width form, then `.json`, with `.gz` appended when compression is on; a name collision inserts a counter before the extension. The pruning logic depends on that ordering to decide which generation is oldest, and so can you, with one caveat: within a collision pair the counterless name is written **first** but sorts **second** (`logs.<ts>.1.json` < `logs.<ts>.json`), so the relative order of two generations sharing a microsecond is not meaningful. The exact format, and the reason it must not be parsed as ISO 8601, are on the [Log schema reference](/sentinel/siem/log-schema#rotated-filename-format).

### The permission model, and the directories it does not retrofit

The model as shipped is designed so an ingest service account needs **group membership and nothing else**: no root, no capabilities:

- The container instance directory and its `artifacts/` directory are group-owned by the sentinel group and carry the set-group-id bit, so entries created inside them inherit that group.
- One mode in the tree above is **emergent, not enforced**: `logs.json` at `0660` is never chmod'd, and holds only because the Exegol image sets `umask 0007` in `/opt/.exegol_shells_rc`, which both `bashrc` and `zshrc` source unconditionally. Everything else (the instance directory, `sentinel_config.json`, the `artifacts/` root, the per-command artifact directories, the files inside them) is set explicitly. Seeing `0644` on `logs.json` means the logger was invoked from a context that did not go through that rc, not that your deployment is broken.
- The `artifacts/` root was emergent too, and was published here as `2770` on that basis. It is now chmod'd **`2750`** like the directories below it, at both of the sites that can create it. It had to be: `mkdir(mode=...)` is masked by the umask and `parents=True` ignores `mode` for parents altogether, so under a restrictive umask the root came out `0700` and the sentinel group lost *traverse* into every artifact directory beneath it, however correct those directories' own modes were. The mode also depended on which of the two sites created it first and was frozen from that moment. The lost group *write* bit is deliberate: nothing needs to create or remove artifact directories except the runner, which is `root`.
- Per-command artifact directories are created **`2750`**: group read and traverse, nothing for other, and the set-group-id bit carried down from `artifacts/` so the manifests written inside stay group-owned by the sentinel group.
- The files inside (the manifests, the captures, the copied credential caches) are given **`0640`** explicitly. Group read matters as much as the directory mode does: a traversable directory full of `0600` files is no more readable to the agent than an unreadable directory.

The set-group-id bit is the load-bearing part, and it is easy to lose. A directory whose mode is set to *exactly* `0750` loses it, and every file created inside then lands in the creating process's own group rather than the sentinel group. At that point an agent that is only a *group member* is neither owner nor group of those files, falls through to the `other` class, and gets permission denied on every one of them. That is a worse outcome than an owner-only directory, because the directory listing looks correct.

The gap is that these modes are recent, and **nothing retrofits them**. Artifact directories created by an earlier version were created owner-only (`2700` under the set-group-id `artifacts/` parent, or `0700` on a deployment predating that), and no upgrade path walks the tree to relax them. On a host that has been running Sentinel for a while, an agent will read every new artifact directory correctly and silently see nothing at all in the old ones, which looks like an intermittent collection failure and is not.

The remediation is a one-off. The artifact directories themselves are written from inside the container and are therefore owned by `root`, so it needs `sudo` even though the instance directory above them belongs to you:

```bash
# Relax only the per-command artifact directories that are still owner-only.
# Both owner-only forms are matched: `find -perm` compares the FULL mode, so a
# bare `-perm 700` silently matches nothing on a set-group-id tree, where the
# directories are really 2700.
sudo find ~/.exegol/sentinel/*/artifacts -mindepth 1 -maxdepth 1 -type d \
     \( -perm 700 -o -perm 2700 \) -exec chmod 2750 {} +

# Make the files inside group-readable too. Directories are excluded by -type f,
# so this cannot mark anything executable.
sudo find ~/.exegol/sentinel/*/artifacts -mindepth 2 -type f ! -name '.*' \
     -exec chmod 640 {} +

# Confirm nothing owner-only is left. Match on 2750, not 750: a correctly
# relaxed directory keeps its set-group-id bit, and `! -perm 750` would report
# every one of them as still broken.
find ~/.exegol/sentinel/*/artifacts -mindepth 1 -maxdepth 1 -type d ! -perm 2750
```

Substitute your own sentinel path if you changed it. Write `2750` rather than `750` even though GNU `chmod` happens to preserve the set-group-id bit of a directory it is given a three-digit mode for. That behaviour is a GNU extension, POSIX leaves it unspecified, and the `-perm` predicates above need the explicit form regardless.

**Do not reach for `chmod -R 2750`**: it would apply the directory mode to the files inside as well, marking every manifest and every packet capture executable. The two `find` commands above keep directory and file modes separate.

> [!NOTE] On a single-user deployment there is nothing to configure
> The sentinel group defaults to the group of the user running Exegol, so if you have not set `config.sentinel.log_group_gid` and the agent runs as that same user, the group model is already satisfied and the difference between `2700` and `2750` is invisible to you. It matters when the agent runs as its own service account, which is the recommended posture, and the one [Ingest configuration](/sentinel/siem/ingest-configuration#_2-permissions-the-agent-needs) assumes.

### Container removal destroys the entire local record

> [!DANGER] Removing a container securely shreds its whole Sentinel directory
> **What happens.** Removing a container renames its event stream to the transient name `.logs.removing`, then securely removes the **entire** Sentinel directory for that instance: the event stream, every rotated generation, `sentinel_config.json`, and every artifact directory with every packet capture and credential cache inside it. Files are overwritten before being unlinked. If the host cannot delete them (for example a `root:sentinel_gid 0750` directory the invoking host user has no write access to), Exegol falls back to shredding and removing the whole directory from **inside** the container as root instead, starting the container again if it had been stopped. Every regular file in the tree is removed, not a filename-matched subset, so the directory itself and `sentinel_config.json` are gone too, not left for manual cleanup. Exegol only asks you to remove it manually if that in-container fallback command itself fails (`ExegolContainer`).
>
> **When you are asked, and when you are not.** Removal does ask for confirmation, and the confirmation defaults to *no*. It asks whenever that directory still holds audit data, which is a three-way test: a non-empty `logs.json`, **or** at least one rotated generation, **or** a **non-empty** `artifacts/` directory. Any one of the three is enough on its own. An instance whose events have all rotated away and whose current `logs.json` is empty is prompted for, on the strength of the generations sitting beside it (`ExegolContainer`). Nothing is asked only for a directory holding **none** of the three: no events left anywhere and nothing left inside `artifacts/`. An empty `artifacts/` does not count, and that case is not rare. The runner creates the directory the first time it sees a command and never removes it again, while the per-command subdirectories inside it are cleaned up whenever nothing was collected (`sentinel_runner.py`). Only regular files produced by the writer count as rotated generations: a symbolic link planted inside the directory is never treated as audit data, and a removal never follows it out of the Sentinel tree.
>
> **A confirmed removal is unrecoverable.** There is no undo, no backup, and no archive copy. Anything that had not reached your SIEM at that moment is gone.

Three things follow, and all three are cheap:

- **Verify before you remove.** The prompt asks whether you want the local record destroyed; it says nothing about whether that record ever reached your SIEM, and answering *yes* is the whole confirmation. Check in the agent's own registry (Filebeat's registry, or the forwarder's status) that the instance's files have been fully read, not merely that the agent is running. "The agent is up" is not the same claim.
- **Prefer a write-once or immutable index.** If the SIEM copy cannot be deleted from the host side, host-side destruction stops being a way to lose the audit trail and becomes only a way to lose the local convenience copy. This is the single control that turns the hazard above into a non-event.
- **Make sure `.logs.removing` is excluded.** If your agent picks up the renamed file it will ship the whole stream a second time, producing a final burst of duplicate events for a container that is being destroyed. Both configurations on the [Ingest configuration](/sentinel/siem/ingest-configuration#the-glob-and-why-it-is-that-narrow) page already exclude it; if you wrote your own, add it.

Note that the overwrite-before-unlink is a best-effort secure erase, not a guaranteed physical one: on SSDs, copy-on-write filesystems and journalling filesystems, overwriting a file in place does not necessarily overwrite the blocks that held it. Treat the removal as irreversible for your purposes, and treat the disk as still potentially holding remnants for an adversary's.
