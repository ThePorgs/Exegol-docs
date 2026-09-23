# Agents

An **agent** is a specialised worker with its own role, tools, and budget. When it runs, it works in a **separate** context and hands back a short report. It is not a second copy of the chat you are in.

Agents live under Settings → **Harness**, with the rest of the Studio harness (skills, rules, hooks).

Some agents are made available out of the box to all.

## Agent vs skill

Both live in the harness. They solve different problems.

| | [Skill](/studio/knowledge/skills) | **Agent** |
| --- | --- | --- |
| Is | A procedure (recipe, checklist, template) | A specialised worker with its own brief |
| Where it runs | Inside the **same** chat, as extra instructions | In a **separate** run (a subagent), then reports back |
| Context | Shares the conversation you already have | Starts clean; only the final report returns |
| Cost in the main thread | The skill body while it is loaded | Almost nothing until the report arrives |
| Best for | “Follow this method here” | “Go do this bounded job elsewhere, then summarise” |

Use a **skill** when the main agent should stay in the thread and apply a known procedure.

Use an **agent** when the work is self-contained, noisy, or worth isolating (enumeration, a side research pass, parallel hosts), so the main chat stays readable.

## How the main agent uses them

The **main agent** is the one you talk to in the composer. In [Auto](/studio/behavior/modes) (and custom modes built on it), it can call harness agents as **subagents** on its own: it picks one by reading each agent’s **description**, gives it a standalone brief, and continues from the report. [Answer](/studio/behavior/modes) and [Plan](/studio/behavior/modes) do not offer that.

It does that when:

- The job splits into independent pieces that can run **in parallel** (several targets, several checks)
- The detail would **clutter** the main thread (long tool output, noisy scans) and only the conclusion matters next
- A specialist brief, tool allow-list, or cheaper model fits the side task better than the main agent’s full setup

You can also start one yourself: type `@` and pick an agent, then the task. That agent runs **instead of** the main agent for that turn.

```text
@recon enumerate 10.10.10.0/24 and report only hosts with 445 open
```

> [!TIP]
> Write the **description** so the main agent knows when to pick this worker. Vague (“recon specialist”) gets overused. Specific (“enumerates services on a host list and reports open ports with versions”) gets used for what it is good at.

## Writing one <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The paid plans include additional agents and allow you to write your own.

Settings → **Harness** → **New agent**. Studio opens a form

| Field | What it does |
| ----- | ------------ |
| **Where** | **Global (host)** or a project container. Saving to another place moves the agent there |
| **Name** | Short id (for example `web-recon`). Used for `@name` in the composer |
| **Description** | One line: when to delegate to it. The main agent routes by reading descriptions |
| **Model** | Optional. Leave blank to inherit the main agent’s model |
| **Token budget** | Stops the subagent once it has spent this many tokens |
| **Allowed tools** | Restrict what the subagent may run. None checked means all tools |
| **System prompt** | Role and instructions for the tasks you delegate. Edit / Preview tabs |

Built-in agents stay read-only. Saving a copy under a free name puts your version beside the shipped one; switch either off in the list to pick which runs.

At equal name, the project (container) version wins over global.

## How it feels

When the main agent delegates, the thread shows that a child is working. Expand it to watch the child’s activity. When it finishes, the main agent gets a report and continues. Subagents do not ask you questions mid-run; anything that needs your decision comes back through the main agent and the usual [approvals](/studio/behavior/approvals).

## What a subagent inherits

Always-on [rules](/studio/knowledge/rules) apply. Your [persona](/studio/behavior/personas) does not: the subagent speaks from its own definition so the report stays a report.

> [!NOTE]
> Put hard scope in an always-apply rule if every delegated worker must respect it. A persona or a glob rule will not follow them automatically.

## Import <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Importing agents is a read-only process on the sources. Staging imported items disabled until you review them is the safe default; you can also import them enabled. Settings → Harness → import.
