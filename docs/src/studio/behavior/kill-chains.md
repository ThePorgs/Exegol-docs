# Kill chains

A **kill chain** is the attack path as a graph, written by the agent as it confirms steps. Not a diagram you draw by hand: a record that turns a finished box into a path instead of a scrollback.

Kill chains live under Settings → **Kill chains**, and open from a kill-chain tool card in chat. A project can hold **many** chains; switching projects switches the set. They are stored in the container, with the [project](/studio/interface/projects).

Kill chains are available on every plan. Clean PNG export without a watermark is part of the paid plans.

## What is in it

| Node | Meaning |
| ---- | ------- |
| **Host** | Machine, IP, hostname, domain controller |
| **Credential** | User, hash, token, key |
| **Site** | Application or service on the network |
| **Step** | Exploit, pivot, privilege escalation |
| **Loot** | Flag, file, domain admin |

Edges are moves between them. The graph reads toward loot.

## Status

| Status | Look | Meaning |
| ------ | ---- | ------- |
| **Confirmed** | Solid | Backed by evidence the agent saw |
| **Hypothesis** | Dashed | Plausible, untested |
| **Failed** | Red | Tried, did not work |

> [!TIP] Keep failed nodes
> They are what you forget by morning, and what a teammate needs before repeating the same dead end.

## Reading and replay

The layout is force-directed. Click a node for evidence. **Replay** walks discovery order for reports and debriefs. Drag to pin nodes.

## Export <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

**Export PNG** captures the canvas as shown (hypotheses and failures included). Every plan can export; Community exports may include an Exegol watermark. The paid plans export **without** the watermark.

## Asking the agent

`@killchain` in the [composer](/studio/interface/composer#mentions) asks the agent to reason about / rebuild the path. It does not open the viewer by itself. Optional: `@killchain:/folder` to narrow where it looks.

> [!TIP]
> Ask the agent to update the chain as you go, then `@killchain` when you want it to reason about the shortest remaining path.
