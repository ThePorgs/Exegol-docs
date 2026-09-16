# About Exegol

Exegol is a cybersecurity environment designed by offensive security experts, for fellow hackers, with its community.

Have you ever:

- Struggled to keep your distro running smoothly after a few months?
- Wasted hours installing and configuring tools instead of doing actual security work?
- Felt limited by outdated or lacking tools in traditional security distributions?
- Been frustrated and limited by the monolithic design of other solutions?

Those are the problems Exegol is built to remove.

## Products

Exegol is a suite. The [Workstation](/workstation/) is the lab the others plug into.

- [**Exegol Workstation**](/workstation/): the Docker lab. The [wrapper](/wrapper/) creates **containers** from [images](/images/). An image is a template; a container is a running environment built from that template. Offline [resources](/resources/) mount at `/opt/resources`. [History and credentials](/images/exegol-history) live in the image; [my-resources](/images/my-resources) is your own customisation layer.
- [**Exegol Studio**](/studio/) <Badge type="new"/>: Private access to Enterprise customers open. Public release coming soon.
- [**Exegol Sentinel**](/sentinel/) <Badge type="enterprise"/><Badge type="add-on"/>: a structured record of interactive commands, plus optional artifacts, written on the host for a person or a SIEM to read.
- [**Exegol MCP**](/mcp/): a server that lets an AI client orchestrate containers and run tools inside them, without being given the host OS.
- [**Dashboard**](/dashboard/): the account: plan, licenses, organizations, referral, and settings.

## Tiers <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Community, Pro, Team and Enterprise, including what each plan includes, are on [exegol.com/pricing](https://exegol.com/pricing). Badges on each page mark which tier a feature requires.

Commercial use, seats, and the rest of the legal rules are in the [legal overview](/legal/).

[First install](/first-install) is the next page if you are setting up a machine.
