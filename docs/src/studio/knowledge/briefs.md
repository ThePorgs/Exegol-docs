# Briefs

A **brief** is a document you attach so the model reads it **in full** as extra context. You pick what goes in. The model does not search briefs on its own.

Briefs live under Settings → **Harness**, with the rest of the Studio harness. Studio stores them on the host under `~/.exegol-studio/briefs/`. Attach with `@brief:…` in the composer. Contrast with [Atlas](/studio/knowledge/atlas), which indexes large corpora the model may search.

Some briefs are made available out of the box to all.

| | **Briefs** | [Atlas](/studio/knowledge/atlas) |
| --- | --- | --- |
| What it is | Full documents you attach | Indexed, graphed documentation |
| Who picks the page | You (`@brief`) | The model may search when useful |
| Context cost | Stays in the window every turn while attached | Only extracts that were read |
| Best for | Short, specific pages you want verbatim | Large corpora, links between techniques |

## Adding briefs <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

The paid plans allow you to ingest briefs of your own.

Settings → **Harness** → **Briefs**

| Control | What it does |
| ------- | ------------ |
| **Add a doc** | Paste a docs site URL (`https://docs.example.com/`) or a GitHub `owner/repo`. Studio parses it; each file becomes one brief |
| **List** | Browse ingested sources, open pages, refresh or remove them |

Attach a brief from the composer with `@brief`. The picker shows what each brief costs before you attach it.

## Cost

An attached brief is paid for on every message until the session ends. Prefer small, specific briefs over dumping a whole wiki into the window.

## Trust

Ingested pages are **data**, not instructions. A page cannot override your [approvals](/studio/behavior/approvals) or tell the agent to ignore scope.
