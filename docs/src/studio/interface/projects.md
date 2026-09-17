# Projects

A project is one engagement. It holds the containers you work in and everything produced along the way: sessions, kill chains, project rules, skills, hooks. One project is active at a time; switching swaps the whole cockpit.

Community users can create up to **2** projects and **3** sessions per project. 

Pro and above are unlimited <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

> [!WARNING] Screenshot to add: `projects_host-paths`
> Project settings with host paths / linked folders, and a file being dropped or attached into chat.

| Feature | Description |
| ------- | ----------- |
| What a project scopes | Sessions, [kill chains](/studio/behavior/kill-chains), project [rules](/studio/knowledge/rules), [skills](/studio/knowledge/skills), [hooks](/studio/knowledge/hooks), ... |
| [Containers](#containers) | Primary container and associated list |
| [Host paths and files](#host-paths-and-files) | Workspace, linked folders, drag and drop. Index on host, engagement data in the container |

## Containers

A project holds an ordered list of Exegol containers. The **first is primary**: it stores project data and is where a run acts. You can associate others and change which is primary without rebuilding the project. Lifecycle (create, start, stop) still belongs to the [wrapper](/studio/interface/containers).

Create a project from Settings (**New project**), then **link** a running container.

## Host paths and files

Exegol usually bind-mounts `/workspace` to a folder on the host. Studio shows that folder in the Explorer.

**Link a folder** attaches a folder of your own (report drafts, client docs) to the Explorer.

**Drag and drop** files between containers and the host.

Project index (name, id, container list) under `~/.exegol-studio/` on the host.

Client findings and command history stay in the container.

See [wrapper workspace](/wrapper/#workspace).
