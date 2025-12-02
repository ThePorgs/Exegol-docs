# `upgrade` action <Badge type="pro"/> <Badge type="enterprise"/>

The exegol wrapper has an `upgrade` action dedicated to upgrade 
one or multiple containers from an outdated image to a more recent one.
Installing or updating an image can be done with the [install](/wrapper/cli/install) and [update](/wrapper/cli/update) actions.

The principle of the upgrade function is to automate all the tasks involved 
in recreating a new container with a new image:
1. The container will first be started, and the data listed below will be **saved**.
2. The container will then be **renamed** as a backup (or **deleted** and all unsaved data outside the workspace will be **permanently deleted**).
3. A new container will be created with the **same configuration** and the **same name**
4. All previously saved data will be **restored** in the new container.

> [!IMPORTANT] Backups
> When the outdated container is kept as a backup, the original container is **renamed** by appending `-bak`. 
> 
> It will be deleted together with the new upgraded container when using the [remove](/wrapper/cli/remove) option.

## Data transferred during upgrade

The following data will migrate to the new upgraded container:
- Your [my-resources](/images/my-resources) customization
- The container `/workspace` directory
- The **Zsh**, **Bash** and **python3** command history
- (From Exegol images `3.1.8`) The exegol-history database
- The **NetExec** and **Responder** database and configuration files
- The [TriliumNext](https://github.com/TriliumNext/Trilium) notes database
- The **Hashcat** and **John** "potfiles"
- The following files:
  - `/etc/hosts`
  - `/etc/resolv.conf`
  - `/opt/tools/Exegol-history/profile.sh`
- The configuration of the following tools: 
  - [Proxychains](https://github.com/haad/proxychains)

## Options

The options of the `upgrade` action are the following.

| Option          | Description                                                |
|-----------------|------------------------------------------------------------|
| `CONTAINER`     | Tag used to target one or multiple (csv) Exegol containers |
| `--all`         | Select all Exegol containers available for upgrade         |
| `--image`       | Upgrade the container to a different Exegol image          |
| `--no-backup`   | Make no backup of the original container                   |
| `-F`, `--force` | Upgrade container without interactive user confirmation    |

## Command examples

``` bash
# Upgrade interactively an exegol container:
exegol upgrade

# Upgrade the "ctf" container:
exegol upgrade ctf

# Upgrade every outdated container:
exegol upgrade --all

# Upgrade the "test" container to the "full" image:
exegol upgrade --image full test

# Upgrade "lab" and "test" containers without interactive user confirmation:
exegol upgrade -F lab test
```
