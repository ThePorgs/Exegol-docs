# Exegol images

Exegol offers several specialized Docker images, each tailored for different security testing and research purposes.

- Official Exegol images are pre-built and available for immediate use through `exegol install`.
- Users can also build their own custom images if needed
- Each image is optimized for its specific use case while maintaining a consistent base environment
- The images are regularly updated with the latest tool versions and security patches
- Pro and Enterprise users have access to all images, while Community users are limited to the Free image


## Free image

Equivalent to the Full image but a few versions behind. Contains all tools supported by Exegol, making it perfect for getting started with the platform
| Image Name | Description |
|------------|-------------|
| `free` | The most comprehensive image. Best for non-profits, students, learners. |

Users can also build their own Exegol images locally using the `exegol build` command. For more information about building local images, see the [build documentation](../wrapper/cli/build.md). That's especially interesting to build specific images like the ones described below.

## Advanced images <Badge type="pro" text="Pro" /><Badge type="enterprise" text="Enterprise" />

| Image Name | Description |
|------------|-------------|
| `full` | The most comprehensive image that includes all tools supported by Exegol. This is the heaviest image but provides the most complete toolkit for security professionals. |
| `ad` | Specialized image focused on Active Directory and internal penetration testing tools. Perfect for red teaming and internal security assessments. |
| `web` | Dedicated to web application security testing, containing tools specifically designed for web penetration testing and vulnerability assessment. |
| `light` | A streamlined version containing only the most essential and commonly used tools across various security domains. Ideal for quick assessments or when resources are limited. |
| `osint` | This image focuses on Open Source Intelligence gathering tools, helping security professionals collect and analyze publicly available information. |
| `nightly` | A development version that contains the latest updates and features. This image is intended for advanced users and developers who want to test cutting-edge features. Note that this version may be unstable. |

## Private Images <Badge type="enterprise"/>

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
