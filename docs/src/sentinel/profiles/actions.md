# Actions <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

An **action** is the collection half of a profile rule: when the rule's [triggers](/sentinel/profiles/triggers) match a command, its actions run and write what they collected into that command's artifact directory. The event in the stream records what was typed; the action records the surrounding context the profile asked for. This is what produces the artifacts an event's `artifact_id` points at. The field is defined on the [Log schema reference](/sentinel/siem/log-schema#event-fields), and the files themselves are mapped on [Artifacts and limitations](/sentinel/siem/artifacts-limitations).

This page defines every action type and every option it accepts.

Every action name, command and variable name below is **synthetic**.

## Action types

Five types exist, and an action declares exactly one of them: the single key underneath an action's name *is* its type.

| YAML key | Collects | Required parameter |
| -------- | -------- | ------------------ |
| `dump_env` | the environment the command ran in | *(none)* |
| `network_capture` | the packets sent while the command ran | *(none)* |
| `dump_kerberos` | the Kerberos credential cache the command used | *(none)*, but see the empty-mapping rule below |
| `exec_command` | the output of a shell command run on the operator's behalf | `command` |
| `output_capture` | the terminal output of the operator's **own** matched command | *(none)* |

> [!WARNING] `exec_command` is remote code execution by design, not a sandboxed hook
> Every time its rule fires, the command in the profile is executed inside the container, in the operator's own zsh, with the operator's `~/.zshrc` sourced. It is not filtered, not confined, and not reviewed. Adding a profile source is therefore equivalent to adding a dependency that can run code in your container. Treat it that way, and read [Security considerations](/sentinel/security) before pointing Sentinel at a source you did not write.

### `dump_env`

Writes the environment of the matched command into the artifact directory.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `filters` | list of glob patterns | Default `[]`. An **allowlist** of variable *names*, matched with case-sensitive `fnmatch` globs, never against values. Quote any pattern that begins with `*` |

Absent or empty, `filters` captures every environment variable in the command's environment, credentials included. Naming even one pattern flips the action from capture-everything to capture-only-these, which is why the example below always carries one.

```yaml
actions:
  aws_and_token_env:
    dump_env:
      filters:
        - 'AWS_*'      # matched against NAMES, case-sensitively
        - '*_TOKEN'    # quoted: a leading `*` is an alias node in YAML
```

