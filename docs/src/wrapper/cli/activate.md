# `activate` action <Badge type="pro"/> <Badge type="enterprise"/>

The `activate` action is used to activate Exegol with a valid Pro/Enterprise license. This action is required to use
Exegol in a professional environment. Without activation, Exegol will run in Community edition mode with limited
features.

When activating Exegol, you will need:

1. A valid Exegol account (email)
2. An active license assigned to your account
3. Internet access to connect to the license server

> [!NOTE] Offline Activation
>
> If you need to activate Exegol in an offline environment, please contact us directly. We may be able to provide
> offline activation solutions on a case-by-case basis for specific clients.

## Activation process

1. The wrapper will prompt you to enter your Exegol email address
2. You will need to generate a login token from the Exegol dashboard [/otp](https://dashboard.exegol.com/otp) page
3. Enter the token when prompted
4. If you have multiple licenses, you will be presented with a list to choose from
5. If the selected license is already in use on another machine, you will be asked if you want to revoke it from that
   machine
6. Once activated, the license will be bound to your current machine

> [!WARNING] Important
>
> You can only have one active license per machine at a time. If you want to activate a different license, you must
> first revoke the current one using the `--revoke` option.

## Options

| Option     | Description                      |
|------------|----------------------------------|
| `--revoke` | Revoke your local Exegol license |

## Command examples

```bash
# Activate Exegol interactively
exegol activate

# Revoke current license
exegol activate --revoke
```