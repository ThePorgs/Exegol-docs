# My resources

"My-resources" allows users to make Exegol their own and customize it even further. This feature relies on a simple volume shared between the host and all exegol containers, and an advanced integration in the Exegol images directly.
It allows users to enjoy their own tools that are not available in Exegol but also to customize their Exegol setup

## Preparing customizations on the host

All customizations must be prepared on the **host** in the my-resources directory. The path to this directory is configured in the `~/.exegol/config.yml` file (see the [wrapper's config docs](/wrapper/configuration#volumes)) under the `my_resources_path` key. 

By default, this path is `~/.exegol/my-resources/`.

> [!NOTE]
> Throughout this documentation, the default path `~/.exegol/my-resources/` will be used in examples. If you have changed the `my_resources_path` setting in your configuration file, use your custom path instead.

In Exegol containers, the volume is accessible at `/opt/my-resources`.

> [!WARNING]
> The "my-resources" feature will do what it's told to do. If users
> choose to use that feature to replace files or configuration, those
> replacements should take place. So if there are some additions to
> Exegol you're not getting, it could be because you have a
> "my-resources" setup that replaces it.

Below are the features offered by "My-resources", allowing users to
extend Exegol beyond what is initially included ([tools](/images/tools),
[resources](/resources/list)).

- [Custom tools](/images/my-resources#custom-tools): users can place their own custom
  standalone tools, binaries and scripts in the "my-resources" volume on the host.
- [Supported setup](/images/my-resources#supported-setups): a pre-set list of "templated" configurations. The
  most user-friendly approach to customizing Exegol.
- [User setup](/images/my-resources#user-setup): a shell script can be populated with every command a user wishes their containers to run at creation.

## Custom tools

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

You can add executable files in the `~/.exegol/my-resources/bin/` folder. The equivalent container path is added to the `PATH` environment variable so that your binaries can be called easily from anywhere in the container.



## Supported setups

Configuration files stored in the `~/.exegol/my-resources/setup/` directory
on the host will be deployed on the containers and allow users to customize Exegol
even further. By default, the number of officially supported
configuration files is limited, and it depends on the version of the
image itself, not the wrapper.

> [!TIP]
> In order to see what configuration files are supported in your version,
> the `/opt/supported_setups.md` documentation file can be read from any
> container.

This documentation will reference in detail all the supported
customizations available over time, and the corresponding minimum image
version required for each one.

If a user wants to deploy tools and configurations that are not
already prepared here they can use the [User setup](/images/my-resources#user-setup) instead.

### `apt` (packages, sources, keys)

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

A system exists to easily install arbitrary APT packages in any new
exegol container.

- Custom APT **repositories** can be added in exegol by filling in the
  `~/.exegol/my-resources/setup/apt/sources.list` file
- Importing custom repositories usually requires importing **GPG keys**
  as well, which can be done by entering trusted GPG keys download URLs
  in the `~/.exegol/my-resources/setup/apt/keys.list` file
- To install **APT packages** automatically (after updating the
  repository including the custom ones), just enter a list of package
  names in the `~/.exegol/my-resources/setup/apt/packages.list` file

### `bloodhound` (customqueries, config)

> [!NOTE]
> Available from version `3.1.0` of the `ad` and `full` images.


A system exists to easily add one or **several** bloodhound
customqueries files, or change its configuration file in any new exegol
container.

To automatically:

- overwrite the `~/.config/bloodhound/config.json` configuration file,
  simply create the file
  `~/.exegol/my-resources/setup/bloodhound/config.json`
- replace the default exegol customqueries, place one or several valid
  customqueries files into the folder
  `~/.exegol/my-resources/setup/bloodhound/customqueries_replacement/`.
- merge with the default exegol customqueries by placing one or several
  valid customqueries files into the folder
  `~/.exegol/my-resources/setup/bloodhound/customqueries_merge/`

> [!TIP]
> To be considered for replacing or merging, the customqueries files
> must be **valid** and bear the `.json` extension. The file names do
> not matter. The output will be saved into the single file
> `~/.config/bloodhound/customqueries.json`.

### `firefox` (policy)

> [!NOTE]
> Available from version `3.1.6` of any exegol image.

A system exists to easily personalise firefox in any new exegol
container.

You can create your own Firefox policy file and copy it to the location `~/.exegol/my-resources/setup/firefox/policies.json` 
to apply it in the next container deployment 
(https://support.mozilla.org/en-US/kb/customizing-firefox-using-policiesjson).
All available directives can be found here:
https://mozilla.github.io/policy-templates/.

> [!IMPORTANT]
> Your custom policy will overwrite the default policy created by Exegol.

The default policy applied by Exegol will modify the following things:

::: tabs

== 1. Bookmarks

```json
{
  "policies": {
    "ManagedBookmarks": [
      {
        "toplevel_name": "Exegol Bookmarks"
      },
      {
        "url": "https://exegol.readthedocs.io/en/latest/",
        "name": "Exegol Doc"
      },
      {
        "name": "References / Guides",
        "children": [
          {
            "url": "https://www.thehacker.recipes/",
            "name": "THR"
          },
          [...]
          {
            "url": "https://lolol.farm/",
            "name": "LOLOL Farm"
          }
        ]
      }
    ]
}
```

== 2. Extensions

```json
{
  "policies": {
    "ExtensionSettings": {
      "foxyproxy@eric.h.jung": {
        "installation_mode": "force_installed",
        "install_url": "https://addons.mozilla.org/firefox/downloads/latest/foxyproxy-standard/latest.xpi"
      },
      [...]
    }
}
```

== 3. Disable telemetry

```json
{
  "policies": {
    "DisableTelemetry": true,
    "DisplayBookmarksToolbar": "always",
    "UserMessaging": {
      "WhatsNew": false,
      "ExtensionRecommendations": false,
      "FeatureRecommendations": false,
      "UrlbarInterventions": false,
      "SkipOnboarding": true,
      "MoreFromMozilla": false
    }
}
```

== 4. Apply Burp CA

```json
{
  "policies": {
    "Certificates": {
        "Install": ["/opt/tools/firefox/cacert.der"]
    }
}
```
:::

In order to install a specific addon, you can go to the Firefox addon
webpage, and search for the addon GUID in the page HTML source code by
searching for the JSON field `"guid":`, for example for the Dark Reader
addon, the GUID is `addon@darkreader.org`, you can then add the
extension in the JSON file:

``` json
"ExtensionSettings": {  
  "addon@darkreader.org": {  
    "installation_mode": "force_installed",
    "install_url": "https://addons.mozilla.org/firefox/downloads/latest/addon@darkreader.org/latest.xpi"
  },
}
```

To add a bookmark you can add a children to an existing folder in the
`ManagedBookmarks` directive: 

``` json
{
  "url": "https://www.thehacker.recipes/",
  "name": "THR"
}
```
or you can add a new folder:

``` json
{
  "name": "New folder",
  "children": [
    {
      "url": "https://regex101.com/",
      "name": "Regex101"
    }
  ]
}
```

### `firefox` (addons, CA) (deprecated)

> [!WARNING]
> This covers the previous method for personalizing Firefox; the current
> approach uses [firefox policy](#firefox-policy).

> [!NOTE]
> Available from version `3.0.2` to `3.1.5` of any exegol image.

A system exists to easily install arbitrary firefox addons in any new
exegol container.

The `~/.exegol/my-resources/setup/firefox/addons.txt` file allows the user to
list addons to install from online sources. It must be filled with their
links in Mozilla's shop (for example
<https://addons.mozilla.org/fr/firefox/addon/foxyproxy-standard/> ).

The `.xpi` files in `~/.exegol/my-resources/setup/firefox/addons/` folder
will be installed as well.

> [!NOTE]
> Below, available from version `3.2.0` of any exegol image.

The `.der` files in `~/.exegol/my-resources/setup/firefox/CA/` folder will be
trusted.

### `python3` (pip3)

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

A system exists to easily install arbitrary PIP3 packages in any new
exegol container.

The `~/.exegol/my-resources/setup/python3/requirements.txt` file allows the
user to list a set of packages to install with constraints just like a
classic **requirements.txt** file.

### `tmux` (conf)

> [!NOTE]
> Available from version `3.0.0` of any exegol image.


Exegol supports overloading its **tmux** configuration to allow all
users to use their personal configuration.

- To automatically overwrite the `~/.tmux.conf` configuration file,
  simply create the file `~/.exegol/my-resources/setup/tmux/tmux.conf`

> [!TIP]
> It is possible to install **plugins** with the APT customization
> system, details [here](/images/my-resources#apt-packages-sources-keys).

### `vim` (vimrc, configs)

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

Exegol supports overwriting its **vim** configuration to allow all users
to use their personal configuration.

- To automatically overwrite the `~/.vimrc` configuration file, simply
  create the file `~/.exegol/my-resources/setup/vim/vimrc`

- vim configuration folders are also automatically synchronized:  
  - `~/.exegol/my-resources/setup/vim/autoload/*` -\> `~/.vim/autoload/`
  - `~/.exegol/my-resources/setup/vim/backup/*` -\> `~/.vim/backup/`
  - `~/.exegol/my-resources/setup/vim/colors/*` -\> `~/.vim/colors/`
  - `~/.exegol/my-resources/setup/vim/plugged/*` -\> `~/.vim/plugged/`
  - `~/.exegol/my-resources/setup/vim/bundle/*` -\> `~/.vim/bundle/`

> [!TIP]
> It is possible to install **plugins** with
> [the APT customization system](/images/my-resources#apt-packages-sources-keys).

### `neovim` (.config/nvim)

> [!NOTE]
> Will be available from version `3.1.2` of any exegol image.

Exegol supports overwriting its **neovim** configuration to allow all
users to use their personal configuration.

- To automatically overwrite the `~/.config/nvim/` configuration, copy
  your config in `~/.exegol/my-resources/setup/nvim/`

> [!TIP]
> It is possible to install **plugins dependencies** with
> [the APT customization system](/images/my-resources#apt-packages-sources-keys).

### `zsh` (aliases, zshrc, history)

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

To not change the configuration for the proper functioning of exegol but
allow the user to add aliases and custom commands to zshrc, additional
configuration files will be automatically loaded by zsh to take into
account the customization of the user .

- **aliases**: any custom alias can be defined in the
  `~/.exegol/my-resources/setup/zsh/aliases` file. This file is automatically
  loaded by zsh.
- **zshrc**: it is possible to add commands at the end of the zshrc
  routine in `~/.exegol/my-resources/setup/zsh/zshrc` file.
- **history**: it is possible to automatically add history commands at
  the end of `~/.zsh_history` from the file
  `~/.exegol/my-resources/setup/zsh/history`.

> [!TIP]
> It is possible to install **plugins** with the APT customization
> system, details [here](/images/my-resources#apt-packages-sources-keys).

### `arsenal` (cheats)

> [!NOTE]
> Available from version `3.1.5` of any exegol image.

Exegol supports adding a custom cheatsheets file (rst or md file) for
Arsenal (<https://github.com/Orange-Cyberdefense/arsenal>) by moving
them in the folder `~/.exegol/my-resources/setup/arsenal-cheats/`.

> [!TIP]
> You can create a structure with folders if you want some organization

## User setup

> [!NOTE]
> Available from version `3.0.0` of any exegol image.

The `~/.exegol/my-resources/setup/load_user_setup.sh` script is executed on
the first startup of each new container that has the "my-resources"
feature enabled. Arbitrary code can be added in this file, in order to
customize Exegol (dependency installation, configuration file copy,
etc).

> [!WARNING]
> It is strongly advised **not** to overwrite the configuration files
> provided by exegol (e.g. `/root/.zshrc`, `/opt/.exegol_aliases`, ...),
> official updates will not be applied otherwise.

## Permissions

To facilitate its use, a read/write access system **shared** (between
the host user and the container root user) has been implemented.

The wrapper automatically sets up the necessary permissions for the "my-resources" folder. If the current user has sufficient rights, this is done automatically. Otherwise, the wrapper will display a sudo command to be executed manually.

## Troubleshooting

In case of problem, the customization system logs all actions in the
`/var/log/exegol/load_setups.log` file.

If the whole installation went smoothly the log file will be compressed
by gunzip and will have the name `/var/log/exegol/load_setups.log.gz`

> [!TIP]
> Logs in `.gz` format can be viewed directly **without unpacking** them
> with the `zcat`, `zgrep`, `zdiff` or `zmore` command!
