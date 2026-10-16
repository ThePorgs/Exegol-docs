# Projects

A project is one engagement. It holds the containers you work in and everything produced along the way: sessions, kill chains, project rules, skills, hooks. One project is active at a time; switching swaps the whole cockpit.

Community users can create up to **2** projects and **3** sessions per project. 

Pro and above are unlimited <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

| Feature | Description |
| ------- | ----------- |
| What a project scopes | Sessions, [kill chains](/studio/behavior/kill-chains), project [rules](/studio/knowledge/rules), [skills](/studio/knowledge/skills), [hooks](/studio/knowledge/hooks), ... |
| [Containers](#containers) | Storage container, attached container, and the rest of the list |
| [Host paths and files](#host-paths-and-files) | Workspace, linked folders, drag and drop. Index on host, engagement data in the container |

## Containers

A project holds an ordered list of Exegol containers. The **first** stores the project's sessions. A run acts in the container that session is attached to. With one container those are the same box. With several, where a new session runs is **Attached container** on [Sessions](/studio/interface/sessions). You can reorder the list and change which is first without rebuilding the project. Reordering does not move a session that already exists.

Create a project from Settings → **Projects** (**New project**), then **link** a running container. Create, start, and stop from [Workstation](/studio/interface/containers), or from the [wrapper CLI](/wrapper/).

## Host paths and files

Exegol usually bind-mounts `/workspace` to a folder on the host.

The Explorer shows **one root per container**, named after the container, with that container's folders nested under it. `/workspace` is there. Add more from the project page (**Container folders**) or from the Explorer (**Add container folder**).

A badge on each root says where it lives: **C** for a container root, **H** for a host folder (the pinned Exegol folder, a folder you linked, or `/workspace` opened as a host folder). The tooltip names the container. Folders you opened yourself carry no badge.

**Search in Container** searches a container folder with `rg` inside that container. Find in Files does not cover those roots.

**Link a folder** attaches a folder of your own (report drafts, client docs) to the Explorer.

**Drag and drop** files between containers and the host. A move between a folder served from the host and one served through `docker exec` is refused. Copy that item instead.

Project index (name, id, container list) under `~/.exegol-studio/` on the host.

Client findings and command history stay in the container.

See [wrapper workspace](/wrapper/#workspace).