> [!WARNING] With no `filters`, this action captures every environment variable in the command's environment
> That includes exported credentials, session tokens and target passwords, and the artifact then leaves the container with the rest of the collected data. Two things reduce the blast radius, and they are different tools: `filters` is an allowlist that decides which variables are collected at all, while the profile-level `env_redact` denylist on [Profile concepts](/sentinel/profiles/concepts) masks the *values* of matching variables to the literal marker documented on the [Log schema reference](/sentinel/siem/log-schema#empty-null-and-placeholder-values). The marker is angle-bracketed, never square-bracketed.

### `network_capture`

Runs a packet capture spanning the matched command's execution.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `interface` | string | Default `any`. Passed straight to `tcpdump -i`. `any` captures on every interface at once |
| `duration` | integer (seconds) | Unset by default. A fixed capture window; omit it to capture for the lifetime of the matching process |

```yaml
actions:
  capture_everything:
    network_capture:
      interface: any
      # duration omitted on purpose: capture for as long as the command runs

  capture_window:
    network_capture:
      interface: eth0
      duration: 30
```

### `dump_kerberos`

Copies the Kerberos credential cache the matched command used into the artifact directory. It takes no parameters. The empty mapping after the colon is mandatory: always write `dump_kerberos: {}`.

The cache is resolved in two steps. The value of `KRB5CCNAME` captured from the command's environment is used first, with a `FILE:` prefix stripped when present. When that variable is unset, the action falls back to scanning `/tmp` for names matching `krb5cc_` followed by digits, and copies what it finds, so a rule that does not itself require `KRB5CCNAME` still collects something on a default-configured host.

```yaml
actions:
  grab_ccache:
    dump_kerberos: {}   # the braces are required
```

> [!WARNING] A bare `dump_kerberos:` is a validation failure, not an empty action
> Written with nothing after the colon, the key's value is YAML `null` rather than an empty mapping, and validation rejects it with seven errors. The failure is not scoped to the action: the entire source namespace is dropped, so one missing pair of braces makes every profile in that source disappear. Write `dump_kerberos: {}`.

### `exec_command`

Runs a shell command inside the container after the matched command finishes, and stores its output, exit code and duration as an artifact.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `command` | string | **Required.** Executed in the operator's zsh with `~/.zshrc` sourced, so aliases and shell functions resolve as they do at the prompt |
| `timeout` | integer seconds, zero or greater | Default **unlimited**; `0` spells the same thing explicitly. When set to a positive value and exceeded, the command's whole process group is killed and the artifact records that it was cut short |
| `max_output` | integer bytes, or a size string such as `512KB` | Default `1000000` (1 MB). Set it to `0` to keep **everything**, with no cap. Note the asymmetry with `timeout`: omitting `max_output` gives you the 1 MB default, *not* unlimited, so `0` is the only way to ask for the whole output. Applied to standard output and standard error separately. Output beyond the limit is dropped and the artifact is flagged as truncated. A value that cannot be read (a leftover string, a negative) still falls back to the 1 MB default rather than to no cap |

```yaml
actions:
  host_context:
    exec_command:
      command: id
      timeout: 30      # omit this key and the command runs to completion
      max_output: 512KB
```

> [!WARNING] `exec_command` has no time limit unless the profile sets one
> Omit `timeout` and the command runs to completion, however long that takes; the shipped behaviour is unlimited, and there is no built-in ceiling to fall back on. Nothing hangs the operator's shell as a result (the runner is detached from the logger and never blocks the audit event), but a long-running or wedged command stays alive until it finishes or the container stops. Set the key explicitly whenever the command is not trivially bounded.

### `output_capture`

Copies the terminal output of the **matched command itself** into the artifact directory, after that command has finished. What is captured is what the operator saw: stdout and stderr as the terminal interleaved them, which is a single merged stream and is declared as such in the manifest.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `format` | `raw` or `text` | Default `raw`. `raw` keeps the terminal bytes as they were, colours and control sequences included, so the capture replays. `text` applies the same cleaning the inline output field uses: escape sequences removed, and carriage-return overwrites collapsed to what the terminal finally showed |
| `max_size` | integer bytes, or a size string such as `2MB` | Default **unlimited** for `format: raw`: omit the key, or set it to `0`, and the whole capture is kept, however large it is, because a raw capture is copied in bounded chunks and never held in memory. **Required for `format: text`**: cleaning cannot be done chunk by chunk (an escape sequence straddling a chunk boundary would survive as visible text) and the cap is counted in cleaned bytes, so a text capture reads the whole window into memory at once **whatever its limit** (the limit bounds the artifact it leaves behind, not the read). `text` is therefore the one format whose cost is not proportional to what it writes, and the bound is required so a profile author chooses it rather than inheriting the container's 1 MB default (which is reported as `cap_source: runner_default` in the manifest). Declaring `format: text` without a **positive** `max_size` is a validation error (`0` means unlimited here, so it does not satisfy the requirement), and per the [source-wide failure rule](/sentinel/profiles/concepts) that takes the whole source namespace down with it. When set, it is counted in raw bytes for `format: raw` and in cleaned bytes for `format: text` |
| `truncation` | `head`, `tail` or `both` | Default `head`. Which end of an over-limit capture survives; `both` spends half the budget on each end. It may only be set **together with** a **positive** `max_size` (`0` means unlimited, so it does not count as a limit to truncate at): on its own it is a validation error, and per the [source-wide failure rule](/sentinel/profiles/concepts) that takes the whole source namespace down with it |

Each action produces **two files**: a data file, `output_{name}.raw` or `output_{name}.txt` depending on the format, and a manifest, `output_{name}.json`. The manifest carries byte counts, the truncation offsets and a status, and never the captured bytes themselves. Its keys, and the identity that lets a consumer locate where a truncated capture was cut, are on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#the-output-manifest).

**There is no combined format.** Capturing one command both ways is *two* actions on the same rule; each gets its own file pair and its own manifest, and two `output_capture` actions with **different options** on one rule coexist without interfering. Two actions whose options are identical are deduplicated into a single file pair (the runner keys triggered actions on their option set, not on their name), so declare a given option set once.

**The file name is a sanitised form of the action name, so the two may differ.** Every character outside `A-Za-z0-9_.-` is replaced by an underscore, exactly as it is for `exec_command`; the caveat is spelled out with the [execution manifest](/sentinel/siem/artifacts-limitations#the-execution-manifest) and applies here unchanged.

```yaml :scroll
# One profile capturing a credential-dumping command's output two ways.
triggers:
  secretsdump:
    command:
      name: [secretsdump.py, secretsdump]

actions:
  keep_full_output:
    output_capture:
      format: raw              # the terminal bytes as they were: replayable, colours kept
                               # no max_size (or max_size: 0): the whole capture is kept, however large

  keep_text_head:
    output_capture:
      format: text             # cleaned, as the terminal finally showed it
      max_size: 2MB            # REQUIRED for `format: text`: the window is read and cleaned
                               # whole at any limit, so this bounds the ARTIFACT and must be
                               # chosen, not inherited; also what `truncation` needs
      truncation: head

profiles:
  engagement:
    config:
      log_output:              # a DIFFERENT destination: the inline field of every event
        enabled: true
        max_size: 8KB
        truncation: both
    rules:
      - triggers: [secretsdump]
        actions: [keep_full_output]     # add keep_text_head here as well to get both formats
```

> [!WARNING] The inline output field is a second destination, and it is on by default
> This action is opt-in per rule, but it is not the only way command output leaves the container. The `log_output` block above governs an `output` field carried by **every** event, for every command, and it is enabled by default. Read [Security considerations](/sentinel/security#what-leaves-the-container) before assuming that declaring no `output_capture` action means no command output reaches your SIEM.

## When each action runs

Four of the five actions run **after** the matched command finishes: `dump_env`, `dump_kerberos`, `exec_command` and `output_capture` all observe the state the command left behind. `output_capture` is necessarily among them: it copies what the command printed, which does not exist until the command has printed it, and its size limit is therefore a slicing rule applied to a finished recording rather than anything the running command can be signalled by.

`network_capture` is the exception, and the only action with a phase before the command. The capture starts **before** the command is executed and is stopped afterwards, so it spans the command's execution rather than trailing it. That is what makes a capture without a `duration` meaningful: it lasts exactly as long as the process being watched.

The practical consequence is ordering, not performance. An `exec_command` reading a file the matched command wrote sees it; a packet capture started after the fact would have missed the traffic, which is why this action alone is bracketed around the command.

## Where the collected data lands

Every action writes into the artifact directory of the command that triggered it, and that directory is named by the same identifier the command's event carries. The file names each action produces, the directory layout, the ownership and the permission modes are documented on [Artifacts and limitations](/sentinel/siem/artifacts-limitations). The copied Kerberos credential cache in particular keeps its own original name rather than being renamed by the action, as documented there.

## Where these facts come from

| What is documented here | Established by |
| ----------------------- | -------------- |
| The five types, their YAML keys and their options | the action option models in `SentinelProfile.py` |
| The `filters`, `interface` and `max_output` values | the field defaults on those same models |
| The absence of a time limit, and the output ceiling | the `DEFAULT_EXEC_*` constants in `sentinel_runner.py` |
| Which phase each action runs in | the action-to-phase map in `sentinel_runner.py` |
| Credential-cache resolution and the execution environment | the action implementations in `sentinel_runner.py` |
