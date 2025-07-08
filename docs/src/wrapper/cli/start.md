# `start` action

This action can be used to start a container. At least one Exegol image
is required to create and start a container and enjoy Exegol. Installing
an image can be done with `exegol install` documentation
[here](/wrapper/cli/install).

When this action is used, the following process is applied:

- if no Exegol image is installed, the user is asked to specify which
  one to install of build, and the process continues
- then, if the container to start doesn't already exist, it is created
  based on an Exegol image and a few settings to specify, and the
  process continues
- then, the container is started and a shell is opened

## Options

A single option exist to target an Exegol container. If this container
exists, it will be started if it is not already the case and a shell
will be spawned to offer an interactive console to the user

| Option      | Description                            |
|-------------|----------------------------------------|
| `CONTAINER` | Tag used to target an Exegol container |

Many options exist to customize the creation of exegol container.

> [!TIP]
> The default options of some commands can be changed in
> the [exegol configuration file](/wrapper/features#exegol-configuration).

### Global options

| Option                                            | Description                                                                                                                                                                                                                          |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `IMAGE`                                           | Tag of the exegol image to use to create a new exegol container                                                                                                                                                                      |
| `-w WORKSPACE_PATH`, `--workspace WORKSPACE_PATH` | The specified host folder will be linked to the /workspace folder in the container.                                                                                                                                                  |
| `-cwd`, `--cwd-mount`                             | This option is a shortcut to set the /workspace folder to the user's current working directory (pwd).                                                                                                                                |
| `-fs`, `--update-fs`                              | Modifies the permissions of folders and sub-folders shared in your workspace to access the files created within the container using your host user account. (default: Disabled)                                                      |
| `-V VOLUMES`, `--volume VOLUMES`                  | Share a new volume between host and exegol (format: --volume /path/on/host/:/path/in/container/\[:ro\|rw\]).                                                                                                                         |
| `-p PORTS`, `--port PORTS`                        | Share a network port between host and exegol (format: `--port [<host_ipv4>:]<host_port>[-<end_host_port>][:<container_port>[-<end_container_port>]][:<protocol>]`. This configuration will disable the shared network with the host. |
| `--hostname HOSTNAME`                             | Set a custom hostname to the exegol container (default: exegol-\<name\>)                                                                                                                                                             |
| `--cap CAPABILITIES`                              | **(dangerous)** Capabilities allow to add specific privileges to the container (e.g. need to mount volumes, perform low-level operations on the network, etc).                                                                       |
| `--privileged`                                    | **(dangerous)** give extended privileges at the container creation (e.g. needed to mount things, to use wifi or bluetooth)                                                                                                           |
| `-d DEVICES`, `--device DEVICES`                  | Add host device(s) at the container creation (example: -d /dev/ttyACM0 -d /dev/bus/usb/).                                                                                                                                            |
| `--disable-X11`                                   | Disable X11 sharing to run GUI-based applications. (default: Enabled)                                                                                                                                                                |
| `--disable-my-resources`                          | Disable the mount of the shared resources (/opt/my-resources) from the host (/home/dramelac/.exegol/my-resources) (default: Enabled)                                                                                                 |
| `--disable-exegol-resources`                      | Disable the mount of the exegol resources (/opt/resources) from the host (/home/dramelac/Documents/tools/Exegol/exegol-resources) (default: Enabled)                                                                                 |
| `--network NETWORK`                               | <Badge type="new"/> Configure the container's network mode (default: host). See [Network Modes](#network-modes) for details.                                                                                                         |
| `--disable-shared-timezones`                      | Disable the sharing of the host's time and timezone configuration with exegol (default: Enabled)                                                                                                                                     |

### Network modes <Badge type="new"/>

Exegol supports different network modes to suit various use cases:

| Mode             | Description                                                                                                                                                                                                                                                              | Use Case                                                                                                                                                                                                                           |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `host` (default) | Container shares the host's network interfaces (IP and MAC addresses of every interface of your host).                                                                                                                                                                   | - When you need to use the host's network interfaces directly<br>- For low-level network operations<br>- When you need to share the host's IP and MAC address                                                                      |
| `docker`         | Container uses Docker's default bridge network. All containers (not just Exegol) share this network and can communicate with each other.                                                                                                                                 | - When you need basic network isolation<br>- When you want to publish specific ports<br>- For most standard use cases<br>- When you want to allow communication between containers                                                 |
| `nat`            | <Badge type="pro"/> Creates a dedicated isolated network for the container with its own subnet. Each container gets a unique network namespace with a /28 subnet (16 IP addresses), providing complete isolation from other containers. Requires Pro/Enterprise license. | - When you need complete network isolation<br>- For sensitive operations requiring dedicated network resources<br>- When you need to control all network traffic<br>- When you want automatic network cleanup on container removal |
| `disable`        | Disables all network connectivity for the container.                                                                                                                                                                                                                     | - When you need maximum isolation<br>- For offline operations<br>- When network access is not required                                                                                                                             |

> [!CAUTION]
> OrbStack currently has a known limitation where containers connected to different user-defined **networks can
communicate with each other**, bypassing expected network isolation obtained with the `nat` option. See the issue for
> more information [orbstack/orbstack#1944](https://github.com/orbstack/orbstack/issues/1944), as of 21/05/2025, it's
> considered as intended and "won't fix".

There are some limitations and considerations that users should be aware of:

:::tabs

=== Host Mode Limitations

- **Port Publishing**: When using host mode, the `--port` option is not possible, and unnecessary since the container
  already has direct access to all host network interfaces and ports. Any service running in the container will be
  automatically accessible on the host's network.
- **Docker Desktop**: On Windows and macOS systems using Docker Desktop, host mode has reduced functionality:
    - Limited access to host network interfaces
    - Potential performance impact
    - May not work as expected with certain network tools

=== Docker vs NAT Mode

- **Network Creation**:
    - Docker mode uses Docker's default bridge network where all containers share the same network space
    - NAT mode creates a dedicated network for each container with:
        - A unique /28 subnet (16 IP addresses) within the configured range
        - Complete isolation from other containers
        - Automatic network cleanup
- **Isolation Level**:
    - Docker mode provides basic network isolation but allows container-to-container communication
    - NAT mode offers complete network isolation with dedicated resources
- **Resource Management**:
    - Docker mode shares network resources with all containers on the system
    - NAT mode allocates dedicated network resources per container
- **License Requirements**:
    - Docker mode is available in all versions
    - NAT mode requires Pro/Enterprise license

=== General Considerations

- **Container creation**: Network mode is a fundamental container setting that can only be set at creation time. This
  means:
    - You cannot change the network mode of an existing container
    - To use a different network mode, you must create a new container
    - Any custom configurations will need to be reapplied to the new container
    - The container's state will be reset
    - You'll need to ensure all necessary data is backed up before making the change
- **Performance Impact**: Different network modes can affect performance:
    - Host mode typically offers the best performance but least isolation
    - Docker mode provides a good balance of performance and isolation
    - NAT mode offers maximum isolation but may have higher overhead

:::

The network behavior can be configured in your Exegol configuration file (`~/.exegol/config.yml`). See
the [network configuration section](/wrapper/configuration#network) in the configuration documentation for details about
network settings.

### Graphical desktop

As an alternative to X11 sharing, Exegol provides a complete graphical desktop environment within the container. This
environment can be accessed through multiple protocols, with a web-based interface being the default method. This gives
users a full-featured desktop experience directly from their browser.

| Option             | Description                                                                                                                          |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `--desktop`        | Enable or disable the Exegol desktop feature (default: Disabled)                                                                     |
| `--desktop-config` | Configure the desktop protocol (vnc/http) and network settings (format: `protocol[:ip[:port]]`) (default: `http:127.0.0.1:<random>`) |

### VPN

An additional feature of Exegol is the VPN tunnel option (OpenVPN). Just provide an ovpn configuration to exegol and the
container will take care of starting the tunnel at each startup.

> [!INFO]
> When using the `--vpn` feature, network mode defaults to `docker`, or `nat` if the user has a
> valid <Badge type="pro" /> or <Badge type="enterprise" /> subscription. This isolates the container. The VPN connection
> is not opened directly on the host's network interface. It protects the host.

| Option                | Description                                                                                                                                                                   |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--vpn VPN`           | Setup an OpenVPN connection at the container creation (example: `--vpn /home/user/vpn/conf.ovpn`)                                                                             |
| `--vpn-auth VPN_AUTH` | Enter the credentials with a file (first line: username, second line: password) to establish the VPN connection automatically (example: `--vpn-auth /home/user/vpn/auth.txt`) |

> [!IMPORTANT]
> All the options seen previously are taken into account **only** for
> the creation of a **new container**. It is **not possible** to modify
> the configuration of an existing container. These options will be
> **ignored** if a container with the same name already exists.

### Shell logging

One of the functions of exegol very useful in a professional context is the shell logging. This feature allows the user
to record **everything** that happens in the exegol container (commands typed and responses).

| Option           | Description                                                                                           |
|------------------|-------------------------------------------------------------------------------------------------------|
| `-l`, `--log`    | Enable shell logging (commands and outputs) on exegol to /workspace/logs/ (default: Disabled)         |
| `--log-method`   | Select a shell logging method used to record the session (default: `asciinema`)                       |
| `--log-compress` | Enable or disable the automatic compression of log files at the end of the session (default: Enabled) |

> [!TIP]
> When the `-l`/`--log` option is enabled during the **creation** of a
> **new** container, all future shells will be **automatically logged**
> for this container.

### Session specific

The options specific to the start of the interactive session.

| Option                      | Description                                                                                                                                                                                                                                               |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-e ENVS`, `--env ENVS`     | And an environment variable on Exegol (format: --env KEY=value). The variables configured during the creation of the container will be persistent in all shells. If the container already exists, the variable will be present only in the current shell. |
| `-s SHELL`, `--shell SHELL` | Select a shell environment to launch at startup (default: zsh)                                                                                                                                                                                            |

> [!info]
> The environment variables configured with `--env ENVS` during the
> **creation** of a **new** container will be available to **all**
> processes of the container during the **entire life cycle** of the
> container.

## Command examples

``` bash
# Start interactively a container
exegol start

# Create a demo container using full image
exegol start demo full

# Spawn a shell from demo container
exegol start demo

# Create a container test with a custom shared workspace
exegol start test full -w "./project/pentest/"

# Create a container test sharing the current working directory
exegol start test full -cwd

# Create a container htb with a VPN
exegol start htb full --vpn "~/vpn/lab_Dramelac.ovpn"

# Create a container app with custom volume
exegol start app full -V "/var/app/:/app/"

# Get a shell based on tmux
exegol start --shell tmux

# Share a specific hardware device (like Proxmark)
exegol start -d "/dev/ttyACM0"

# Share every USB device connected to the host
exegol start -d "/dev/bus/usb/"
```
