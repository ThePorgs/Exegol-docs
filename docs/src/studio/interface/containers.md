# Workstation

Agents run tools inside Exegol containers. Settings → **Workstation** lists the images and the containers on this machine. Create, start, stop, desktop, VPN, and network options can be set there or with the [wrapper CLI](/wrapper/).

The create form starts from `~/.exegol/config.yml` (shell, permissions, desktop, network, logging) and marks what came from it. The container gets what the form shows.

A [project](/studio/interface/projects) links the containers it uses. The first one stores sessions. The container a session **runs** in is chosen on [Sessions](/studio/interface/sessions), and can differ once the project has more than one.

An MCP server set to run in the container uses the project's first container, not the session's attached container. See [MCPs](/studio/knowledge/mcp).

## Terminals

Open an interactive shell in a project container from the launch menu in the Studio header, or from the **bottom panel** terminal. Same filesystem and tunnel as the agent.

When the project has more than one container, shell, desktop, and tool tabs show a **corner colour swatch** on the icon for that container. The same colour appears in the launch menu. With one container, icons stay plain. See [Editors and tabs](/studio/interface/editors).

**Active windows** in the launch menu lists the open shells, desktop, and tool tabs for a container, and brings the one you pick forward. Use it to open a new shell or desktop too.
