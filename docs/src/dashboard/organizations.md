# Organizations <Badge type="enterprise" />

Organizations provide a way to manage multiple users, teams, subscriptions, and licenses in Exegol. This is primarily designed for businesses or teams that need centralized management of their Exegol resources.

This section is available to **Exegol Enterprise** users. The section's name is the organization name set at checkout. 
Multiple org sections can exist concurrently.

> [!NOTE]
> If you've *only* been assigned an Exegol Enterprise license, but you're not the buyer and haven't been assigned any management role on the org or team(s) resources (i.e., owner, manager, assigner, viewer), you won't see the section. You will *only* see the license in your own personnal section ([My licenses](https://dashboard.exegol.com/licenses))

## Organization sections

Organization management (i.e. the "Manage" page) is divided into four main sections:

- **Licenses**: Manage and assign licenses to users
- **Subscriptions**: View and manage organization subscriptions
- **Teams**: Create and manage teams within your organization
- **Roles**: Manage organization-wide roles and permissions

When Teams are created, the corresponding sub-pages are created inside the Organization section.

### Licenses

Licenses in organizations can be managed directly by the organization, or delegated to specific teams.

::: tabs

=== Change Team

To change which Team manages a license (i.e., allow the Team's manager or assigner to assign the license to someone):

1. Select the license(s) in the Organization's or Team's Licenses section
2. Click "Change team"
3. Select the team that should manage the license
4. Confirm the change

=== Assign License

To directly assign a License to someone:

1. Select the license(s) in the Organization's or Team's Licenses section
2. Click "Assign license"
3. Enter the user's email address.
4. Confirm the change

> [!WARNING]
> Licenses have a reassignment cooldown period of 10 days. After assigning a license to a user, you'll need to wait until the cooldown period ends before you can reassign it to another user. If you need immediate assistance, please contact our Support team through a Discord private ticket and mention the license UUID.

Once a license is assigned to a user, they will be able to see and manage it in the "[My licenses](https://dashboard.exegol.com/licenses)" section. See the corresponding documentation on the matter: [Licenses](licenses).

:::

### Subscriptions

The Subscriptions section allows organization administrators to view and manage all subscriptions associated with the organization.

The subscriptions table is very similar to the "My subscriptions" one (see the [subscriptions](subscriptions) docs).

Organization **owners** can manage subscriptions through the billing portal:

1. Find the subscription in the table
2. Click the "Billing portal" action in the Actions column
3. In the billing portal, you can:
   - Update payment methods
   - Change the number of seats (billing will be adjusted proportionally for the remainder of the billing cycle.)
   - View invoices and billing history
   - Cancel or renew subscriptions

### Teams

The teams table shows the list of Teams in the Organization, allows Owners/Managers to rename or remove them, and add others.

When a Team is created, a sub-page is created for it, with the Licenses and Roles sections.

The Teams sub-pages feature two sections: Licenses (similarly to the Organization's [#licenses](#licenses) section), and Roles (similarly to the Organization's [#roles](#roles) section).

The main difference resides in the fact that Teams can't have an "Owner", as this is a role assigned at the Organization level only.

### Roles

The Roles section allows organization administrators to manage who has administrative access to the organization and at what permission level.

> [!IMPORTANT]
> It's crucial to understand that the Roles section is specifically for assigning administrative permissions within the dashboard. These roles determine who can manage the organization, its teams, licenses, and subscriptions.
> 
> This should not be confused with "team members" or "users" in the operational sense. Adding someone as a Manager or Viewer in the Roles section doesn't automatically make them a license user or give them access to Exegol features - it only gives them administrative capabilities in the dashboard.

For example:
- A person might be an "Owner" in the Roles section with full administrative rights, but might not actually use Exegol themselves
- Conversely, someone might be an active Exegol user with an assigned license but have no administrative role in the dashboard

To give someone access to use Exegol, you need to assign them a license through the Licenses section. To give someone administrative capabilities to manage the organization, you add them through the Roles section.

Organizations have four permission levels:

- **Owner**: Can manage everything in the organization, including subscriptions and billing.
- **Manager**: Can manage licenses, teams, and assign roles.
- **Assigner**: Can assign licenses to users. Can't change teams and roles.
- **Viewer**: Can read licenses, teams, members. Can't make changes.

> [!WARNING]
> The Owner role grants full access to the billing page. Owners can add or remove seats, change payment methods, and cancel subscriptions for all subscriptions bought by the same customer account.

:::tabs
==== Adding members

To add *administrative* members to your organization:

1. Navigate to the **Roles** section
2. Click the "Invite member" button
3. Enter the member's email and select their role
4. Send the invitation

==== Changing roles

To change a member's role:

1. Find the member in the table
2. Click the "Edit" action in the Actions column
3. Select a new role for the member
4. Confirm the change
:::

## Misc

### Renaming an Organization

To rename your organization:
1. Click the dropdown menu next to the organization name at the top of the page
2. Select "Rename organization"
3. Enter a new name
4. Save the changes

### Abandoning Roles

If you want to leave an organization or team (in the administrative sense):
1. Click the dropdown menu next to the organization/team name
2. Select "Abandon role in organization/team"
3. Confirm your decision

> [!IMPORTANT]
> Organization owners cannot abandon their role if they are the only owner. Transfer ownership to another user first and have them remove you. Note that abandoning a role only removes your administrative access to the organization - it does not revoke your license if you have one. To have your license revoked, you'll need to contact a team or organization administrator.

