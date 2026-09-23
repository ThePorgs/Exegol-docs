# Start now

Exegol is a suite. The [Workstation](/workstation/) is the lab: Docker images, the wrapper CLI, and containers. [Studio](/studio/), [MCP](/mcp/), and [Sentinel](/sentinel/) plug into it. You do not need the whole suite on day one. Start with Workstation.

## Recommended path

1. **Install Workstation** so you have Docker, the wrapper, an image, and a running container.  
   → [Install Exegol Workstation](/workstation/install)
2. **Optionally add Studio**, the hacking cockpit in VS Code and compatible forks.  
   → [Studio getting started](/studio/getting-started)

Workstation alone is enough for a shell with `exegol start`. Studio is optional.

## What each product gives you

- [Workstation](/workstation/): a modern offensive environment: curated tools, one container per engagement, throw it away when done.
- [Studio](/studio/) <Badge type="new"/>: an editor cockpit integrating AI the right way: harness, MCPs, chat, approvals, projects, kill chain, and agent-driven tools inside your containers (VS Code and compatible forks). Optional.
- [MCP](/mcp/): Exegol containers reachable from an assistant you already use (Cursor, Claude Desktop, ...), without handing that assistant your host OS. Optional.
- [Sentinel](/sentinel/) <Badge type="enterprise"/><Badge type="add-on"/>: a structured audit trail of interactive commands (and optional artifacts) written on the host for review or a SIEM. Enterprise add-on.