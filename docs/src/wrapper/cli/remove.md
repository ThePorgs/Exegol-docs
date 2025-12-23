# `remove` action

The purpose of the `remove` action is to remove one or more Exegol
container.

If the deleted container was using an outdated image, the wrapper will
(by default) try to delete that outdated image automatically (unless
this default behavior is changed in the
[exegol configuration file](/wrapper/features#exegol-configuration), which is not advised
since disk space is not limited and Exegol images can take up to 30GB).

> [!NOTE] Upgrade backups
If your container still has backup containers (created during an upgrade), they need to be removed as well when removing the upgraded container. 

When deleting the container, the wrapper will check if the content of
the `/workspace` volume is empty. If the workspace is **empty**, exegol
will **automatically delete** the folder on the host, otherwise it will
**explicitly ask the user** if the workspace content should be
**deleted** or not.

## Options

The options of the `remove` action are limited to selecting the
container(s) to be removed and forcing the removal without asking the
user for interactive confirmation.

| Option          | Description                                                                                                                     |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------|
| `CONTAINER`     | Tag used to target one or more Exegol containers                                                                                |
| `--all`         | Select every Exegol containers available for removal                                                                            |
| `-F`, `--force` | Remove container without interactive user confirmation (confirmation will still be required for removing non-empty workspaces). |

## Command examples

``` bash
# Remove interactively one or more containers:
exegol remove

# Remove the "demo" container:
exegol remove "demo"

# Remove the "demo", "test" and "dev" container without asking for user confirmation:
exegol remove -F "demo" "test" "dev"
```
