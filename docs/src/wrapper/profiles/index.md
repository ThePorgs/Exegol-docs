# Container profiles <Badge type="new"/><Badge type="pro"/>

A **container profile** is a named set of container-shape defaults: the answers that would otherwise be retyped as `exegol start` flags at the beginning of every engagement. One file is one whole profile, the file name is the profile name, and a profile is applied by naming it on the command line.

This page covers what a profile is, how its values rank against the command line and `~/.exegol/config.yml`, how to write a first one, where profiles are discovered from, what each licence tier unlocks, and what trusting a profile source actually grants.

Every host name, organisation, repository URL and profile name shown below is **synthetic**; every path shown is a documented Exegol path.

## What a container profile is

A profile is a single YAML file. One file is one whole profile, and **the file name is the profile name**: a file saved as `redteam.yml` defines a profile called `redteam`. Profiles are discovered on disk under a two-level layout, `<component_path>/<source>/<name>.yml`, where [`component_path`](/wrapper/configuration#container-profiles) defaults to `~/.exegol/components/profiles` and `<source>` names the collection the profile belongs to. The `local` source is the zero-configuration drop-in: its directory is created on first run and needs no declaration, so dropping a file into `~/.exegol/components/profiles/local/` is enough to define a profile.

Three unrelated mechanisms share the word "profile", and a container profile is only one of them. It is **not** a Docker build profile, the kind `exegol build` consumes to describe how an *image* is built. It is **not** a Sentinel audit profile, selected with `-SP` / `--sentinel-profile`, which describes what a container's audit logging records. A container profile describes the shape of a container: which image it starts from, how it is attached to the network, what is mounted into it, which shell opens, and so on. Confusingly but deliberately, a container profile may carry a `sentinel` section, and one of that section's fields names a Sentinel audit profile: the container profile decides *whether* audit logging runs and *which* audit profile it uses, and stops there.

A profile shapes a container **at creation, and only at creation**. It is never re-applied afterwards: restarting a container, entering it again, or running any later command does not consult the profile it was created from. Naming a profile against a container that already exists therefore changes nothing. The whole profile is ignored rather than partially applied, nothing is prompted and nothing is blocked, and a single warning names both the profile and the container and restates the rule. Changing the shape of an existing container means recreating it.

## Option precedence

Three tiers can supply a value for the same option, and they are consulted in one fixed order:

1. **The command line**: anything typed as a flag on the invocation.
2. **The profile**: the values declared in the profile file named by `--profile`.
3. **`~/.exegol/config.yml`**: the persistent user defaults.

An option that no tier declares falls back to Exegol's own built-in default.

Each tier is consulted on key **presence**, not on whether the value it carries looks meaningful. A key omitted from a profile means "this tier has no opinion" and the search continues downwards. An explicit `null` is the opposite: it is a declaration, it pins the option to nothing, and the search stops there. Omitting a key and writing `key: null` are therefore two different instructions, and `exegol info --profiles <name>` shows a declared `null` exactly as it shows any other declared value.

Ten of the options that shape a container are switches with two command-line spellings, a positive one and a `--no-` one. What you type decides one of three things:

| You type   | Result |
| ---------- | ------ |
| `--log`    | Forced **on**, whatever the profile or `~/.exegol/config.yml` say. |
| `--no-log` | Forced **off**, whatever the profile or `~/.exegol/config.yml` say. |
| *neither*  | No opinion. The search continues down the list above. |

That third state is what makes a shared profile workable. When a team profile turns something on and it is wanted off for one container, the negative spelling typed on that one invocation settles it there and nowhere else: the profile file is untouched, and every other container created from it keeps the setting the team chose.

A worked example, on a scalar option. Given a profile that declares a default shell:

```yaml
# ~/.exegol/components/profiles/local/redteam.yml
shell:
  default: zsh
```

the command below creates a container whose shell is `tmux`, not `zsh`:

```bash
exegol start htb full --profile redteam --shell tmux
```

The command line is the highest tier with an opinion on that option, so it wins outright and the profile's `shell.default` is never reached. Every other value the profile declares still applies: precedence is decided per option, not per file.

The example above uses a scalar deliberately. Options that carry a **list** (volume mounts, environment variables, published ports, devices and Linux capabilities) are **concatenated** across tiers rather than replaced: every tier that declares entries contributes them, with the command line's entries appended last. A `--volume` typed on the command line adds to a profile's `volumes.mounts`; it does not replace them, and there is no command-line way to subtract an entry a profile declared.

Beyond the options that map to `exegol start` flags, a profile may also override a defined subset of the persistent settings in `~/.exegol/config.yml`. That subset is fixed, and a second, disjoint set of settings can never be supplied by a profile at all. Both lists are enumerated in full on the profile file reference: the twelve keys under [what a profile may override](/wrapper/profiles/reference#what-a-profile-may-override-in-the-configuration-file), and the settings it never can under [what a profile may never set](/wrapper/profiles/reference#what-a-profile-may-never-set).

## A first profile

A profile needs no configuration to exist: the `local` source is already there. Save a file under it, named after the profile:

```yaml
# ~/.exegol/components/profiles/local/redteam.yml
metadata:
  comment: "Red team engagement defaults"
image:
  tag: full
shell:
  default: zsh
```

Every key is optional, so a profile that declares three of them is a complete, valid profile. Keys that are left out are not defaults being restated: they are options the profile has no opinion about.

Once the file is saved, the wrapper can list what was discovered, show what a single profile declares, and create a container from it:

```bash
# List every discovered container profile
exegol info --profiles

# Show what the "redteam" profile declares
exegol info --profile redteam

# Create the htb container from the redteam profile
exegol start htb full --profile redteam
```

Unknown and misspelled keys are **rejected when the file is loaded**, never ignored: a typo in a key name is an error that names the offending key, not a silently inert line. The same strictness applies to the structure itself: a key duplicated inside one mapping is a parse error rather than a last-one-wins merge, so a block that was accidentally written twice is reported instead of being quietly discarded.

## Where profiles come from

A **source** is a named collection of profile files, and the name doubles as a directory name under the component path. Every profile Exegol can load belongs to exactly one source, which is why the on-disk layout is two levels deep rather than one.

**`local` is the drop-in source, and it needs no configuration.** It is written into the configuration template on first setup and its directory is created under the component path. It is scanned where it sits: never cloned, never fetched, never pruned. A file added to it takes effect for the next container created from it, with no update step in between. Removing its entry from `~/.exegol/config.yml` disables it, exactly like any other source, and a removal is not silently undone by the next configuration upgrade.

**Everything else is declared.** Additional sources are keyed by name under `config:` → `profile:` → `sources:` in `~/.exegol/config.yml`, and each value is a mapping carrying either a local `path` or a `git` remote:

```yaml :scroll
# ~/.exegol/config.yml
# Only the profile.sources subtree is shown; the rest of the file is unchanged.
config:
    profile:
        sources:
            # The drop-in source, written on first setup. Scanned in place, never fetched.
            local:
                path: ~/.exegol/components/profiles/local

            # A team source pinned to a tag. The pin is the supply-chain control:
            # without `ref`, every fetch takes whatever the default branch says today.
            team-profiles:
                git: https://git.example.com/example-org/container-profiles.git
                ref: v1.0                                        # a branch, a tag or a commit SHA

            # A directory that already exists on this machine: an NFS share, or a checkout
            # managed by configuration management. Scanned where it is.
            onprem:
                path: /opt/container-profiles

        # The key 'core' is reserved and cannot appear here.
```

Note that the block is nested under `config:`; a `profile:` key written at the top level of the file is not read, and the profiles it declares silently never load. The complete declaration syntax (every accepted form, the character set a source key must satisfy, and the rules a declaration is validated against) is documented under [Container profiles](/wrapper/configuration#container-profiles) in the wrapper configuration reference.

### Multiple sources <Badge type="enterprise"/>

Several declared sources are loaded together, and their profile names live in one shared space rather than shadowing each other. Two sources may define a profile called `redteam` without colliding.

A profile is addressed either by its bare name or by a source-qualified `source.name`. A bare name works for as long as it is unique across all loaded sources. When two sources define it, the qualified form (`team-profiles.redteam`) selects one of them explicitly. A bare name that is genuinely ambiguous is **refused**, never silently resolved to one of the candidates: the error reports how many sources define the name and lists the qualified alternatives to re-run with. A name that matches nothing is refused the same way, and neither failure ever leaves a container quietly created without the shape that was asked for: at an interactive terminal the refusal is followed by the picker described below, and that picker offers no way out other than choosing a profile, so a mistyped name becomes an explicit choice rather than a silently different container.

The container-profile flag on the creation action requires a name; there is no form of it that lists instead of applying. A name that is empty or matches nothing opens the interactive picker at an interactive terminal, which lists the available profiles to choose from. The listing produced by `exegol info --profiles` and that picker answer the same question about the same objects and share the same three columns, in the same order: **Source**, **Name** and **Comment**. The Source column is what makes a name that appears twice distinguishable at a glance, and the Comment column is the `metadata.comment` string a profile declares about itself, which is what makes a name identifiable without opening the file.

### Git sources <Badge type="enterprise"/>

A source declared with `git` is cloned into a directory named after its key under the component path, and refreshed from its configured `ref` by `exegol update`. That operation is also the only one that **prunes**: a source key deleted from `~/.exegol/config.yml` has its directory removed at the next update, and nothing else ever removes a source directory. Local `path` sources are outside all of this: they are scanned in place and are never cloned, fetched or pruned.

`exegol update` is not, however, the only way a git source is ever fetched. A surface that reads profiles and finds a declared git source with no directory on disk **offers** to fetch it, and answering yes performs the fetch without pruning anything: an answer about fetching is not consent to delete. The offer is made both when a profile is named on `exegol start --profile <name>` and by `exegol info --profiles`, so a newly declared source does not have to wait for a full update cycle before its profiles become selectable.

A fetch is a no-op below the Enterprise tier: it neither clones nor prunes. A licence that lapses therefore leaves every already-cloned tree exactly where it is, going stale rather than being deleted.

## Licence tiers

Container profiles require a **Professional** licence or above; they are unavailable at the Community tier.

A Professional licence loads the `local` drop-in source, which is the whole feature for a single operator: profiles are written locally, discovered automatically and applied by name. **Enterprise** adds the two things a team needs: several sources loaded together, and sources hosted in git and fetched by Exegol.

A configuration that declares nothing beyond the seeded `local` source produces **no message at all**. There is no routine warning to look for, and none appears simply because the licence is Professional rather than Enterprise. A single warning line is emitted only when a configuration actually declares sources that cannot be used at the active tier: it names which sources were skipped and which one is in use, and it is one aggregated line per invocation rather than one per source. A configuration that declares nothing unusable never reaches that path.

## Security considerations

### A profile source is a dependency

> [!WARNING] Adding a git profile source lets its authors widen what every container created from it is allowed to do
> A profile does not only choose an image and a shell. It can turn on **privileged mode**, add **Linux capabilities**, pass **host devices** through, attach the container to the **host network stack**, and **bind-mount host directories** read-write into the container, including repointing the host paths Exegol itself mounts. Every one of those options is applied as declared when a container is created from the profile, and a source's authors can ship a changed profile on the next fetch.

A profile source is a third-party dependency and is worth exactly the same treatment as any other dependency in a stack.

- **Only trusted sources should be declared**, and trust here means what it means for a package registry: knowing who controls the repository, and what happens if that changes.
- **A git source should be pinned with `ref:`** to a tag or a commit SHA. Without a pin, every fetch takes whatever the default branch says that day, and an upstream compromise arrives silently; with a pin, moving to a new revision is a deliberate act and the diff between revisions can be reviewed before it is taken.
- **Any profile that was not written locally should be read before it is used.** `exegol info --profile <name>` prints exactly what a profile declares and nothing it does not, which makes that review a single command.

Exegol does **not** prompt before applying any of these options. There is no confirmation step today: a profile that declares privileged mode gets a privileged container, and the only announcement is a verbose-level line. Reading a profile before selecting it is the control that exists. The keys that widen a container are named one by one, with the same warning at the point of use, under [`system`](/wrapper/profiles/reference#system) on the profile file reference.

Two structural guarantees limit what a profile file can do on its own. Profile files are read with a safe YAML loader, so parsing one cannot construct arbitrary Python objects (a malicious file is dangerous for the container options it declares, not for the act of being parsed), and a duplicate key inside one mapping is a parse error rather than a silent last-wins merge, so a declared block cannot be quietly replaced by a later one further down the file. Host paths that a profile is allowed to repoint are constrained rather than free: a relative path, the filesystem root, and the home directory or any ancestor of it are all refused outright.

Finally, **no field anywhere in the schema accepts credential contents**. The VPN fields reference a configuration file and a credentials file *by path*, and those files stay on the operator's own disk; nothing in a profile carries a user name, a secret, a token or key material. That is what makes a profile file safe to commit to a repository and share with a team, and it is a property worth preserving when authoring one: an environment variable declared in `shell.env` ends up in every shell of the container, so it is a place for configuration and never for a secret.

## A complete example

A realistic engagement profile, saved as `~/.exegol/components/profiles/local/redteam.yml` (the file name is the profile name, so this file defines the profile applied by `exegol start htb full --profile redteam`):

```yaml
# ~/.exegol/components/profiles/local/redteam.yml
metadata:
  comment: "Red team engagement - isolated network, session logging on"

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

Nothing here widens what the container may do, which is deliberate: an example is the thing that gets copied. The keys shown are a small subset of what a profile may declare. The annotated template checked into the Exegol repository demonstrates every section, with a comment on each field.
