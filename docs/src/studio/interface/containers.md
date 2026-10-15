# Workstation

Agents run tools inside Exegol containers. Settings → **Workstation** lists the images and the containers on this machine. Create, start, stop, desktop, VPN, and network options can be set there or with the [wrapper CLI](/wrapper/).

The create form starts from `~/.exegol/config.yml` (shell, permissions, desktop, network, logging) and marks what came from it. The container gets what the form shows.

A [project](/studio/interface/projects) links the containers it uses. The first one stores sessions. The container a session **runs** in is chosen on [Sessions](/studio/interface/sessions), and can differ once the project has more than one.

An MCP server set to run in the container uses the project's first container, not the session's attached container. See [MCPs](/studio/knowledge/mcp).

## Terminals

Open an interactive shell in a project container from the launch menu in the Studio header, or from the **bottom panel** terminal. Same filesystem and tunnel as the agent.

**Show active window**, on the composer (scan icon before the paperclip), brings forward the open GUI windows of the container the session runs in. It is a reveal, not a picker: the button is hidden until something is open. To open a new shell or desktop, or to pick one window from a list, use **Active windows** in the launch menu. See [Show active window](/studio/interface/composer#show-active-window).
