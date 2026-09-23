# Getting started with Exegol Studio <Badge type="new"/>

If not already, install [Exegol Workstation](/workstation/install) first.

> [!NOTE] Do I need to change how I use Exegol?
> No. Studio attaches to the containers you already start with `exegol start`. It installs no tools in the image and changes no wrapper configuration. Uninstall the extension and your containers are unchanged.

## 1. Install the extension

| Editor | How |
| ------ | --- |
| VS Code | Extensions → search **Exegol Studio** → Install |
| Compatible forks | Same Marketplace listing when available |

Open the **Exegol Studio** activity bar icon after install. If nothing appears, reload the window (`Developer: Reload Window`).

## 2. System checks

Open Settings (in the Primary Side Bar on the left, Cog icon) → **System check**. Run it. It probes Docker (CLI and daemon), the Exegol CLI, whether an image and container exist, and whether the project's primary container is running. On Linux it also checks your user can reach the Docker socket (usually the `docker` group). If any checks fail, follow the instructions to fix them (i.e. adding your user to the `docker` group).

![](/assets/studio/systemcheck.png)

## 3. Connect a model provider

Open the cockpit (**Exegol Studio** icon). Open **Settings**, then **Providers**. Add an API key for a cloud provider, or sign in with a subscription where that is offered.

You can use a model provider from the cloud, or self-host your own model provider. See [Providers and models](/studio/providers-models) for more details.

## 4. Create a project and pick a container

A [project](/studio/interface/projects) is one engagement. It scopes sessions, the container, and project-local policy.

Create one from Settings → projects (**New project**), then link a running Exegol container, or create one.

## What next

- Learn to use the [Composer](/studio/interface/composer): attachments, MCP button, context gauge, quick settings
- Choose your layout: [Layouts](/studio/interface/layouts#the-three-layouts) (Monitor, Editor, Chat), [Rooms](/studio/interface/rooms)
- Use [Rooms](/studio/interface/rooms) to have multiple parallel sessions in the same engagement
- Adapt the Knowledge: [skills](/studio/knowledge/skills), [rules](/studio/knowledge/rules), [agents](/studio/knowledge/agents), [hooks](/studio/knowledge/hooks), [briefs](/studio/knowledge/briefs), [MCPs](/studio/knowledge/mcp), [Atlas](/studio/knowledge/atlas)

> [!DANGER] Before you point this at a client
> Prompts, file contents, and command output go to your model provider. Confirm retention terms match the engagement, or use a [self-hosted provider](/studio/providers-models#self-hosted-providers)
