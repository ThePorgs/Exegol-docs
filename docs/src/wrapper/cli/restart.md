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

### Sentinel

The `--sentinel-refresh` option forces a regeneration of the
container's deployed Sentinel configuration from the host's profile
sources at restart, even for a container whose update strategy is
`disabled`. It is deliberately distinct from `-F`/`--force`, which is
about the container itself and not about its Sentinel configuration.
It does **not** fetch anything from a remote source either: downloading
and updating the profile sources themselves is the job of
`exegol update`.

See the [Sentinel configuration](/sentinel/configuration) for the
update strategy values, and
[Sources and updates](/sentinel/profiles/sources) for how the profile
sources are fetched.

| Option               | Description                                                                                                                          |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `--sentinel-refresh` | Force a Sentinel profile configuration refresh from host sources at restart, even for containers whose update strategy is `disabled` |

## Command examples

``` bash
# Restart interactively one container:
exegol restart

# Restart the "demo" container:
exegol restart "demo"
```
