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

- **Docker images**: pre-configured environments with carefully selected tools
- **Python wrapper**: a unified interface to manage all Exegol components easily, similarly to how Virtual Machines would be managed, but in a simple command-line interface.
- **Offline resources**: curated collection of tools that you may need to use on a target machine (e.g., enumeration and exploitation scripts such as LinPEAS, WinPEAS, LinEnum, PrivescCheck, SysinternalsSuite, etc.). They're updated monthly, managed by the wrapper, and shared with every container (at `/opt/resources`).
- **History & credentials**: a utility to manage credentials obtained during an engagement, and a dynamic history of hundreds of commands ready to be used

## Key benefits

- **Time-Saving**: Deploy ready-to-use environments in seconds
- **Reliability**: Tested and maintained by security professionals
- **Flexibility**: Works on top of your host OS. Supports Linux, macOS, and Windows.
- **Customization**: Adapt environments to your specific needs
- **Community-Driven**: Built with and for the security community

## Tiers <Badge type="new"/>

Exegol has a free Community offer, as well as paid tiers: Pro and Enterprise. Check it out at [exegol.com/pricing](https://exegol.com/pricing).
Note the Enterprise tier includes everything from the Pro tier, and more. Wherever the Pro badge <Badge type="pro"/> is present, Enterprise users <Badge type="enterprise"/> may enjoy the feature as well.





