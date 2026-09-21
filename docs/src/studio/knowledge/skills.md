# Skills

A **skill** is a procedure the agent loads when it needs it: a recipe, checklist, or template. It stays out of the context window until invoked.

Skills live under Settings → **Harness**, with the rest of the Studio harness (rules, agents, hooks). 

Some skills are made available out of the box to all.

## Skill vs rule

| | [Rule](/studio/knowledge/rules) | **Skill** |
| --- | --- | --- |
| Is | A constraint the agent carries | A procedure loaded when needed |
| Active | Always, or when matching files are touched | When you or the agent invoke it |
| Context cost | From the first message | Only when loaded |
| Use for | Scope, guardrails, conventions | Recipes, checklists, templates |

For a specialised **worker** that runs in a separate context and reports back, use an [agent](/studio/knowledge/agents), not a skill.

## Writing one <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/> 

The paid plans include additional skills and allow you to write your own.

Settings → **Harness** → **New skill**. Studio opens a form

| Field | What it does |
| ----- | ------------ |
| **Where** | **Global (host)** for methodology that follows you, or a project container for this engagement only. Saving to another place moves the skill there |
| **Name** | Short id (for example `recon`). Used for `/name` when user-invocable |
| **Description** | One line: when to use it. The agent routes by reading descriptions, never bodies |
| **Allowed tools** | Restrict what the skill may run. None checked means all tools |
| **User-invocable** | Show it in the `/` menu so you can run it by name |
| **Hide from auto-use** | Keep it out of the model's automatic skill selection; only you can run it |
| **Content** | The procedure itself (markdown). Edit / Preview tabs |


Built-in skills stay read-only. Saving a copy under a free name puts your version beside the shipped one; switch either off in the list to pick which runs.

At equal name, the project (container) version wins over global.

A skill can also be a folder with scripts and reference material beside the instructions (useful after import).

## Import <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/> 

Importing skills is a read-only process on the sources. Staging imported items disabled until you review them is the safe default; you can also import them enabled. Settings → Harness → import.
