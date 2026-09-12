# Sources and updates <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

A **source** is a named collection of trigger, action and profile files, and it is what a reference resolves against: `core.demo` is the `demo` profile of the source keyed `core`. A source is either a git repository Exegol clones for you or a directory that already exists on the machine, and every profile Sentinel can load lives in exactly one of them.

This page covers declaration, transports, pinning, fetching and trust. For how a `sourcekey.name` reference resolves once the sources exist, and for the two different bare-name rules, see [Profile concepts](/sentinel/profiles/concepts).

Every host name, organisation and path below is **synthetic**, except the official `core` repository URL.

## The three kinds of source

**`core`, the official source, and the only reserved one.** It is provisioned by Exegol from the repository URL held in the wrapper's constants, `https://github.com/ThePorgs/sentinel-builtin.git`, and cloned into the components directory as `core`. It cannot be redefined: declaring a `core` key under `sentinel.sources` is a fatal configuration error, so it cannot be pointed at a different repository. Its upstream README is explicit that it currently ships a **minimal demo catalogue** rather than a large profile library. Today that is the `demo` profile and the triggers and actions it needs. Treat `core` as the worked example every other source builds on, not as a production profile library.

**`local`, the drop-in source for profiles you write yourself.** It is declared as a `path:` source in the configuration template on first setup and its directory is created under the components directory. It is scanned where it sits, never cloned, never fetched and never pruned, and your customisations survive a configuration upgrade. Removing its entry from `~/.exegol/config.yml` disables it, exactly like any other source.

**Everything else you declare.** Any number of additional sources, git-backed or local, keyed by a name of your choosing under `sentinel.sources`. Two sources may define the same profile name without colliding (that is what the namespace is for), and a bare `-SP` value that both define becomes an error rather than a silent pick.

## Declaring sources

Sources live under `config:` → `sentinel:` → `sources:` in `~/.exegol/config.yml`. Each key is a source name and each value is a mapping carrying either a `git` remote or a local `path`:

```yaml :scroll
# ~/.exegol/config.yml
# Only the sentinel.sources subtree is shown; the rest of the file is unchanged.
config:
    sentinel:
        sources:
            # The drop-in source, written on first setup. Scanned in place, never fetched.
            local:
                path: ~/.exegol/components/sentinel/local

            # A team source pinned to a tag. The pin is the supply-chain control:
            # without `ref`, every `exegol update` takes whatever the default branch says today.
            team-profiles:
                git: https://git.example.com/org/sentinel-profiles.git
                ref: v1.0                                        # a branch, a tag or a commit SHA

            # scp-like SSH remote. The host user's own SSH keys are used, as-is.
            private-ssh:
                git: git@git.example.com:org/sentinel-profiles.git

            # The same repository reached over an explicit ssh:// URL.
            mirror-ssh:
                git: ssh://git@mirror.internal.example/org/sentinel-profiles.git

            # A source you author yourself: a full clone you can commit to and push from.
            authoring:
                git: https://git.example.com/org/my-profiles.git
                mode: dev

            # A directory that already exists on this machine: an NFS share, a checkout
            # managed by your configuration management. Scanned where it is.
            onprem:
                path: /opt/sentinel-profiles

        # The key 'core' is reserved and cannot appear here.
```

## Rules a source declaration must satisfy

Every constraint below is checked when `~/.exegol/config.yml` is read, which happens on **every** `exegol` invocation. A declaration that breaks one is a **fatal** configuration error: an explicit message names the source key and the offending field, and the command exits. No `exegol` command runs at all until the entry is fixed or removed. The failure is loud, not a source that quietly goes missing.

| Rule | Accepted | Notes |
| ---- | -------- | ----- |
| The key `core` is reserved | nothing: the key cannot be used | Declaring it is a fatal error that stops every `exegol` command. `core` is provisioned by Exegol and cannot be shadowed or repointed from configuration |
| Source-key charset | letters, digits, `_` and `-` | The key doubles as an on-disk directory name under the components path, so this charset is the path-traversal control: `.`, `..`, `/` and `\` cannot match it. It is also why `.` is free to mean "source separator" in a `sourcekey.name` reference |
| Spec shape | a mapping carrying either `git` (with an optional `ref`) or `path` | A scalar, a list, or a mapping carrying neither key is rejected. `git` wins if both are present |
| Git URL | an `http://`, `https://`, `ssh://`, `git://` or `user@host:path` remote, with no whitespace | Both the URL and the ref travel verbatim into git's argument list. Whitespace, a leading `-` (which git would read as an option), and the `helper::` remote syntax, which resolves to an arbitrary command, are all rejected |
| `ref` charset | letters, digits, `.`, `_`, `/` and `-`, not starting with `-` | Applies to a branch, a tag or a commit SHA alike. Same argument-injection reasoning as the URL |
| `mode` | `pinned` or `dev` | Any other value is rejected. Absent means `pinned` |

## Transports

There is **no transport restriction**. `http://`, `https://`, `git://`, `ssh://` and the scp-like `user@host:path` form are all accepted, because whether a given transport is acceptable on your network is your decision and not Exegol's. An internal mirror served over plain HTTP, or a repository reachable only over SSH, are both legitimate deployments. What is rejected is the small set of values above that git would not read as a plain remote.

SSH sources use the host user's existing SSH configuration and keys. Nothing about the key material is copied into the container, and Sentinel never asks for a passphrase.

