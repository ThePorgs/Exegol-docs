# `install` action

This action can be used to install an Exegol image. At least one Exegol
image is required to create and start a container and enjoy Exegol.

When this action is used, the image will be downloaded (i.e. "pulled" in Docker terms) from [the official
Dockerhub registry](https://hub.docker.com/repository/docker/nwodtuhs/exegol).
A compressed and pre-built image is downloaded in the form of layers, and then uncompressed.

> [!NOTE]
> Enterprise users can configure custom registries in their Exegol configuration file (`~/.exegol/config.yml`). When custom registries are configured, Exegol will also search for images in those registries. See [Enterprise Features](/wrapper/features#enterprise-features) for more details.

## Options

| Option | Description |
|--------|-------------|
| `IMAGE` | Optional positional argument to indicate the image to install. |

## Command examples

```bash
# Install interactively an exegol image
exegol install

# Install or update the full image
exegol install full
```
