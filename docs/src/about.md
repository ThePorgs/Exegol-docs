# About Exegol

Exegol is a comprehensive cybersecurity environment designed by offensive security experts, for fellow hackers, with its community. It solves the common pain points of traditional security distributions by providing a modular and reliable toolkit that's made for the field.

Have you ever:
- Struggled to keep your distro running smoothly after a few months?
- Wasted hours installing and configuring tools instead of doing actual security work?
- Felt limited by outdated or lacking tools in traditional security distributions?
- Been frustrated and limited by the monolithic design of other solutions?

Exegol addresses these challenges. 

## Core components 

Exegol combines several key components working together:

- [**Docker images**](/images/types): pre-configured environments with carefully selected tools
- [**Python wrapper**](/wrapper/features): a unified interface to manage all Exegol components easily, similarly to how Virtual Machines would be managed, but in a simple command-line interface.
- [**Offline resources**](/resources/list): curated collection of tools that you may need to use on a target machine (e.g., enumeration and exploitation scripts such as LinPEAS, WinPEAS, LinEnum, PrivescCheck, SysinternalsSuite, etc.). They're updated monthly, managed by the wrapper, and shared with every container (at `/opt/resources`).
- [**History & credentials**](/images/exegol-history): a utility to manage credentials obtained during an engagement, and a dynamic history of hundreds of commands ready to be used
- [**MCP server**](/mcp/features): a server component enabling AI assistants and agents to interact with Exegol environments, for orchestration or in-container execution purposes


## Key benefits

- **Time-saving**: deploy ready-to-use environments in seconds
- **Reliability**: tested and maintained by security professionals
- **Flexibility**: works on top of your host OS. Supports Linux, macOS, and Windows.
- **Customization**: adapt environments to your specific needs
- **Community-driven**: built with and for the security community

## Tiers

Exegol has a free Community offer, as well as paid tiers: Pro and Enterprise. Check it out at [exegol.com/pricing](https://exegol.com/pricing).
Note the Enterprise tier includes everything from the Pro tier, and more. Wherever the Pro badge <Badge type="pro"/> is present, Enterprise users <Badge type="enterprise"/> may enjoy the feature as well.





