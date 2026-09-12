# My licenses <Badge type="team" /> <Badge type="enterprise" />

My licenses lists the Team and Enterprise licenses assigned to the logged-in user, and which machines those licenses are enrolled on.

Assignment, seats and (Enterprise) subteams are on [Organizations](/dashboard/organizations). That section is hidden if the account only holds an assigned license and has no org or team role (owner, manager, assigner, viewer). Pro subscriptions and Pro licenses are on [My plan](/dashboard/my_plan).

> [!TIP]
> Extra columns can be shown from the View menu. Useful when something fails and a support ticket needs identifiers.

For each license the table can show:

- Type (Team or Enterprise)
- Options (for example Offline)
- Organization
- Team
- Status (active, expired, disabled)
- Machine name and OS (Windows, macOS, Linux)
- Validity
- Actions

Each license is tied to one machine. A new device needs its own activation.

## Rename a machine

1. Find the row in the table
2. **Rename** in the Actions column
3. Enter the new name and confirm

## Revoke a license

Revoking frees the license for another device.

1. Find the row in the table
2. **Revoke** in the Actions column
3. Confirm

> [!WARNING]
> Revocation has a 10-day cooldown after enrollment. To revoke sooner, open a Discord private ticket and include the license UUID.

## Activate on a new machine

1. Install Exegol on the machine
2. Run `exegol activate`
3. Follow the prompts

See [activate](/wrapper/cli/activate). The machine then appears in the table.

Offline enrollment (never-connected machines) is also done from this page. See [Offline option](/wrapper/cli/activate#offline-option).
