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
> what branch them module should be synchronized with, allowing to
> switch easily between release and dev versions.

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
> that can be modified in the [configuration file](/wrapper/features#exegol-configuration)
> if needed, but it's advised not to change it as disk space is not
> unlimited and Exegol image can take up to 30GB.



## Options

The options of the `update` action are the following.

| Option          | Description                                 |
|-----------------|---------------------------------------------|
| IMAGE           | This option specifies what image to update. |
| `--skip-git`    | Skip `modules updates <Modules-updates>`.   |
| `--skip-images` | Skip `images updates <Images-updates>`.     |

## Command examples

``` bash
# Update interactively an exegol image:
exegol update

# Update the full image:
exegol update full

# Update the full image without updating exegol modules:
exegol update --skip-git full

# Update exegol modules and have the option to change branch without updating docker image:
exegol update -v --skip-images
```
