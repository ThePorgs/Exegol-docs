# Profile concepts <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

A **profile** is what turns Sentinel from a command recorder into a collector. Three things build it: a **trigger** is a condition evaluated against a command, an **action** is the extra data collected when that condition holds, and a **rule** pairs a set of triggers with a set of actions. A profile is a list of rules plus an optional `config` block, and it is the unit a container is started with: `exegol start demo full --sentinel-profile core.demo`. The field-by-field schema of every trigger and action type lives on [Triggers](/sentinel/profiles/triggers) and [Actions](/sentinel/profiles/actions); this page does not repeat it. If you want a profile source written for your engagement rather than authoring it yourself, that is offered as an [Enterprise service](/sentinel/#profile-authoring-and-ingest-help).

This page covers the parts a reference table cannot carry: how a name written inside a profile resolves to a definition, what each of the two operators changes, and what the profile-level `config` block controls.

Every source name, profile name and path below is **synthetic**, except where the official `core` source is named explicitly.

## The model

**A trigger is a condition, and nothing else.** It matches on the executable name, on a regular expression over the command line, on a single argument, on an environment variable being set, or it combines other triggers into one named condition. A trigger never collects anything; it only answers yes or no for the command that just ran.

**An action is a collection, and nothing else.** It dumps the environment, captures traffic, copies a Kerberos credential cache, or runs a command of its own and records the output. An action carries no condition; it fires when a rule tells it to.

**A rule is the pairing.** It names the triggers that must hold and the actions to run when they do. A profile carries a list of rules, each evaluated independently against every command, so one profile can collect several unrelated things without any rule knowing about the others.

Triggers, actions and profiles are declared in YAML files under a **source**. A file's top-level keys are `triggers:`, `actions:` and `profiles:`, in any combination. The three do not have to live in the same file, and in the official source they do not.

## An annotated profile

This is `core.demo`, the profile shipped by the official source and the one the [Getting started](/sentinel/getting-started) walkthrough uses, trimmed to what this page explains:

```yaml :scroll
# The core.demo profile. Trigger and action definitions live in their own files.
profiles:
  demo:
    config:
      log_rotation:                 # overrides the ~/.exegol/config.yml defaults, for this profile only
        enabled: true
        compress: true
        max_size: 100MB             # a byte count, or a size string
        max_files: 0                # keep every rotated generation
      env_redact:                   # values of matching variables are masked wherever they would be logged
        - "AWS_SECRET_ACCESS_KEY"   # an exact name is simply a glob with no wildcard
        - "KRBTGT*"
        - "*TOKEN*"                 # quote any glob starting with '*': unquoted it is a YAML alias node, not a string
    rules:
      # Rule 1: a ticket used against a target is worth the credential cache that was used
      - triggers:
          - kerberos_pass_the_ticket  # a bare name: resolved in this profile's own source, then in core
        actions:
          - dump_kerberos
      # Rule 2: a poisoning tool is worth the traffic it produced, for the life of the process
      - triggers:
          - responder_or_bettercap
        actions:
          - capture_net
```

Nothing in that profile defines a trigger or an action. `kerberos_pass_the_ticket` and `dump_kerberos` are **references**, and how a reference becomes a definition is the next section.

## Namespacing and reference resolution

Every trigger, action and profile belongs to the **source** whose files declare it, and its fully-qualified form is `sourcekey.name`. The reserved key of the official Exegol source is `core`; `core.demo` is the `demo` profile of that source. A `.` in a name is always the source separator, which is why trigger, action and profile names themselves may only contain letters, digits, `_` and `-`.

Two different rules govern a bare, unqualified name. They are stated separately because mixing them up is a common source of surprise.

**A trigger or action reference inside a profile falls back to `core`.** An explicit `sourcekey.name` forces that source and is unresolved if the name is absent there; it never quietly searches elsewhere. A bare name resolves against the profile's own source first, and then falls back to the official `core` source. That fallback is what lets a profile in your own source reuse `dump_kerberos` without redefining it, and what lets you shadow a `core` definition by declaring the same name in your own source.

**A profile name passed to `-SP` does not fall back.** An explicit `source.name` selects that source's profile. A bare name resolves to the single source that defines it, and when two sources define the same profile name, the selection is an **error that lists the fully-qualified options** so you can disambiguate, for example `-SP team-profiles.engagement`. There is no `core` preference here, and no silent winner: an ambiguous `-SP` value stops container creation rather than picking one.

**An unresolvable reference aborts the entire configuration.** When a rule names a trigger or action that resolves nowhere, Sentinel refuses to generate a configuration at all instead of dropping the offending reference. Dropping one would change the rule's meaning: an `AND` rule missing a condition becomes **more permissive** and fires on commands it was never meant to, and an `OR` rule missing one **loses coverage** it was written to have. For an audit system, either is a correctness failure, so the failure is loud.

> [!WARNING] An unknown key at profile or rule level is ignored; a missing required one is not
> Every trigger and action option model rejects unknown keys, so `ignore_extenson: true` is a hard validation error you will see immediately. The profile and rule models do **not**: a stray `confg:` block beside a valid `rules:`, or a `triggerz:` sibling beside a valid `triggers:`, is silently ignored and the profile loads looking healthy while collecting nothing. That leniency covers **extra** keys only. `triggers:` and `actions:` are both **required** on every rule, so misspelling one of *those* (`action:` where `actions:` belongs) is not ignored at all: it is a missing-required-field error, and per the warning below it takes the whole source namespace down with it. When a profile validates but never fires, re-read its own keys before suspecting the triggers.

> [!WARNING] One invalid file drops the whole source, not just that file
> A file that fails to parse, or that fails schema validation, takes its **entire source namespace** down with it. Every profile, trigger and action in that source disappears, and `-SP` reports the profile as not found even though you can see the file on disk. A single unquoted `*GLOB*` in one profile is enough to make every other profile in the same source unselectable.

## Advanced profile configuration

The optional `config:` block sits inside a profile, alongside `rules:`, and holds exactly three keys.

### `env_redact`

`env_redact` is a glob **denylist** of environment-variable *names* whose **values** are masked wherever they would be logged, both in the environment-dump artifact and in the captured environment of the command itself. Matching is case-sensitive and the whole name must match, so `KRBTGT*` covers `KRBTGT_SECRET` but a bare `TOKEN` covers only the variable named exactly `TOKEN`.

A masked value is replaced by the literal string `<REDACTED>`, angle-bracketed, exactly as published on the [Log schema reference](/sentinel/siem/log-schema). There is no configuration-file default for `env_redact`: it is engagement-specific, and a profile that does not declare it redacts **nothing**.

### `log_rotation`

A profile's `log_rotation` block overrides the defaults from the `sentinel.log_rotation` section of `~/.exegol/config.yml` for containers using that profile. It is exactly four keys:

| Key | Type | Default | Notes |
| --- | ---- | ------- | ----- |
| `enabled` | boolean | `true` | Turns rotation of the event stream on or off |
| `max_size` | byte count, or a size string such as `100MB` / `512KB` | `100MB` | Rotation happens once the stream grows past this. Must be strictly positive |
| `max_files` | integer | `0` | How many rotated generations to keep. `0` keeps all of them; nothing is ever deleted |
| `compress` | boolean | `true` | Gzip each rotated generation |

There is no fifth key. The interval that debounces two consecutive rotations is fixed product behaviour, not a tunable, and a profile that tries to set it fails validation, which, per the warning above, drops its whole source.

### `log_output`

A profile's `log_output` block overrides the defaults from the `sentinel.log_output` section of `~/.exegol/config.yml` for containers using that profile. It governs the `output` field carried by the events themselves, which is a **different destination** from the artifact written by the `output_capture` action on [Actions](/sentinel/profiles/actions#output-capture). It is exactly three keys:

| Key | Type | Default | Notes |
| --- | ---- | ------- | ----- |
| `enabled` | boolean | `true` | Whether every event carries the cleaned terminal output of its command. Setting it to `false` is the only complete way to keep command output out of the event stream |
| `max_size` | byte count, or a size string such as `4KB` / `64KB` | `4KB` | How much cleaned text is embedded per event. Must be strictly positive: a zero is rejected rather than treated as "off", which is what `enabled` is for |
| `truncation` | `head`, `tail` or `both` | `both` | Which end of an oversized output survives. `both` spends half the budget on each end and names the dropped byte count in between |

As with `log_rotation`, a profile block **replaces the machine-wide default as a whole** rather than merging into it key by key. A profile that declares `log_output` with only `enabled: false` therefore gets the built-in defaults for the other two keys, not the values from `~/.exegol/config.yml`. Declare every key whose value matters to you.

The precedence runs in both directions and has no ceiling: a profile can enable what the machine default disabled, and disable what it enabled.

### Rules, and the two operators

A profile carries a **list** of rules. Each is evaluated independently against every command, so adding a rule never changes what an existing one collects.

Within a rule, triggers can be written two ways, and the second is the only way to get an `OR` at rule level:

```yaml :scroll
# Both rule-level trigger forms, in one profile.
profiles:
  engagement:
    rules:
      # list form: every trigger must hold (an implicit AND)
      - triggers: [kerberos_pass_the_ticket]
        actions: [dump_kerberos]

      # map form: an explicit operator over a list of references
      - triggers:
          operator: OR
          refs: [responder_or_bettercap, kerberos_pass_the_ticket]
        actions: [capture_net]

      # `always` is a reserved system trigger and needs no definition
      - triggers: [always]
        actions: [dump_kerberos]
```

A **composite trigger** is a different thing that reads similarly. It combines several triggers into one *named* trigger carrying its own `AND`/`OR` operator, and that name is then referenced by rules like any other trigger:

```yaml :scroll
# A composite trigger: one name, its own operator, reusable across rules.
triggers:
  kerberos_pass_the_ticket:
    trigger:                        # the YAML key is `trigger`, not `composite`
      operator: AND
      triggers:
        - kerberos_env_var
        - impacket_scripts
        - kerberos_params
```

The distinction matters when a condition is reused. A composite is written once and reused by every rule and every other composite that references it; a rule-level operator applies to that rule alone and cannot be referenced from anywhere else.

## Where a profile lives

A profile is never loose on disk: it lives in a **source**, which is a named directory of trigger, action and profile files. Two sources exist without you declaring anything: `core`, the reserved official source, and `local`, the drop-in directory written on first setup for profiles you author yourself. Any number of additional sources, git-backed or local, can be declared in `~/.exegol/config.yml`.

Declaring a source, the transports it may use, pinning it to a ref, fetching it, and deciding whether to trust it are all covered on [Sources and updates](/sentinel/profiles/sources).

> [!TIP] Qualify the name whenever a second source is in play
> A bare name is convenient while `core` and `local` are the only sources on the machine. The moment a team source is added, write `sourcekey.name` in `-SP` values and in any reference you intend to point at a specific source. It is the one form whose meaning does not change when a name starts existing in two places at once.
