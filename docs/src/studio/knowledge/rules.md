# Rules

A **rule** is a constraint the agent carries into the turns it applies to: scope, conventions, guardrails. Keep always-on rules short; long methodology belongs in a [skill](/studio/knowledge/skills).

Rules live under Settings → **Harness**, with the rest of the Studio harness (skills, agents, hooks). 

Some rules are made available out of the box to all.

## Writing one <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The paid plans include additional rules and allow you to write your own.

Settings → **Harness** → **New rule**. Studio opens a form

| Field | What it does |
| ----- | ------------ |
| **Where** | **Global (host)** for methodology that follows you, or a project container for this engagement only. Saving to another place moves the rule there |
| **Name** | Short id (for example `scope-rules`) |
| **Description** | One line: what this rule is for |
| **Globs** | Optional comma-separated file patterns. The rule applies when a matching file is referenced this turn |
| **Always apply** | Inject this rule into every prompt for the engagement |
| **Content** | The constraint itself (markdown). Edit / Preview tabs |

> [!NOTE]
> A rule with neither **Globs** nor **Always apply** waits for something to activate it, and nothing does.

Built-in rules stay read-only. Saving a copy under a free name puts your version beside the shipped one; switch either off in the list to pick which runs.

At equal name, the project (container) version wins over global.

> [!CAUTION] Target names are engagement data
> "Scope is 10.10.10.0/24, client Acme" belongs in a **project** container. Written globally, it follows you onto the next job.

## Rules vs hooks vs skills

- **Rule**: instruction the model should follow ([hooks](/studio/knowledge/hooks) enforce in code)
- **Skill**: procedure loaded on demand
- Always-on rules also reach [subagents](/studio/knowledge/agents); glob rules and personas do not

## Import <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Importing rules is a read-only process on the sources. Staging imported items disabled until you review them is the safe default; you can also import them enabled. Settings → Harness → import.
