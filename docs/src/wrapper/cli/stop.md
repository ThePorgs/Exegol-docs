# `stop` action

The purpose of the `stop` action is to stop one or more Exegol
containers.

If these containers have a VPN configuration, shutting down the
container will cause the VPN tunnel to be disconnected.

## Options

The options of the stop action are limited to selecting the container(s)
to be stopped.

| Option      | Description                                      |
|-------------|--------------------------------------------------|
| `CONTAINER` | Tag used to target one or more Exegol containers |
| `--all`     | Select every Exegol running containers           |

## Command examples

``` bash
# Stop interactively one or more containers:
exegol stop

# Stop the "demo" container:
exegol stop "demo"

# Stop the "demo", "test" and "dev" container:
exegol stop "demo" "test" "dev"
```
