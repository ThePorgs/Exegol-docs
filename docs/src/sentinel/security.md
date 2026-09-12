# Security considerations <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Sentinel sits in two places that matter to a security review: it **executes profile-defined content inside the operator's container**, and it **moves collected data out of that container** onto the host and into a SIEM. Every risk below follows from one of those two facts. For the profile mechanics themselves see [Actions](/sentinel/profiles/actions) and [Sources and updates](/sentinel/profiles/sources); for what the collected data looks like once it lands, see [Artifacts and limitations](/sentinel/siem/artifacts-limitations).

This page states each risk once, and links to the page that covers the mechanism rather than restating it.

## What a profile can execute in the container

### An action can run arbitrary commands in the container

> [!WARNING] An `exec_command` action runs a profile author's shell command inside your container, by design
> Every time its rule fires, the command written in the profile is executed inside the container, in the operator's own zsh with the operator's `~/.zshrc` sourced, with the container user's privileges and the engagement's network access. It is not filtered, not confined and not reviewed. Unless the profile sets a `timeout`, the shipped behaviour is **unlimited**: the command runs until it finishes or the container stops.

`exec_command` is what lets a profile collect evidence nobody anticipated when the image was built: run a follow-up query, snapshot a state the matched command changed, dump something only the operator's own shell can reach.

The consequence is that **enabling a profile is granting its author command execution inside the container**. Reading a profile before enabling it is the only control that exists at that layer. The other three actions collect data; this one runs code, and no profile is safe merely because it validated.

Note that the runner is detached from the shell, so an unbounded action never blocks the operator's prompt or delays the audit event. A wedged command is a resource problem, not an availability problem, but it is still a process the operator did not start and may not know about. Set `timeout` explicitly whenever the command is not trivially bounded.

### A profile source is a dependency

> [!WARNING] Adding a git profile source grants its authors code execution in every container that uses it
> A source is fetched and its profiles are deployed into containers on your behalf. Because a profile can carry an `exec_command`, the authors of that repository can ship a command into your operators' containers on the next update, without any further action from you. A compromised, transferred or typosquatted source repository is therefore a supply-chain path straight into an engagement.

Output capture widens what such an author can collect: a rule they write can harvest whatever the operator **sees**, not only what the operator runs.

Treat a profile source exactly as you treat any other third-party dependency in your stack.

- **Add only sources you trust**, and trust here means the same thing it means for a package registry: you know who controls the repository and what happens if that changes.
- **Pin the source with `ref:`** to a tag or a commit SHA. Without a pin, every fetch takes whatever the default branch says that day, so an upstream compromise reaches your containers silently. With a pin, moving to a new revision is a deliberate act, and the diff between the old and the new revision is reviewable before you take it.
- **Use the recorded revision as your audit record.** The revision deployed into each container is recorded alongside its configuration, so an operator can answer "which version of which source was active in this container" after the fact rather than inferring it.

Fetching only happens through `exegol update`, which means the window in which a source can change under you is a window you control. See [Sources and updates](/sentinel/profiles/sources) for declaration, pinning and fetch semantics, and [Actions](/sentinel/profiles/actions) for what an action is capable of.

Profile files are read with a safe YAML loader, so parsing one cannot construct arbitrary objects. That is **not** a sandbox: the execution path is `exec_command`, which runs after parsing succeeds and is a documented feature rather than a parser flaw. A well-formed, schema-valid profile from an untrusted source is exactly as dangerous as the commands it declares.

The same distinction applies to the validation performed when the configuration is loaded. A source key is constrained to a directory-safe character set because it is used as a directory name, and a git URL must match a supported remote form. Both checks reject a **malformed** declaration; neither says anything about whether the repository behind a well-formed URL deserves your trust. Validation is a shape check, and the trust decision stays yours.

## What leaves the container

### What is collected leaves the container

> [!WARNING] A `dump_env` action with no `filters` collects every environment variable in the command's environment
> That includes exported credentials, session tokens and target passwords. The resulting artifact is written to the host directory alongside the event stream and is picked up by whatever agent ingests it, so an unfiltered environment dump is a decision to put those values in your SIEM.

