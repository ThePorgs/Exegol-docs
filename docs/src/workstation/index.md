# Exegol Workstation overview

Exegol Workstation is the offensive lab in Docker: a clean box per engagement, on the OS you already use. It is **not** another Linux distro. It is a maintained environment that [Studio](/studio/), [MCP](/mcp/), and [Sentinel](/sentinel/) plug into.

- **What it is:** curated [images](/images/), a [wrapper](/wrapper/) that turns them into containers, and offline [resources](/resources/) shared into every box.
- **Why that is better:** you stop babysitting a distro. Start a container for the job, throw it away when done.
- **What you get:** tools already in, tunnel in the box, workspace on the host, then optional Studio, MCP, or Sentinel on the same workstation.

Community covers personal use, learning, and CTFs. Commercial or employer-sponsored work needs a paid plan. See [pricing](https://exegol.com/pricing) and the [legal overview](/legal/).

[Install](/workstation/install) is the next page if you are setting up a machine.

## Not another distro

Kali, ParrotSec, BlackArch and similar tools are **distributions**: a whole OS plus a toolbox you still set up and keep alive. Exegol Workstation is the opposite model.

| Distro approach | Workstation approach |
| --------------- | -------------------- |
| Install or virtualize a full OS | Stay on the OS you already run |
| Maintain tools and dependencies yourself | Pull a versioned [image](/images/) |
| The environment ages with the machine | One [container](#images-and-containers) per engagement, then discard it |

Internal labs, USB, and Wi-Fi work best on Linux. Windows and macOS run through Docker (on Mac, [OrbStack](https://orbstack.dev/) over Docker Desktop). Treat them as fine for web/OSINT and more constrained for full internal labs. See [Install](/workstation/install).

## How the pieces fit

You talk to the [wrapper](/wrapper/). The wrapper talks to Docker.

1. An **image** is an immutable template (the toolkit at a given version).
2. A **container** is a running environment created from that image at a moment in time.
3. Updating the image does **not** change containers already created from an older one. A new container is required to pick up the update.

Every container can mount [offline resources](/resources/) at `/opt/resources`, your [my-resources](/images/my-resources) customisations, and the [history and credentials](/images/exegol-history) helpers that ship in the image.

## Components

| Component | Role |
| --------- | ---- |
| [Images](#images) | Pre-built Docker templates specialised by use |
| [Wrapper](#wrapper) | CLI that creates and manages containers |
| [Resources](#resources) | Offline scripts and binaries mounted into containers |
| [In the image](#in-the-image) | History, credentials, services, and your my-resources layer |
| [Help](#help) | FAQ, troubleshooting, tips |

### Images

An [Exegol image](/images/) is a pre-built Docker template: tools installed, versioned together, started through the wrapper.

- Community: the [`free`](/images/#free-image-community) image (full toolkit, delayed relative to `full`).
- Pro / Team / Enterprise: [`full`](/images/#official-images), `ad`, `web`, `light`, `osint`, `nightly`, and optional [private images](/images/#private-images).

The [tools list](/images/tools) is generated per image and version. Local builds use [`exegol build`](/wrapper/cli/build).

### Wrapper

The [wrapper](/wrapper/) is the command-line interface. It creates and manages containers the way a VM manager manages VMs: start, stop, update, desktop, VPN, workspace.

You do not write `docker run` flags for the setups Exegol already knows. Features include [desktop](/wrapper/#desktop), [X11](/wrapper/#x11-sharing-gui), [VPN](/wrapper/#openvpn-connection), [shell logging](/wrapper/#shell-logging), [network modes](/wrapper/#network-modes), and [container profiles](/wrapper/profiles/) <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>.

| Page | What it covers |
| ---- | -------------- |
| [Wrapper overview](/wrapper/) | Features and how containers are shaped |
| [Command-line](/wrapper/cli/start) | Per-action reference (`start`, `info`, `update`, …) |
| [User config](/wrapper/configuration) | Persistent defaults in `~/.exegol/config.yml` |
| [Container profiles](/wrapper/profiles/) | Named container-shape defaults applied at creation |

### Resources

[Exegol resources](/resources/) are offline scripts and binaries (LinPEAS, Sysinternals, and the rest) that would otherwise be re-downloaded every engagement. The wrapper manages them and shares them with containers by default at `/opt/resources`.

### In the image

These live **inside** the image (or your host-side customisation volume), not as separate Workstation products:

| Piece | What it is |
| ----- | ---------- |
| [My resources](/images/my-resources) | Host volume for your tools and setup scripts, applied at container creation |
| [Exegol history](/images/exegol-history) | Credential/host store (`exh`) wired into the pre-filled command history |
| [Credentials](/images/credentials) | Helpers for credentials obtained during an engagement |
| [Services](/images/services) | Services that ship with the image |

### Help

Workstation-specific Q&A and fixes:

| Page | When to use it |
| ---- | -------------- |
| [FAQ](/workstation/faq) | “Can I…?” short answers |
| [Troubleshooting](/workstation/troubleshooting) | Symptom → fix |
| [Tips & tricks](/workstation/tips-and-tricks) | Shortcuts inside a running container |

## What plugs into Workstation

Workstation is the hub. The other products sit on the same lab:

- [**Studio**](/studio/) <Badge type="new"/>: the hacker's IDE. Hacking cockpit for VS Code and compatible forks that drives your Exegol containers.
- [**Sentinel**](/sentinel/) <Badge type="enterprise"/><Badge type="add-on"/>: structured command audit on the host for a person or a SIEM.
- [**MCP**](/mcp/): let an LLM use Exegol without living on the host.
- [**Dashboard**](/dashboard/): account, plan, licenses, organizations.

## Images and containers

> [!TIP]
> - **Image:** immutable template. You cannot open a shell in an image.
> - **Container:** running environment created from an image at a given time. Updating the image does not change existing containers.

Typical flow after [Install](/workstation/install):

```bash
exegol install full
exegol start eng-acme full
```
