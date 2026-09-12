# `update` action

## The update process

The exegol wrapper has an `update` action dedicated to updating the
different modules (wrapper, resources, etc.) of the project as well as
the (docker) Exegol images.

### Modules updates

This action make sure the local copies of the following repositories are
up to date:

- [Exegol](https://github.com/ThePorgs/Exegol) (wrapper code). If the
  wrapper has been installed with Pip, it will not be able to
  self-update, updating the package through Pip will be required (e.g.
  `python3 -m pip install --upgrade exegol`).
- [Exegol-images](https://github.com/ThePorgs/Exegol-images) (docker
  building files)
- [Exegol-resources](https://github.com/ThePorgs/Exegol-resources)
  (offline resources, `exegol-resources<exegol-resources>`). This module
  is optional, and users can choose to install/update it at any time.

> [!TIP]
> When running `exegol update -v`, the user will be able to choose from
> what branch the module should be synchronized with, allowing to
> switch easily between release and dev versions.

This action also refreshes the container profile sources declared in
the [configuration file](/wrapper/configuration#container-profiles):

- A source declared with `git` is cloned on its first update, and
  pulled on every later one, into a directory named after its source
  key under the profile component path.
- A source declared with a filesystem path is scanned where it sits.
  It is never cloned and never removed.
- A source directory whose entry has been removed from the
  configuration is deleted at the next update. This pruning step
  deliberately spares the `local` drop-in source even when its entry
  is absent from the map, and it also refuses to remove a directory
  that is not a re-clonable checkout: a stale directory left behind
  is recoverable, whereas the only copy of a hand-written profile is
  not.

Reading profiles performs no network access, so a newly declared git
source needs one `exegol update` run before its profiles appear in
the listing or in the interactive picker.

Fetching git sources requires an Enterprise licence. Below that tier
the step is a complete no-op: nothing is fetched and nothing is
pruned, so an already-cloned tree is left exactly where it is and
goes stale rather than being deleted.

> [!NOTE]
> `exegol update` is the only **unprompted** refresh of the container
> profile sources, and the only operation that prunes them. It is not
> the only way one is ever fetched: a command that reads profiles and
> finds a declared git source with no directory on disk offers a
> prompted fetch, and that offered fetch clones without removing
> anything.

For more details about container profiles, see the
[Container profiles](/wrapper/profiles/) documentation.

### Images updates

Once the local code base is updated, the wrapper compares the installed
Exegol images with those offered on the Dockerhub registry. If no
parameters have been provided at command-line, an interactive selection
will be possible to choose the images to update (if updates are
available).


> [!SUCCESS] Hint
> Older versions of images will be automatically deleted if they are no
> longer used by any container and if a newer version of the same image is
> installed. This automatic deletion behavior is a default configuration
> that can be modified in the [configuration file](/wrapper/configuration)
> if needed, but it's advised not to change it as disk space is not
> unlimited and Exegol image can take up to 30GB.



## Options

The options of the `update` action are the following.

| Option                           | Description                                                                                                                                                                      |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-w`, `--wrapper`                | Update the Exegol wrapper itself.                                                                                                                                                |
| `-r`, `--resources`              | Update the Exegol resources shared with every container.                                                                                                                         |
| `-P`, `--profiles`               | Update the container profile sources configured on this host.                                                                                                                    |
| `-S`, `--sentinel`               | Update the Sentinel audit profile sources configured on this host.                                                                                                               |
| `-i [IMAGE]`, `--images [IMAGE]` | Update an Exegol image: supplying no value opens the interactive selection described in [Images updates](#images-updates), supplying a tag updates that image without prompting. |

The selectors combine: naming several of them restricts the run to exactly
those targets, and naming none updates everything.

## Command examples

``` bash
# Update interactively an exegol image:
exegol update

# Update the full image:
exegol update -i full

# Update the container profile and Sentinel sources together:
exegol update -P -S

# Update the exegol wrapper and have the option to change branch, without updating any docker image:
exegol update -v --wrapper
```