> [!NOTE] Git runs non-interactively, so a missing credential fails instead of hanging
> Terminal prompting is disabled for these fetches, and when an SSH source is declared, SSH runs in batch mode with a trust-on-first-use host-key policy. Your own SSH command configuration is extended rather than replaced, so a deploy key or a jump host you already configured keeps working. The practical consequence: a private HTTPS source with no credential helper on the host fails fast with an authentication error rather than blocking an unattended `exegol update` on a password prompt.

## Modes

`mode` decides how a git source is cloned and refreshed.

**`pinned` is the default.** The source is a shallow clone at the configured `ref`, and an update re-clones it. It is a consumed artefact: nothing you change inside its directory survives.

**`dev` is for a source you author.** The source is a full clone with real history, which you can commit to and push from. Updates are a safe pull on the branch you are currently on, and the directory is neither re-cloned nor removed, so local commits and uncommitted work survive an `exegol update` for as long as the source stays declared. `ref` only drives the initial checkout. After that, the branch is yours.

> [!WARNING] Undeclaring a `dev` source still removes its directory, but never without asking you first
> The prune keeps only the directories backing a **declared** source, and a `dev` clone is an ordinary git checkout, so deleting or renaming its key in `~/.exegol/config.yml` makes its directory stale like any other. Before removing one, `exegol update` inspects it: if it holds uncommitted changes, or commits that are on no remote, it says so and asks you to confirm. That prompt defaults to **no**, `-F`/`--force` does not skip it, and it keeps the directory when there is nobody to answer it, such as an unattended run. A stale directory with nothing local-only to lose is removed under the ordinary confirmation, which `-F` does skip. Push your work before you remove the entry.

## Fetching and updating

**`exegol update` is the sole fetch entrypoint for profile sources.** Nothing else clones or pulls them: not container creation, not a restart, not `exegol start -S`. It provisions `core`, clones or pulls each declared git source to its configured ref, and prunes git-source directories that are no longer declared. It is a no-op when the session is not licensed for the Sentinel feature, and it refuses to run in offline mode. See [Modules updates](/wrapper/cli/update#modules-updates) for where this sits in the wider update.

Local `path:` sources are **never** fetched and never pruned. They are scanned in place on every profile load, so editing a file there takes effect on the next container that reads it, with no update step at all.

Git sources are cloned into a directory named after their key under the components path (the `component_path` key in `~/.exegol/config.yml`, defaulting to `~/.exegol/components/sentinel/`). That directory is Exegol's to manage: a `pinned` source is replaced wholesale on update, and a key you delete from the configuration has its directory pruned at the next `exegol update`. Keep nothing there you are not willing to lose without first pushing it: what `mode: dev` changes is how a **declared** source is refreshed, a pull on your branch instead of a wholesale replacement, and it is the reason you are warned before an undeclared one is removed, not an exemption from removal.

> [!WARNING] `update_strategy` fetches nothing. It is a different mechanism entirely
> `sentinel.update_strategy` in `~/.exegol/config.yml`, and the matching `--sentinel-strategy` option, control **when a container's already-deployed configuration is regenerated** from the host's sources. They never touch the network. A container on `on_restart` picks up the profile changes already present on the host at its next restart; one on `disabled` keeps the configuration it was created with. Neither brings new commits down from a git source. Only `exegol update` does that. The values, and the flag that forces a refresh anyway, are on the [Configuration](/sentinel/configuration) page.

## Provenance and trust

The configuration deployed into a container records where each source came from, in an inert metadata block the in-container runner ignores. For a git source it carries the type, the remote URL, the configured ref and the **commit actually deployed**, read from the on-disk checkout at the moment the configuration was generated; for a local `path:` source the commit is null and the path is recorded instead. That gives a per-container record of exactly which revision of which source was active during an engagement, months after the fact.

The URL recorded there is **sanitised**: any `user:password@` userinfo is stripped before it is written. That is because this file is bind-mounted into the container and can be shipped off-host. It is also the reason a source URL should never carry an embedded credential in the first place. Use a credential helper or an SSH key, not a token in the remote.

> [!WARNING] A profile source can run arbitrary code in your container. Treat it like a dependency
> An `exec_command` action runs a shell command of the profile author's choosing inside the container, by design. Adding someone else's source therefore grants its authors code execution in every container that uses a profile from it, with the container user's privileges and the engagement's network access. Add only sources you trust, pin them with `ref:` so a compromise upstream does not reach you on the next update, and review the diff before moving the pin. The full discussion is on [Security considerations](/sentinel/security), and what an action can do is on [Actions](/sentinel/profiles/actions).

Profile files are read with a safe YAML loader, which means parsing one cannot construct arbitrary objects. That is not a sandbox: the execution path is `exec_command`, which runs *after* parsing succeeds and is a documented feature rather than a parser flaw. A well-formed, schema-valid profile from an untrusted source is exactly as dangerous as the commands it declares.

> [!WARNING] One invalid file takes the entire source down with it
> A file that fails to parse, or that fails schema validation, drops its **whole source namespace**. Every profile in that source becomes unselectable at once and `-SP` reports it as not found, even though the file is plainly there on disk. Profiles in your other sources are unaffected. When authoring a source, validate before you push: a single unquoted glob is enough to take the whole thing offline for everyone who pulls it.
