# Triggers <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

A **trigger** is the condition half of a profile rule: it inspects a command the operator typed and answers one question: does this command match. A rule pairs triggers with actions and runs the actions only when the triggers match, so a trigger never collects anything by itself. See [Actions](/sentinel/profiles/actions) for the collection half, and [Profile concepts](/sentinel/profiles/concepts) for the rule syntax that joins the two and for how a bare name resolves to a definition in a given source.

This page defines every trigger type and every option it accepts.

Every trigger name, command name and pattern below is **synthetic**.

## Trigger types

Five types exist, and a trigger declares exactly one of them: the single key underneath a trigger's name *is* its type.

| YAML key | Matches on | Required parameter |
| -------- | ---------- | ------------------ |
| `command` | the executable name of the command | `name` |
| `regex` | the full command line | `pattern` |
| `parameter` | a single argument | `argument` |
| `env_var` | an environment variable being set | `variable` |
| `trigger` | other triggers, combined with `AND` or `OR` | `triggers` |

> [!WARNING] The composite trigger's YAML key is `trigger`, not `composite`
> Every other type is named after the thing it inspects, and a composite inspects other triggers, so the key reads `trigger:` while the type is called *composite* in prose. This is the most likely thing to get wrong when writing a profile from memory. A block written as `composite:` is an unknown key, which is a hard validation error, not a silently ignored one.

### `command`

Matches when the executable name of the command is one of the listed names. Every command in the line is examined, so a name appearing anywhere in a pipeline matches, and both the invoked path and its final component are compared against each entry.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `name` | string \| list of strings | **Required.** One name, or a list any one of which matches. Compared to the executable name, not the whole line |
| `ignore_extension` | boolean | Default `false`. Strips the file extension before comparing, so `secretsdump.py` matches `secretsdump` |

```yaml
triggers:
  impacket_family:
    command:
      name:
        - secretsdump
        - psexec
        - wmiexec
      ignore_extension: true   # one entry covers both `secretsdump` and `secretsdump.py`
```

### `regex`

Matches when the pattern is found anywhere in the command line. The pattern is a Python regular expression and is searched (not anchored), so no `.*` padding is needed at either end. Both spellings of the line are tested, the command **as typed** and the same command **alias-resolved and variable-expanded**, and a match on either one fires. Those two spellings are the `user_command` and `resolved_command` fields of the event, defined on the [Log schema reference](/sentinel/siem/log-schema#event-fields).

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `pattern` | string | **Required.** Python regular expression, searched against the full command line. Quote it in YAML: a bare pattern containing `:`, `#` or a leading `*` is not the string it looks like |
| `ignore_case` | boolean | Default `false`. Applies the case-insensitive flag to the search |

```yaml
triggers:
  password_on_the_command_line:
    regex:
      pattern: '--password\s+\S+'   # single-quoted: backslashes stay literal
      ignore_case: true
```

### `parameter`

Matches when a single argument is present on the command line. The argument is first compared against the command's parsed arguments, which are parsed from the **alias-resolved and variable-expanded** spelling of the line. The typed spelling is parsed only when the resolved one is unavailable. When the argument is not a standalone token there, the check falls back to a plain substring fallback test against the command **as typed**. The two halves therefore read the two different spellings the [`regex`](#regex) section names, so an argument that appears only after alias resolution matches through the parsed-argument test and never through the substring fallback.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `argument` | string | **Required.** Matched exactly against the parsed arguments. Values are not inspected: `argument: -k` matches the flag wherever it appears |

```yaml
triggers:
  kerberos_flag:
    parameter:
      argument: -k
```

### `env_var`

Matches when the named environment variable is **set** in the environment of the command. It is a presence test: the value is never compared, and an empty value still counts as set.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `variable` | string \| list of strings | **Required.** One name, or a list any one of which matches. Presence only: no value matching, and no globbing on the name |

```yaml
triggers:
  has_credential_cache:
    env_var:
      variable: KRB5CCNAME
```

### `trigger` (composite)

Combines other triggers with a boolean operator. Its entries are either the **names** of triggers defined elsewhere, or **inline anonymous triggers** written in place. The inline form is easy to miss, and it is what the official `core` source uses for the Kerberos parameter test below.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `operator` | `AND` \| `OR` | Default `AND`. Uppercase only. `AND` requires every entry to match; `OR` requires one |
| `triggers` | list | **Required.** Trigger names, or inline trigger objects of any type, including a nested composite |

```yaml
triggers:
  # An inline anonymous trigger has no name and cannot be referenced elsewhere.
  kerberos_params:
    trigger:
      operator: OR
      triggers:
        - parameter:
            argument: -k
        - parameter:
            argument: --kerberos

  has_credential_cache:
    env_var:
      variable: KRB5CCNAME

  # Named entries and the default AND operator: every one of them must match.
  pass_the_ticket:
    trigger:
      operator: AND
      triggers:
        - has_credential_cache
        - kerberos_params
```

## Naming and reserved names

Trigger, action and profile names accept **letters, digits, underscore and hyphen only**. A `.` is rejected because it is the source separator: `core.demo` means the entity `demo` in the source `core`, so a name containing a dot would be read back as a reference into a source that does not exist.

Two trigger names are reserved by the system and behave as constants.

| Name | Behaviour |
| ---- | --------- |
| `always` | Matches every command. The idiomatic way to run an action on everything the operator types |
| `never` | Matches nothing. Useful to park a rule without deleting it |

Neither has to be defined anywhere. A rule referencing `always` works in a profile that declares no triggers at all:

```yaml
profiles:
  record_everything:
    rules:
      - triggers: [always]
        actions: [collect_context]
```

> [!WARNING] `always` and `never` are reserved and cannot be defined as trigger names
> They are usable from any rule without a definition, and declaring a trigger under either name is rejected at load time with an explicit error rather than overriding the built-in behaviour. The rejection applies to the whole file, so the profiles alongside it do not load either.

## Validation

Every trigger option model **forbids unknown keys**. A misspelled option is not ignored and does not fall back to a default. It is a hard validation error at load time.

> [!WARNING] One typo inside a trigger block makes every profile in that source disappear
> A parse or validation failure is not scoped to the file that contains it: the entire source namespace is dropped, so an unknown key in one trigger takes down every trigger, action and profile that source provides, including ones in files that are perfectly valid. The asymmetry between this and a typo at profile level, which is silently ignored, is explained in full on [Profile concepts](/sentinel/profiles/concepts).

## Where these facts come from

| What is documented here | Established by |
| ----------------------- | -------------- |
| The five types, their YAML keys and their options | the `*TriggerOptions` models in `SentinelProfile.py` |
| The defaults for `ignore_extension`, `ignore_case` and `operator` | the field defaults on those same models |
| Matching behaviour of each type | the trigger evaluation in `sentinel_runner.py` |
| The reserved names, the accepted characters and the rejection of unknown keys | the validators on `SentinelConfig` |
