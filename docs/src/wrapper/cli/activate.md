# `activate` action <Badge type="pro"/> <Badge type="enterprise"/>

The `activate` action is used to activate Exegol with a valid Pro/Enterprise license. This action is required to use
Exegol in a professional environment. Without activation, Exegol will run in Community edition mode with limited
features.


## Default activation

This is the default interactive activation method (online, interactively).

1. Run `exegol activate`
2. The wrapper will prompt you to enter your Exegol email address
3. You will need to generate a login token from the Exegol dashboard [OTP](https://dashboard.exegol.com/otp) page
4. Enter the token when prompted
5. Select which license to activate

## Unattended activation

You can activate Exegol without any interactive prompts (e.g. for automation, CI/CD, or remote setup).

1. Create and save an API key from the Exegol dashboard "[Settings](https://dashboard.exegol.com/settings)" page. See the [API keys docs](/dashboard/settings#api-keys) for more info. **The key is shown only once at creation**.
2. Retrieve the License ID you want to activate, from the Exegol dashboard "[My licenses](https://dashboard.exegol.com/licenses)" page. The ID can be copied from the three-dots menu in the Action column.

Use the following command, replacing the placeholders with your API key and license ID:

```bash
exegol activate --accept-eula --api "$API_KEY" --license-id "$LICENSE_ID"
```

Alternatively, if you set the `EXEGOL_API_KEY` and `EXEGOL_LICENSE_ID` environment variables, you can run without arguments:

```bash
exegol activate --accept-eula
```

## Offline option <Badge type="enterprise"/>

The **offline mode** is a paid option of the **Exegol Enterprise** tier. Licenses with that option are not affected by the usual 7-days offline limit. They can be activated like other standard Licenses with both [Default activation](#default-activation) or [Unattended activation](#unattended-activation) methods described above.

This option can also prove useful for machines that will never be connected to the Internet, as they can be activated using the dedicated offline activation procedure described below.

1. Run `exegol activate --offline` on the offline machine, and retrieve the "Activation ID"
2. On an Internet-connected machine, open the Exegol dashboard "[My licenses](https://dashboard.exegol.com/licenses)" page, identify the "Offline" license to activate, then click "Offline Enrollment" in the three-dots menu from the Actions column
3. Fill in the form with the Activation ID, set an OS and name for the machine
3. Download the resulting `license.key` file and place it on the offline machine at `~/.exegol/license.key`

Once the license key is in place, the offline machine will be considered activated without needing any Internet access. 

> [!INFO]
> This activation procedure is meant for machines that will never be connected to the Internet. They won't be able to download Exegol images.
>
> To install Exegol images on a fully offline machine, use the procedure described in [Transferring images to an offline machine](/tips-and-tricks#transferring-images-to-an-offline-machine): activate and pull the image on an Internet-connected station, export it with `docker save`, transfer the archive, then load it on the offline machine with `docker load` and run `exegol info` to verify.

## Options

| Option          | Description                                                          |
|-----------------|----------------------------------------------------------------------|
| `--accept-eula` | Non-interactively accept the EULA                                    |
| `--offline`     | Show the activation ID of the current machine for offline activation |
| `--api`         | API key for unattended activation (or set `EXEGOL_API_KEY` env var)  |
| `--license-id`  | License ID to activate (or set `EXEGOL_LICENSE_ID` env var)          |
| `--revoke`      | Revoke your local Exegol license                                     |

## Command examples

```bash
# Activate Exegol interactively
exegol activate

# Activate Exegol non-interactively
exegol activate --accept-eula --api "$API_KEY" --license-id "$LICENSE_ID"

# Revoke current license
exegol activate --revoke
```