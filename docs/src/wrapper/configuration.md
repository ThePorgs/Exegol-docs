# Configuration

## Home directory

The `~/.exegol` folder exists in the user's home folder to centralize
["exegol resources"](/resources/list),
["my-resources"](/images/my-resources), workspaces, and the
configuration file.

By default, every exegol container has a **workspace volume**. If the
path of this volume is not specified by the user
[see start parameters](/wrapper/cli/start), a folder with the
name of the container will be created in the
["private workspace"](/wrapper/features#exegol-configuration) folder. By default,
this folder is located at `~/.exegol/workspaces/`.

## Configuration file

The **configuration file** (YAML) is located at `~/.exegol/config.yml`
and is generated by the wrapper during the first execution, with the
default configurations.

The Exegol wrapper is configured with many default settings. Most of
them can be modified with a simple argument. For productivity purposes,
setting a different default behavior once and not have to add the same
options everytime is interesting. For this exact purpose, a
configuration file exists that allows users to persistently change the
behavior and operations to be performed by default.

The user configuration currently in place can be viewed with the
command: `exegol info -v`. More information on the
[info page](/wrapper/cli/info).

Within the `~/.exegol/config.yml` file, several settings can be
configured to customize the Exegol experience, all distributed in
multiple sections below.

### Volumes

The volume section allows to change the default path for various volumes.

> [!WARNING]
> Volume path can be changed at any time but already existing
> containers will not be affected by the update and will keep the
> original paths they were created with.

- `my_resources_path`: the "my-resources" volume is a storage space
  dedicated to the user to customize his environment and tools. This volume is, by default, shared across all exegol containers. See [details about it](/wrapper/features#exegol-configuration). Be careful **not** to use a folder with **existing data**, in which case their permissions will be automatically modified to enable access sharing. This change will not be applied to already existing exegol containers.
- `exegol_resources_path`: exegol-resources are data and static tools downloaded in addition to docker images. These tools are complementary and are accessible directly from the host. See [details](/resources/list).
- `private_workspace_path`: when containers do not have an explicitly declared workspace at their creation (i.e. with `--cwd-mount`, or `--workspace`), a dedicated folder will be created at this location to share the workspace with the host but also to save the data after deleting the container.

### Config

The config section allows you to modify the default behavior of the Exegol wrapper.
- `auto_check_update`: enables automatic check for wrapper update. (Default: `True`)
- `auto_remove_image`: automatically remove outdated image when they are no longer used. (Default: `True`)
- `auto_update_workspace_fs`: automatically modifies the permissions of folders and sub-folders in your workspace by default to enable file sharing between the container with your host user. (Default: `False`)
- `default_start_shell`: default shell command to start. (Default:`zsh`)
- `enable_exegol_resources`: Enables or not the exegol resources module by default on any new container. (Default: `True`)

#### Shell logging
Change the configuration of the shell logging functionality.
- `logging_method`: Choice of the method used to record the sessions, `script` or `asciinema`. (Default: `asciinema`)
- `enable_log_compression`: Enable automatic compression of log files (with gzip). (Default: `True`)

#### Desktop

Change the configuration of the virtual Desktop feature.
- `enabled_by_default`: Enables or not the desktop mode by default. If
this attribute is set to True, then using the CLI `--desktop` option
will be inverted and will **DISABLE** the feature (Default: `False`)
- `default_protocol`: Default desktop protocol,can be `http`, or `vnc`
depending on your wrapper / image version. (Default: `http`)
- `localhost_by_default`: Desktop service is exposed on localhost by
default. If set to true, services will be exposed on `localhost`
(127.0.0.1) otherwise it will be exposed on `0.0.0.0`. This setting
can be overwritten with [--desktop-config](/wrapper/cli/start).
(Default: `True`)

#### Network <Badge type="new"/>

Configure the network behavior of Exegol containers.

- `default_network`: Default network mode for any new container. (Default: `host`)
  - `host`: Container shares host's network interfaces
  - `docker`: Uses shared Docker's bridge network
  - `nat`: <Badge type="pro"/><Badge type="enterprise"/> Creates a network for each container
  - `disable`: Disables all network connectivity

- `fallback_network`: Network mode to use if the default mode is not available. (Default: `nat`, or `docker` if the use doesn't have the required Subscription level)

- `exegol_dedicated_range`: Network range for NAT mode containers. (Default: `172.31.0.0/16`)
  - Each container using NAT mode gets a dedicated subnet within this range
  - Must be a valid CIDR notation (e.g., `172.31.0.0/16`)

- `exegol_default_netmask`: Subnet mask size for `nat` mode containers. (Default: `28`)
  - Controls the size of each container's subnet
  - Smaller values create larger subnets
  - Must be between `16` and `30`

For more details about network modes and their use cases, see the [Network Modes section](/wrapper/cli/start#network-modes) in the start command documentation.


#### Custom images <Badge type="new"/><Badge type="enterprise"/>

Enterprise users can configure custom image names to be recognized by Exegol. This configuration allows the wrapper to identify and work with Exegol images that have different names than the official ones.

- `custom_images`: List of image names/registries that should be recognized as Exegol images. The wrapper will take those into account in commands like `start`, `info`, and `exec`.
  ```yaml
  custom_images:
      - your-org/exegol
      - registry.your-domain.com/exegol
  ```

Note that images must be pulled manually as they may be in private registries requiring specific authentication

> [!SUCCESS]
> For organizations requiring a managed Exegol private registry, with managed private images, and a full integration with with the wrapper, contact us for a quote. Read more at [Custom registry](features#custom-registry)

