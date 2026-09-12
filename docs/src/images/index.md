# Exegol Images overview

An Exegol image is a pre-built Docker template: a curated toolkit, already installed, versioned together, and started through the [wrapper](/wrapper/). Official images are pulled with `exegol install`. You can also [build a custom image locally](/wrapper/cli/build).

- **What it is:** Docker images specialised by use (`free`, `full`, `ad`, `web`, `light`, `osint`, `nightly`).
- **Why that is better:** you do not maintain a distro or reconcile tool versions yourself.
- **What you get:** a working environment in seconds, the same on every engagement.

[Community](/about#tiers) has the `free` image. Pro, Team and Enterprise have every official image. The [tools list](/images/tools) is generated per image and version.

## Free image (Community)

`free` is the full toolkit, a few versions behind `full`. It is the Community image: learners, non-profits, personal use.

| Image | Description |
| ----- | ----------- |
| `free` | Full toolkit, delayed relative to `full`. Community only. |

Local builds with `exegol build` are useful when you need a cut that is not one of the official names below. See the [build command](/wrapper/cli/build).

## Official images <Badge type="pro" text="Pro" /><Badge type="team" text="Team" /><Badge type="enterprise" text="Enterprise" />

`full` is the current complete toolkit. The others are lighter or specialised cuts of the same base.

| Image | Description |
| ----- | ----------- |
| `full` | Every supported tool. Heaviest, most complete, current. |
| `ad` | Active Directory and internal penetration testing. |
| `web` | Web application security testing. |
| `light` | Essential tools only. For quick assessments or tight disk. |
| `osint` | Open Source Intelligence gathering. |
| `nightly` | Latest updates, for testing. May be unstable. |

## Private Images <Badge type="enterprise"/><Badge type="add-on"/>

For organizations requiring a complete private registry solution, we offer a managed Exegol private registry service. This enterprise solution includes:

- A fully managed private Docker registry for Exegol images
- Custom Exegol images maintained and updated by our team
- Full integration with the Exegol wrapper
- Automatic updates and maintenance of your private images
- Dedicated support and customization options
- The appropriate NDA and IP agreements, to protect your knowledge and content

This service is ideal for organizations that need:
- Complete control over their Exegol image distribution
- Private, organization-specific Exegol images
- Full integration with their existing infrastructure
- Regular updates and maintenance of their private images

Contact us for a quote and to discuss your organization's specific requirements.
