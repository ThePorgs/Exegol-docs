# Organizations <Badge type="enterprise" />

Organizations are how Enterprise accounts manage teams, members, subscriptions and licenses. The sidebar entry is the organization name set at checkout. Several org sections can exist at once.

> [!NOTE]
> An account that only holds an assigned Enterprise license, and has no org or team role (owner, manager, assigner, viewer), does not see this section. The license is only on [My licenses](/dashboard/licenses).

## Organization sections

The Manage page is split into four panels:

- **Licenses**: assign licenses to users, or hand them to a team
- **Subscriptions**: org subscriptions and billing
- **Teams**: create and manage teams
- **Roles**: who can administer the org

Creating a team adds a sub-page under the organization.

### Licenses

Licenses can be managed on the organization, or delegated to a team.

::: tabs

=== Change Team

To let a team's manager or assigner assign a license:

1. Select the license(s) in the organization's or team's Licenses panel
2. Click **Change team**
3. Select the team
4. Confirm

=== Assign License

To assign a license to someone directly:

1. Select the license(s) in the organization's or team's Licenses panel
2. Click **Assign license**
3. Enter the user's email address
4. Confirm

> [!WARNING]
> Reassignment has a 10-day cooldown after a license is assigned. To reassign sooner, open a Discord private ticket and include the license UUID.

Once assigned, the user sees and manages the license on [My licenses](/dashboard/licenses).

:::

### Subscriptions

The subscriptions table matches [My plan](/dashboard/my_plan), for org-owned subscriptions.

Organization **owners** open the billing portal from Actions:

1. Find the subscription
2. **Billing portal** in the Actions column
3. From the portal: payment methods, seat count (prorated for the rest of the cycle), invoices, cancel or renew

### Teams

The teams table lists teams. Owners and managers can rename or remove them, and add new ones.

A new team gets a sub-page with Licenses and Roles, same idea as the org panels. Teams have no Owner role; that exists only at organization level.

### Roles

Roles are dashboard permissions: who can manage the organization, its teams, licenses and subscriptions.

> [!IMPORTANT]
> A role is not a license. Adding someone as Manager or Viewer does not give them Exegol. Assign a license for that. An Owner might never run Exegol; a licensed user might have no admin role.

Organizations have four permission levels:

- **Owner**: everything, including subscriptions and billing
- **Manager**: licenses, teams, and role assignment
- **Assigner**: can assign licenses. Cannot change teams or roles
- **Viewer**: read licenses, teams, members. Cannot change anything

> [!WARNING]
> Owner can reach the billing page for every subscription bought on that customer account: seats, payment methods, cancel.

:::tabs
==== Adding members

To add *administrative* members:

1. Open **Roles**
2. Click **Invite member**
3. Enter the email and choose a role
4. Send the invitation

==== Changing roles

1. Find the member in the table
2. **Edit** in the Actions column
3. Choose the new role
4. Confirm
:::

## Misc

### Renaming an organization

1. Open the dropdown next to the organization name
2. Select **Rename organization**
3. Enter the new name
4. Save

### Abandoning roles

To leave an organization or team in the administrative sense:

1. Open the dropdown next to the organization or team name
2. Select **Abandon role in organization/team**
3. Confirm

> [!IMPORTANT]
> The last owner cannot abandon. Transfer ownership first and have the new owner remove the old one. Abandoning a role does not revoke a license. Ask a team or organization administrator for that.