Two mechanisms reduce the blast radius, and they are different tools that solve different halves of the problem:

- **`filters` on the action is an allowlist over variable *names*.** It decides which variables are collected at all. Absent or empty, everything is collected.
- **`env_redact` at profile level is a denylist over variable *names* whose *values* are masked.** A matching variable is still recorded, but its value is replaced by the marker published on the [Log schema reference](/sentinel/siem/log-schema#empty-null-and-placeholder-values) (the angle-bracketed `<REDACTED>` form, never a square-bracketed one) everywhere it would otherwise be logged.

Neither is on by default, and neither is a substitute for the other: an allowlist that admits a variable still logs its value unless the denylist masks it. Decide both per engagement, because which variable names carry secrets is an engagement-specific fact. See [Profile concepts](/sentinel/profiles/concepts) for where each is declared.

### An artifact can be a usable credential, not merely a record of one

> [!WARNING] Some artifacts are the secret itself, not a description of it
> A Kerberos credential-cache collection copies the operator's live credential cache into the artifact directory, keeping its original name. A packet capture records the engagement's traffic as it was on the wire, cleartext protocols included. Anyone who can read those files can use what is in them for as long as the material remains valid.

This sets the sensitivity floor for everything downstream. The host directory, the transport your agent uses and the SIEM index that receives the data all inherit the sensitivity of the most sensitive artifact any enabled profile collects, which is usually higher than the event stream alone would suggest. Two consequences to decide up front: restrict the ingest path and the destination index accordingly, and set a retention policy on the artifacts, because a credential cache that outlives the engagement in a log store is a liability rather than evidence.

### The event stream itself is sensitive

> [!IMPORTANT] Command lines are recorded verbatim, and command lines routinely contain secrets
> Every captured event records the command as typed and as resolved. A password or a token passed as a literal argument is therefore written into the event stream exactly as it appeared, and the redaction denylist cannot help. It matches environment variable *names*, so it masks a secret that reached the command line through a variable, and has nothing to match on for one that was typed inline.

The practical control is a habit rather than a setting: put secrets in an environment variable covered by `env_redact` and reference the variable, instead of typing the value as an argument. The command line then records the reference, the value is masked wherever it would be logged, and the event stays useful as a record of what was run.

### Operator-supplied metadata is unfiltered and self-reported

> [!WARNING] Whatever is in `EXEGOL_SENTINEL_META` is copied verbatim onto every event and is **not** redacted
> The `env_redact` denylist does **not** apply to these two variables, unlike `envs_in_command` and the inline `output` field. This is a deliberate choice rather than a gap, and there is no setting that turns it off: the values are typed by the operator as engagement context, so the operator decides what goes in them.

The consequence, stated without hedging: **a secret pasted into `EXEGOL_SENTINEL_META` reaches the client's SIEM in cleartext, on every event of the session, and nothing masks it.** A client name, an engagement code or an auditor's name is what these variables are for. A password, an API token or a credential is not, and there is no mechanism that will catch the mistake.

**There is no size or count limit either.** Neither the number of keys nor the length of a value is capped or truncated, and whatever you set is repeated on every event, so a large value is multiplied by the number of commands in the engagement before it reaches the index. Weigh that against your ingest volume: the cost is paid per command, not once.

**They are self-reported.** Any process in the container can read, change or unset either variable, so a tag is a **claim, not a control**. Attribution built on a metadata key is a convenience label: an operator who wants their events to look like someone else's can make them, and after the fact nothing downstream can tell. That is the same residual [an operator forging the capture of their own commands](#an-operator-can-forge-the-capture-of-their-own-commands) describes below, for the same reason — the mechanism sits inside the operator's own shell.

The control is therefore procedural rather than technical: agree the key set with the client before the engagement, keep the values to identifiers, and remember that everyone who can read the event stream can read them.

### Command output leaves the container, by default

> [!WARNING] Every command's terminal output is recorded into the event stream unless you turn it off
> The inline `output` field is **enabled by default**. With Sentinel on, each event carries what its command printed to the terminal, and that travels to your SIEM with the rest of the stream. It **cannot be filtered the way environment variables can**: there is no allowlist over it and no per-rule suppression, because output is free text rather than a set of named values. The `env_redact` denylist *is* applied to it, but only as a **best effort**: it substitutes the values of every variable whose name matches the profile's globs, whether or not the command line referenced it, and it cannot mask a secret that was typed inline, one derived inside the command, one the terminal wrapped across two lines, or one shorter than four characters. The only complete control is setting `log_output.enabled` to `false`: `sentinel.log_output.enabled` in `~/.exegol/config.yml`, or `config.log_output.enabled` in the profile, which wins for the containers using it.

That control exists for exactly one situation, and it is a common one: output can be disabled for a client who does not want to risk secrets reaching their Splunk, **precisely because** output cannot be filtered the way environment variables are. It is a per-machine or per-profile decision rather than a per-rule one, so make it with the client before the engagement rather than after the first capture.

Two further facts belong to the same decision:

- **Turning the inline field off does not disable the `output_capture` action.** That action is a separate, per-rule opt-in, and its artifact lands on the host volume with everything else. A container where neither is in use starts no recorder at all.
- **The artifact is never redacted.** Masking is applied to the event's `output` field only. The `raw` artifact is a byte-exact copy of what the terminal displayed, deliberately, because it is evidence, which means it sets the sensitivity floor described above just as a credential cache does.

The complete list of what the mechanism records, and what it cannot, is on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#what-output-capture-does-and-does-not-record).

### An operator can forge the capture of their own commands

> [!WARNING] Output capture records what an operator's shell reports, and that shell belongs to the operator
> The markers that delimit each command's output are printed by hooks running **inside the operator's own interactive shell**, and the marker id is a shell parameter that any command in that shell can read. An operator who knows this can print a second start marker after a command to shrink its window to nothing (the event then carries `output_status: unavailable`, the **same value** a container with no recorder, an image without `script`, or a program that allocated its own pty produces), or print a whole marker pair around text of their choosing, which becomes that event's `output` with `output_truncated: false` and a plausible `output_bytes`. After the fact, neither is distinguishable from a genuine capture.

This is a property of where the mechanism sits, not a defect that a stricter setting closes: any value a hook in the operator's shell can print, a command in that same shell can print too. The hooks are shell functions in that same shell as well, so an operator can redefine or unhook them, which is exactly as true of every other Sentinel event, since the same hooks produce all of them.

What the operator cannot do is **redirect or disable the capture by touching a variable**, which is a narrower statement than it may look, and deliberately so. The session stream's path is not taken from the live `SENTINEL_SESSION_LOG` variable in the operator's shell. A directly-recorded shell (the one `script` started, a session leader whose parent is that `script`) reads the path from its **parent `script`'s** exec-time environment (`/proc/<ppid>/environ`), which the operator cannot rewrite and which its own `unset`, `export`, or even `exec env SENTINEL_SESSION_LOG=… zsh` cannot reach. A shell that is neither the recorded leader nor able to start its own recorder falls back to the outermost ancestor carrying the variable, so a planted value in its own environ still loses to the real stream above it; a shell with **no carrier of the variable** anywhere in its ancestry resolves nothing and emits nothing whatever the variable says. The resolved value is then held in a **read-only** shell parameter, so it cannot be reassigned at the prompt to point the logger elsewhere, nor blanked to switch marker emission off. The stream is additionally confined to a private directory the wrapper creates, so the path can never be aimed at the audit stream, at the event log, or at any file outside that directory (neither to read one nor to have the runner punch a hole in one). That directory is `0700` under the operator's own uid, so within it an operator can still append markers to *another* shell's session stream and have the runner release a byte range of it. (A nested interactive shell does not share a stream: it records into its own `script`, so there is no enclosing window for it to reach into, and where it cannot start one, or was started with an invocation that cannot be reproduced, it is given **no** stream rather than the enclosing one. The single case that resolves an inherited path normally is a stream **no live recorder is writing**, which is not a shared stream at all; a stream the shell cannot *inspect* (another uid's, behind a directory it may not search, or a candidate recorder whose `/proc` entry is refused) counts as nested, because "I was not allowed to look" is not evidence that nobody is writing it. A *candidate* is scoped to a recorder that could plausibly hold this stream (one naming it on its command line, or sharing this shell's session or controlling terminal), so an unrelated recorder elsewhere in the pid namespace does not put every shell on the nested path. See [limitation 12](/sentinel/siem/artifacts-limitations#known-limitations).)

None of that makes the capture tamper-proof, and it does not contradict the paragraph above: **the hooks themselves remain the operator's**. They can be redefined or unhooked, and a forged marker pair can be printed from the command line. Those are the residual, and they are what the previous two paragraphs describe. What the read-only resolved path removes is only the *environment and parameter* route to the same result: there is no variable an operator can set that silently redirects the stream or switches capture off while the hooks keep running and the events keep arriving.

> [!WARNING] The inline `output` field is not tamper-evident
> Treat it as evidence of what a **cooperative** session did, never as proof of what a session did. An operator who wants to control what their commands appear to have printed can, and nothing downstream can tell.

Pair it with the same monitoring the previous section describes: an engagement container whose events stop carrying output, or that never carried any, is worth the same question as one with no events at all.

### A source URL travels with the deployed configuration

> [!IMPORTANT] The deployed configuration records where each profile came from, and that record leaves the container too
> Source provenance is written into the configuration deployed into each container, which is readable from inside the container and is shipped to the SIEM along with the rest of the Sentinel data. The wrapper sanitises the recorded URL precisely because a git URL is a plausible place for a credential to hide.

That sanitisation is a safety net, not a licence. **A profile source URL should never carry an embedded credential**: no token in the userinfo of an HTTPS URL, no password in a remote spec. Authenticate with an SSH key or a git credential helper on the host, both of which keep the secret out of the configuration entirely. See [Sources and updates](/sentinel/profiles/sources) for the supported transports.

## What the record covers, and what happens to it

### Sentinel records interactive commands, not every process

> [!WARNING] Sentinel is a record of what an operator typed, not a process audit
> Commands are captured through interactive shell hooks, so anything that never passes through an interactive prompt produces no event. A control that assumes every process in the container is recorded will be wrong in both directions.

The invocations that are not captured are enumerated on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#command-coverage), which covers that list. If your threat model needs process-level coverage, run host-level process auditing alongside Sentinel rather than in place of it.

### An absent record looks the same as an uneventful engagement

> [!WARNING] Enabling Sentinel on a session that is not entitled to it does not fail the command
> Sentinel is an Enterprise add-on. When the session has no Enterprise access, or has Enterprise access without the Sentinel feature, asking for it emits a warning and the container is created **without** Sentinel rather than the creation being refused. The container works normally; it simply produces no audit record.

The consequence is that "there are no events for that container" has two very different explanations (nothing was run, or nothing was ever recorded) and after the fact they are indistinguishable. Verify at the start of an engagement rather than at the end of one: confirm the container instance directory exists on the host and that its event stream is being written to, as described in [Getting started](/sentinel/getting-started). A monitoring rule that alerts on an engagement container with no recent events turns this from an after-the-fact discovery into a same-day one.

### The artifact permission model is fixed at container creation

> [!NOTE] The audit data is group-restricted, and the group is chosen once, from configuration
> The Sentinel directory for a container instance and the artifacts inside it are readable by a group rather than by everyone, so a log-shipping agent that is a member of that group can ingest the data without running as the operator. Which group that is comes from the `log_group_gid` configuration key.

Widening that group widens access to credential caches, packet captures and environment dumps, so pick the service account's own group rather than a broad shared one. The exact modes, ownership, the set-group-id behaviour they depend on, and the case the model does not retrofit are published on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#the-permission-model-and-the-directories-it-does-not-retrofit).

### Removing a container destroys its Sentinel record

> [!DANGER] Removing a container securely shreds that container's entire Sentinel directory
> The event stream, every rotated generation and every artifact are destroyed, and a confirmed removal is unrecoverable.

The full behaviour, the confirmation prompt's exact conditions and the controls that make the loss a non-event are published on [Artifacts and limitations](/sentinel/siem/artifacts-limitations#container-removal-destroys-the-entire-local-record).
