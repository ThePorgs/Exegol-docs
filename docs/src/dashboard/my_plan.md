# My plan <Badge type="pro" />

My plan is the Pro account screen: the subscription (seats, billing) and the licenses on that subscription (which machines are activated).

Enterprise seats and billing are on [Organizations](/dashboard/organizations). Enterprise licenses assigned to the logged-in user are on [My licenses](/dashboard/licenses).

> [!TIP]
> Extra columns can be shown from the View menu. Useful when something fails and a support ticket needs identifiers.

## Subscription

The price in the table is the list price for that tier, before discounts. The amount charged is in the billing portal.

Open the billing portal from the Actions menu on the far right of the table. From there: payment method, seat count, invoices, cancel or renew.

> [!NOTE]
> Pro is limited to one subscription with up to 2 seats. More seats means [Enterprise](https://exegol.com/pricing).

### Adding a subscription

1. Click **Add subscription** in the top-right corner
2. Choose Pro or Enterprise on the pricing page

> [!WARNING]
> A second Pro subscription is refused. Add a seat to the existing Pro plan (up to 2), or move to Enterprise.

Plans and what they include are on [exegol.com/pricing](https://exegol.com/pricing).

## Licenses

Each Pro license is tied to one machine. A new device needs its own activation.

For each license the table can show:

- Type (Pro)
- Options
- Status (active, expired, disabled)
- Machine name and OS (Windows, macOS, Linux)
- Validity
- Actions

The table is the list of devices currently consuming the seat quota.

### Rename a machine

1. Find the row in the licenses table
2. **Rename** in the Actions column
3. Enter the new name and confirm

### Revoke a license

Revoking frees the seat for another device.

1. Find the row in the licenses table
2. **Revoke** in the Actions column
3. Confirm

> [!WARNING]
> Revocation has a 10-day cooldown after enrollment. To revoke sooner, open a Discord private ticket and include the license UUID.

### Activate on a new machine

1. Install Exegol on the machine
2. Run `exegol activate`
3. Follow the prompts

See [activate](/wrapper/cli/activate). The machine then appears in the licenses table.
