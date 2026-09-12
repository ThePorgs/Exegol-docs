# About Exegol

Exegol is a cybersecurity environment designed by offensive security experts, for fellow hackers, with its community.

Have you ever:

- Struggled to keep your distro running smoothly after a few months?
- Wasted hours installing and configuring tools instead of doing actual security work?
- Felt limited by outdated or lacking tools in traditional security distributions?
- Been frustrated and limited by the monolithic design of other solutions?

Those are the problems Exegol is built to remove.

## How the pieces fit

The [wrapper](/wrapper/) creates **containers** from [images](/images/). An image is a template; a container is a running environment built from that template at a given time. You talk to the wrapper. The wrapper talks to Docker.

Every container can mount [offline resources](/resources/) at `/opt/resources`, include your own customizations ([my-resources](/images/my-resources)), and the [history and credentials](/images/exegol-history) helpers that live in the image. The [MCP server](/mcp/) talks to the wrapper so an AI client can orchestrate containers and run tools inside them, without being given the host OS. [Exegol Sentinel](/sentinel/) is an Enterprise add-on that writes a structured audit record of interactive commands onto the host. The [dashboard](/dashboard/) is the account: plan, licenses, organizations, referral, and settings.

## Components

- [**Images**](/images/): pre-built Docker environments with a curated toolkit, specialised by use (`free`, `full`, `ad`, `web`, `light`, `osint`).
- [**Wrapper**](/wrapper/): the CLI that creates and manages those containers, the way a VM manager manages virtual machines.
- [**Offline resources**](/resources/): scripts and binaries you would otherwise re-download on every job (LinPEAS, Sysinternals, and the rest), mounted at `/opt/resources` and updated monthly.
- [**History and credentials**](/images/exegol-history): a dynamic command history and a helper for credentials obtained during an engagement.
- [**MCP server**](/mcp/): lets an AI assistant orchestrate Exegol and run tools in-container.
- [**Sentinel**](/sentinel/) <Badge type="enterprise"/><Badge type="add-on"/>: a structured record of interactive commands, plus optional artifacts, written on the host for a person or a SIEM to read.
- [**Dashboard**](/dashboard/): the account side: plan, licenses, organizations, referral, and settings.

## Tiers <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Community, Pro, Team and Enterprise, including what each plan includes, are on [exegol.com/pricing](https://exegol.com/pricing). Badges on each page mark which tier a feature requires.

Commercial use, seats, and the rest of the legal rules are in the [legal summary](/legal/summary).

[First install](/first-install) is the next page if you are setting up a machine.
