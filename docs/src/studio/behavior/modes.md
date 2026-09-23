# Modes

The **mode** decides how far the agent goes on a single message before handing control back. It is independent of [approvals](/studio/behavior/approvals) (including Bypass). Pick a mode from composer [quick settings](/studio/interface/composer#quick-settings).

Three built-in modes ship on every plan.

![](/assets/studio/composer.png)

## Built-in modes

::: tabs

=== Auto

Runs tools step by step and stays in the loop between steps. Default for real work. Respects your approval rules unless Bypass is on.

=== Plan

Investigate with **read-only tools** (files, search, optional web/docs), then a written plan card. **No `exec`**, and no write/edit tools: Plan cannot run shell commands.

On the card:

- **Approve & run**: switches to Auto and continues from the plan
- **Request changes**: send the plan back for revision
- **Deny**: stop

File reads still follow your read approval rules.

=== Answer

Chat only. No tools. Nothing runs in the container. Use for explanations and brainstorming.

:::

## Custom modes <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The paid plans allow you to build modes of your own.

Under Settings → **Modes**, create a mode with a name, a turn ceiling, optional time and token budgets, and **Keep working without handing back**.

- Switch **on**: the agent keeps going until the task is done, a limit hits, or you stop it. You can still type to steer mid-run.
- Switch **off**: behaves like Auto, with the ceiling you set.

Modes you already built stay selectable if the plan changes.

> [!TIP] Give a looping mode a budget
> Without a natural pause, a stuck loop burns tokens. Turn ceiling, time, and token budgets are on the same card.

A custom mode still uses Auto's tools and your approval policy. Looping alone does not skip approvals.

## Choosing

| Situation | Mode |
| --------- | ---- |
| Normal engagement | Auto |
| Risky or large task | Plan first |
| Quick question | Answer |
| Long unattended lab sweep | Custom looping mode + careful Bypass use |
