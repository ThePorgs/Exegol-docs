# `activate` action <Badge type="pro"/> <Badge type="team"/> <Badge type="enterprise"/>

The `activate` action is used to activate Exegol with a valid Pro, Team or Enterprise license. This action is required to use
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
2. Retrieve the License ID to activate. On Pro that is [My plan](/dashboard/my_plan); on Team or Enterprise that is [My licenses](/dashboard/licenses). The ID can be copied from the three-dots menu in the Action column.

Use the following command, replacing the placeholders with your API key and license ID:

```bash
exegol activate --accept-eula --api "$API_KEY" --license-id "$LICENSE_ID"
```

Alternatively, if you set the `EXEGOL_API_KEY` and `EXEGOL_LICENSE_ID` environment variables, you can run without arguments:

```bash
exegol activate --accept-eula
```

## Offline option <Badge type="enterprise"/><Badge type="add-on"/>

The **offline mode** is a paid option of the **Exegol Enterprise** tier. Licenses with that option are not affected by the usual 7-days offline limit.

Depending on whether the machine can reach the Internet at least once, two activation scenarios are possible.

### Machine with initial Internet access

If the machine has Internet access at first, activate it like any other license, with either the [Default activation](#default-activation) (`exegol activate` + login with an OTP token) or the [Unattended activation](#unattended-activation) method described above.

While still connected, the machine can download the Exegol images by itself (e.g. `exegol install full`).

The machine can then be disconnected from the Internet: thanks to the offline option, the license will remain active without any time limit.

### Machine never connected to the Internet

Machines that will never be connected to the Internet can be activated using the dedicated offline activation procedure described below.

1. Run `exegol activate --offline` on the offline machine, and retrieve the "Activation ID"
2. On an Internet-connected machine, open [My licenses](/dashboard/licenses) in the Exegol dashboard, identify the "Offline" license to activate, then click "Offline Enrollment" in the three-dots menu from the Actions column
3. Fill in the form with the Activation ID, set an OS and name for the machine
4. Download the resulting `license.key` file and place it on the offline machine at `~/.exegol/license.key`

Once the license key is in place, the offline machine will be considered activated without needing any Internet access.

> [!WARNING]
> A machine activated with this procedure will never be able to download Exegol images by itself.
>
> The images must be transferred from another activated, Internet-connected machine, using the procedure described in [Transferring images to an offline machine](/tips-and-tricks#transferring-images-to-an-offline-machine): activate and pull the image on an Internet-connected station, export it with `docker save`, transfer the archive, then load it on the offline machine with `docker load` and run `exegol info` to verify.

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