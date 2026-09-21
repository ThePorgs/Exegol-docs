# MCPs

MCP plugs external tool providers into a run. The agent sees their tools next to its built-in ones and calls them the same way.

Settings → **MCP**. Community can register **3** servers per machine; Pro and above are unlimited <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>.

## Where it runs

When you add a server, the first choice is **where the process runs**, not a transport jargon name:

| Where | What happens |
| ----- | ------------ |
| **In the container** | Command runs through `docker exec` in the project's primary container. Tools see the engagement filesystem and network. |
| **On this machine** | stdio process on your **host**, outside the container boundary. |
| **Remote (URL)** | HTTP / SSE endpoint at a URL you provide. |

Configs copied from common MCP docs import cleanly. Prefer container-scoped servers when the tools should share the engagement environment. Prefer host stdio only when the binary must live on the laptop.

## Per-tool approval

A server can expose a read-only lookup next to a destructive action. Auto-approve is **per tool**, not per server. Everything still sits behind Studio's [approval](/studio/behavior/approvals) gate; a deny rule still wins.

## OAuth

Servers that need you to sign in are supported; tokens land in SecretStorage. That is separate from [provider subscription login](/studio/providers-models#subscription-login).

## Toggling per run

The [composer MCP button](/studio/interface/composer#mcp) turns servers on or off for the current run without editing the catalogue.

## Where the config lives

On your machine, with operator settings. It never comes from the model, the target, or a file the agent wrote. An agent that could register its own MCP server could grant itself new reach.

> [!DANGER] Third-party code with your reach
> A host stdio server is a binary you spawn on the laptop, outside the container boundary everything else respects. A remote server sees the arguments the agent sends, which on an engagement can include target data. Only connect servers you would run yourself.

## Exegol's own MCP server

[Exegol MCP](/mcp/) exposes Workstation to an external assistant. You do not need it inside Studio: Studio already drives containers directly. Use Exegol MCP when that assistant lives elsewhere.
