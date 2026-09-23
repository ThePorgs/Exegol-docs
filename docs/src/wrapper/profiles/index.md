# Container profiles <Badge type="new"/><Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

A **container profile** is a named set of container-shape defaults: the answers that would otherwise be retyped as `exegol start` flags at the beginning of every engagement. One file is one whole profile, the file name is the profile name, and a profile is applied by naming it on the command line.

```bash
exegol start cont001 --profile lab
```

This page covers what a profile is, how its values rank against [the command line](/wrapper/cli/start) and the [user configuration](/wrapper/configuration), how to write a container profile, and more.

## What it isn't

Two other unrelated mechanisms share the word "profile", and a container profile is not to be confused with them: it is **not** a [Docker build profile](/wrapper/cli/build), and it is **not** a [Sentinel profile](/sentinel/profiles/).

## What it is

A profile is a single YAML file. One file is one whole profile, and **the file name is the profile name**: a file saved as `redteam.yml` defines a profile called `redteam`. 

Profiles are discovered on disk under a two-level layout, `<component_path>/<source>/<name>.yml`. 
- The [user configuration](/wrapper/configuration) defaults [`component_path`](/wrapper/configuration#container-profiles) to `~/.exegol/components/profiles`. 
- `<source>` names the collection the profile belongs to: 
   - The `local` source is the zero-configuration drop-in: its directory is created on first run and needs no declaration. Drop a file into `~/.exegol/components/profiles/local/` to define a profile.
   - Additional sources may be declared (see [Sources](#sources)).

A container profile describes the shape of a container: which image it starts from, how it is attached to the network, what is mounted into it, which shell opens, and so on. 

> [!NOTE] A profile shapes a container **at creation, and only at creation**
> It is never re-applied afterwards: restarting a container, entering it again, or running any later command does not consult the profile it was created from. Naming a profile against a container that already exists therefore changes nothing. The whole profile is ignored rather than partially applied, nothing is prompted and nothing is blocked, and a single warning names both the profile and the container and restates the rule. Changing the shape of an existing container means recreating it.

A profile may also override some settings set in the [user config](/wrapper/configuration) that don't map to `exegol start` flags. See [what a profile may override](/wrapper/profiles/reference#what-a-profile-may-override-in-the-configuration-file) and [what a profile may never set](/wrapper/profiles/reference#what-a-profile-may-never-set).

## Precedence

An option can be declared in 4 different places. And there's a specific order in which the values are applied ([CLI](/wrapper/cli/start) > [Container profile](/wrapper/profiles/) > [User config](/wrapper/configuration) > Built-in default).

In order to be taken into account in the profile, an option must be explicitly declared. Left empty, it will be ignored. Explicitly setting to `null` will pin the option to nothing.

> [!NOTE] Binary switches
> Some options are binary switches, and they've got a specific spelling. 
>
> For example: `--log` and `--no-log` force the option to be on or off, respectively.
>
> With `exegol start cont001 --profile redteam --no-log`, the profile's `logging.enabled` is never reached, and the command line's `--no-log` takes top precedence.

> [!NOTE] List options
> Options that carry a **list** (volume mounts, environment variables, published ports, devices and Linux capabilities) are **concatenated** across declarations rather than replaced.
>
> For example: a `--volume` typed on the CLI adds to a profile's `volumes.mounts`. There is no way to subtract an entry a profile declared from CLI.

## Example profile

```yaml
# Example: ~/.exegol/components/profiles/local/redteam.yml
metadata:
  comment: "Example profile"
image:
  tag: full
shell:
  default: zsh
```

Not all keys need to be declared. A profile can be as short as a single key, or as long as every key is declared.

Once the file is saved, the wrapper will list it and be able to show its contents with the [info](/wrapper/cli/info) CLI action.

```bash
# List every discovered container profile
exegol info --profiles

# Show what the "redteam" profile declares
exegol info --profile redteam
```

The following command will start a container from the `redteam` profile:

```bash
# Create the htb container from the redteam profile
exegol start htb --profile redteam
```

In the example above, it would be equivalent to:

```bash
exegol start htb full --image full --shell zsh
```

## Sources

A **source** is a named collection of profiles. The name doubles as a directory name under the component path (`~/.exegol/components/profiles` by default).

`local` is the drop-in source, and it needs no configuration. It is written into the configuration template on first setup and its directory is created under the component path. Removing its entry from the [user config](/wrapper/configuration) disables it, exactly like any other source.

Additional sources are keyed by name under `config:` → `profile:` → `sources:` in the [user config](/wrapper/configuration), and each value is a mapping carrying either a local `path` or a `git` remote. See [Container profiles](/wrapper/configuration#container-profiles) in the wrapper configuration reference for the complete declaration syntax.

```yaml :scroll
# User config (default: ~/.exegol/config.yml)
[... snippet ...]
config:
    profile:
        sources:
            local:
                path: ~/.exegol/components/profiles/local

            # A team source pinned to a tag. The pin is the supply-chain control:
            # without `ref`, every fetch takes whatever the default branch says today.
            team-profiles:
                git: https://git.example.com/example-org/container-profiles.git
                ref: v1.0 # a branch, a tag or a commit SHA

            # A directory that already exists on this machine: an NFS share, or a checkout
            onprem:
                path: /opt/container-profiles
```

> [!CAUTION] The key `core` is reserved and cannot be used.

### Multiple sources <Badge type="team"/><Badge type="enterprise"/>

A profile may be specified by its bare name (e.g. `redteam`) or by an source-qualified name (e.g. `team-profiles.redteam`). A source-qualified name is always required when two sources define a profile with the same name.

The listing produced by `exegol info --profiles` (see [Info](/wrapper/cli/info)) shows: **Source**, **Name** and **Description**. The **Source** column is what makes a name that appears twice distinguishable at a glance, and the **Description** column is the `metadata.description` string a profile declares about itself, which is what makes a name identifiable without opening the file.

### Git sources <Badge type="team"/><Badge type="enterprise"/>

A source declared with `git` is cloned into a directory named after its key under the component path, and refreshed from its configured `ref` with `exegol update`. If a Git source is removed from the [user config](/wrapper/configuration), its directory is removed at the next update. Git source updates may be triggered manually with `exegol update` or suggested by the wrapper in some [start](/wrapper/cli/start) or [info](/wrapper/cli/info) scenarios. 

Local `path` sources are never cloned, fetched, pruned or managed in any way rather than scanned for profiles.

## Security considerations

Profile sources are third-party dependencies that can grant containers elevated privileges or access to host resources, so only trusted sources should be used. Container profiles should be reviewed regularly to ensure they are still up to date and secure. Pinning git sources to a specific tag or commit avoids silent changes. 

## Example profile (realistic)

A realistic engagement profile below.

```yaml
metadata:
  comment: "Isolated network, session logging on"

image:
  tag: full

network:
  mode: nat
  hostname: exegol-redteam
  ports:
    - "127.0.0.1:8080:8080"
    - "127.0.0.1:4444:4444"

volumes:
  workspace_path: /home/operator/engagements/example-corp
  mounts:
    - /home/operator/wordlists/:/opt/wordlists/:ro

shell:
  default: zsh
  env:
    - "HTTP_PROXY=http://127.0.0.1:8080"
    - "TARGET_DOMAIN=corp.example.com"

logging:
  enabled: true
  method: asciinema
```
