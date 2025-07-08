# `info` action

The `info` action aims at displaying all the information specific to the
Exegol project on the current system. This action can also be used by
targeting a specific container to display its configuration in detail.

Depending on the verbosity level specified in the command-line, the
information displayed will be more or less detailed accordingly.

:::tabs

== Standard (default)

 ``` bash
exegol info
```

- List of available Exegol Images
    - Name of the image
    - Size of each image (disk space if the image is installed, otherwise its compressed size to download for installation)
    - Status of each image
        - Not installed (Image available for download from dockerhub)
        - Up to date (The latest version of the image is installed and ready to be used)
        - Update available (A new version is available for download on dockerhub)
        - Outdated (Old version of an image that has been updated since)
        - Local image (Locally built image)
        - Discontinued (if your image is no longer available on dockerhub)
- List of Exegol Containers
    - Name of each container
    - Container status (Stopped or running)
    - Image name (Exegol image used as a base to create the container)
    - Configurations (Display of non-default configurations)

== Verbose

``` bash
exegol info -v
```

In the verbose mode, the following additional elements are displayed.
Everything from the lower verbosity level is still displayed.

- Enumerate every user configuration (see details [here](/wrapper/features#exegol-configuration))
- In the list of available Exegol Images
    - Image ID
    - Build date
    - Image architecture (AMD64 / ARM64)
- In the list of Exegol Containers
    - Container id
    - Full configuration
    - List of non-technical volumes
    - List of Devices
    - List of Ports (Applicable if network sharing with host is not enabled)
    - List of custom environment variables

== Advanced

``` bash
exegol info -vv
```
In the advanced mode, the following additional elements are displayed.
Everything from the lower verbosity levels is still displayed.

- Enumerate the settings from the user configuration at
 `~/.exegol/config.yml` (see details [here](/wrapper/features#exegol-configuration))
- List the different exegol modules
    - Modules name
    - Their update status
    - Their git branch (if applicable)

== Debug

``` bash
exegol info -vvv
```

In the debug mode, everything from the lower verbosity levels is still
displayed, as well as logs from internal methods and functions. Those
logs can be useful for maintainers and developers in case of bug, or
for making sure everything works properly.

:::

## Options

The info action does not have many parameters, its use is relatively
simple. This action can either be used to gather general information
(available images, containers, user configs, etc.), or gather
information about a specific container and display its configuration.

| Option | Description |
|----|----|
| `CONTAINER` | Optional positional argument to indicate the container tag of which to display the configuration. |

Global options can still be used, like for any action.

| Option | Description |
|----|----|
| `-h`, `--help` | Show the help message of any action |
| `-v`, `--verbose` | Verbosity level (-v for verbose, -vv for advanced, -vvv for debug) |
| `-q`, `--quiet` | Show no information at all |
| `--offline` | Run exegol in offline mode, no request will be made on internet (default: Disable) |
| `--arch {arm64,amd64}` | Overwrite default image architecture (default: host's arch) |

## Command examples

``` bash
# Print containers and images essentials information:
exegol info

# Print the detailed configuration of the "demo" container:
exegol info demo

# Print verbose information:
exegol info -v

# Print advanced information:
exegol info -vv

# Print debug information:
exegol info -vvv
```
