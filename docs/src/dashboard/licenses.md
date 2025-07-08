# Licenses

The Licenses page allows you to manage your **Exegol Pro and Enterprises** licenses, view and change which devices are activated.

For each license, you can see:

- Type (Pro or Enterprise)
- Organization behind the Enterprise license (Enterprise only)
- Team you're in (Enterprise only)
- Status (active/expired/disabled)
- The machine name and type (Windows, macOS, Linux)
- Validity
- Actions available

> [!TIP]
> Additional fields can be shown through the "View" options menu, especially for debug purposes if something doesn't work and you reach out to Support.

The table provides a clear view of which devices are currently using your licenses, making it easy to manage your license quota.

> [!NOTE]
> Each license is tied to a specific machine. If you need to use Exegol on a new device, you'll need to activate a license for it.

## Managing Licenses

### Rename a Machine

You can rename a machine associated with a license to make it more identifiable:

1. Find the machine in the licenses table
2. Click the "Rename" action in the Actions column
3. Enter a new name for the machine
4. Confirm the change

### Revoke a License

If you no longer use Exegol on a particular machine, you can revoke its license to free it up for another device:

1. Find the machine in the licenses table
2. Click the "Revoke" action in the Actions column
3. Confirm the revocation

> [!WARNING]
> Licenses have a revokation cooldown period of 10 days. After enrolling a license on a machine, you'll need to wait until the cooldown period ends before you can revoke it and enroll it elsewhere. If you need immediate assistance, please contact our Support team through a Discord private ticket and mention the license UUID.

## Activating a New License

To activate Exegol on a new machine:

1. Install and set up Exegol on the new machine
2. Run the command `exegol activate` in your terminal
3. Follow the on-screen prompts to authenticate and activate your license

The newly activated machine will then appear in your licenses table.

