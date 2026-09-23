# Hooks

A **hook** is a shell command that runs automatically at a moment in the run lifecycle. Where a [rule](/studio/knowledge/rules) asks the agent to behave, a hook is **deterministic** policy: written in bash, enforced in code, same event in → same verdict out. The model cannot talk its way around it.

The command always runs **inside the container**, never on the host. No active container means hooks do not run.

Hooks live under Settings → **Harness**, with the rest of the Studio harness (skills, rules, agents).

Some hooks are made available out of the box to all.

## Writing one <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The paid plans include additional hooks and allow you to write your own.

Settings → **Harness** → **Hooks**. Studio opens the hooks editor

| Control | What it does |
| ------- | ------------ |
| **Enable hooks** | Master switch. Off means no hooks run at all |
| **Scope** | Where the config is stored: **Global (host)** file, or the current **project** under `/workspace`. Commands still run in the container either way |
| **Event** | When the hook fires (expand an event to edit its matcher groups) |
| **Matcher** | Which tool or trigger this group applies to (some events run every time and have no matcher) |
| **Command** | Shell command in the container. stdin is the event JSON; exit `2` blocks; stdout can add context |
| **Timeout (s)** | Per-command timeout (default 30) |
| **On** | Enable or disable that command without deleting it |

Add a matcher (or a hook, when the event has no matcher) from the event panel, then add commands under it. Marketplace presets install into the active scope.

## Events

| Event | Fires | Can |
| ----- | ----- | --- |
| `UserPromptSubmit` | When you send a message | Block the prompt, or add context |
| `SessionStart` | New, resumed, or cleared session | Add context |
| `PreToolUse` | Before a tool runs, **before the approval card** | Block, rewrite input, or halt |
| `PostToolUse` | After a tool ran | Add context, or halt |
| `PreCompact` | Before history is summarised | Observe / react |
| `Stop` | When a run ends on its own | Notify, clean up |

## Hook vs rule

| | Rule | Hook |
| --- | ---- | ---- |
| Enforcement | The model decides to follow it | Deterministic: code decides |
| Can block a tool | No | Yes |
| Costs context | Yes, every turn when always-on | No |
| Where it runs | In the prompt | Shell inside the container |

> [!TIP] Hard scope belongs in a hook
> Write the scope as a rule so the agent knows it, and as a `PreToolUse` hook so it cannot ignore it.

## Import <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Importing hooks is a read-only process on the sources. Staging imported items disabled until you review them is the safe default; you can also import them enabled. Settings → Harness → import.
