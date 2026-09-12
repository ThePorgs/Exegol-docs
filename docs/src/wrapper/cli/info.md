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

- Full detail on every section the invocation renders, rather than the summary
  drawn at the lower levels. Which sections render is decided by the section
  selectors below and never by the verbosity level; the settings reported by the
  user configuration table are documented [here](/wrapper/configuration).

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

The info action can be used to gather general information (available images,
containers, the user configuration, the project sources, the profiles), to
display a specific container's configuration in detail, or to do both in one
invocation. The section selectors below choose which parts are printed.

| Option | Description |
|----|----|
| `CONTAINER` | Optional positional argument to indicate the container tag of which to display the configuration. |
| `-c`, `--config` | Show the **User configurations** table: the wrapper settings currently in effect, and where each one comes from. See [the wrapper configuration](/wrapper/configuration) for what each setting does. |
| `-s`, `--sources` | Show the **Project sources** table: the git status of the wrapper, image and resource sources currently installed on this host. |
| `-P [CONTAINER_PROFILE]`, `--profiles [CONTAINER_PROFILE]` | List the available container configuration profiles, or show one by name. With no value it lists every available container profile; with a name it shows that one profile. |
| `-S [SENTINEL_PROFILE]`, `--sentinel [SENTINEL_PROFILE]` | List the available Sentinel audit profiles, or show one by name. With no value it lists every available Sentinel profile; with a name it shows that one profile. |
| `-a`, `--all` | Show every section: the user configuration, the project sources, the container profiles, the Sentinel profiles, the images, and every container (or the recap of the one you named). |

The bare `--profiles` form prints one row per discovered profile, with three
columns: **Source**, **Name** and **Comment**. The Source column names which
declared source the profile came from, and a profile that declares no comment
shows a dash rather than an empty cell. The named form prints only the keys that
profile's file actually declares: a key the file omits does not appear at all,
and a key the file pins to an explicit null is reported as declared-and-null
rather than being hidden. See [Container profiles](/wrapper/profiles/) for what
those keys mean. A container profile is **not** a Docker build profile, the kind
`exegol build` consumes to describe how an *image* is built, and it is **not** a
Sentinel audit profile, selected with `--sentinel`, which describes what a
container's audit logging records.

The sections always render in one fixed order (the user configuration, then the
project sources, then the container profiles, then the Sentinel profiles, then
the images and containers) regardless of the order the flags were typed in.
Naming `--config` and then `--sources` prints the same two tables, in the same
order, as naming `--sources` and then `--config`: the order is a property of the
action, not of the command line.

Naming several selectors renders all of them rather than the first one that
matched: `--config --profiles redteam` prints the user configuration table and
that one profile, a union of the two requests. Naming any section at all
replaces the default images-and-containers pair, which is what a bare
`exegol info` prints and what `--all` puts back alongside the rest. A container
named as the positional argument composes with a section selector rather than
being gated by it. The container name goes first, ahead of the selectors:
`exegol info demo --config` prints the user configuration table and the recap of
the `demo` container, and `exegol info demo --profiles` prints the container
profile listing and that same recap.

Global options can still be used, like for any action.

| Option | Description |
|----|----|
| `-h`, `--help` | Show the help message of any action |
| `-v`, `--verbose` | Verbosity level (-v for verbose, -vv for advanced, -vvv for debug) |
| `-q`, `--quiet` | Show no information at all |
| `--offline` | Run exegol in offline mode, no request will be made on internet (default: Disable) |
| `--arch {arm64,amd64}` | Overwrite default image architecture (default: host's arch) |

### Advanced options

The `exegol info <container>` command displays the container's root password as well as the desktop access URL, if enabled.
By default, even if there is a leak no direct exploitation is possible (the password cannot be used without the desktop service, which is disabled by default; and when the desktop is enabled, it is available only on localhost by default).

However, in certain cases (such as a stream), it may be preferable to hide this information by default.
To do this, simply set the environment variable `EXEGOL_STREAMER_MODE`.

``` bash
# Enable streamer mode
export EXEGOL_STREAMER_MODE=1

# Show the container's info without leaking root password and desktop access URL
exegol info <container>

# Disable streamer mode
unset EXEGOL_STREAMER_MODE
``` 

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

# Print the user configuration table:
exegol info --config

# Print the project sources table, the git status of the installed sources:
exegol info --sources

# Print every section:
exegol info --all

# List every available container profile:
exegol info --profiles

# Show what the "redteam" container profile declares:
exegol info --profile redteam

# Naming two sections renders both:
exegol info --config --profile redteam
```
