# `restart` action

The purpose of the `restart` action is to stop and directly restart an
Exegol container.

If these containers have a `privileged` or `device` configuration,
restarting the container will refresh the available devices inside the
container.

> [!WARNING]
> Restarting a container will reset the `hosts`, `resolv.conf` files
> (and probably more).

## Options

The options of the restart action are limited to selecting the container
to be restarted and some starting options that can be also found on the
[start action](/wrapper/cli/start#Options).

| Option      | Description                                         |
|-------------|-----------------------------------------------------|
| `CONTAINER` | Tag used to target the Exegol containers to restart |

## Command examples

``` bash
# Restart interactively one container:
exegol restart

# Restart the "demo" container:
exegol restart "demo"
```
