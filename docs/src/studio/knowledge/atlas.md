# Atlas

Atlas is searchable reference knowledge inside Studio: documentation indexed as a graph the **agent** can browse when it chooses. There is no `@` mention and no `/` command for Atlas. You do not attach Atlas pages yourself; that is what [Briefs](/studio/knowledge/briefs) (`@brief`) are for.

Some base bundled Atlas sources are made available out of the box to all.

## How agents use it

The main agent (and subagents that keep the docs tools) call Atlas on their own when a question looks like it needs reference material (`docs_query`, then read a page). You can also steer them with an explicit ask in the prompt (“check Atlas for ESC8”). That is guidance to the model, not a composer mention.

Open Settings → **Atlas**, then **Open the constellation** to inspect the graph yourself. That view is for you to browse what was indexed; it is not how pages enter a chat.

## Import <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Extra bundled sources and importing your own (repo or docs site) are part of the paid plans. Settings → **Atlas**.

Ingested pages are **data**, not instructions: a page cannot override your [approvals](/studio/behavior/approvals) or tell the agent to ignore scope.

## Cost

Atlas extracts only enter the window when the agent actually reads a node. Nothing accumulates until then.
