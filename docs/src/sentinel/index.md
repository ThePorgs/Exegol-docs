# Exegol Sentinel overview <Badge type="new"/><Badge type="enterprise"/><Badge type="add-on"/>

Exegol Sentinel records every interactive command an operator types in an Exegol container. Each finished command becomes one structured event on the Docker host. A [profile](/sentinel/profiles/concepts) can also collect extra evidence (environment dumps, packet captures, Kerberos caches, follow-up commands) when a rule matches.

It is built for structured teams, purple teaming, and any engagement that needs a defensible record of what was run. Reconstructing that afterwards from memory, notes and terminal scrollback is expensive and incomplete. Sentinel produces the record as a side effect of the operator working normally: no wrapping, no extra logging step, no discipline to maintain under time pressure.

It does not prevent, detect or block anything. An event is only as complete as the [capture boundary](/sentinel/siem/artifacts-limitations#command-coverage) allows.

Enable it at [container creation](/sentinel/getting-started) and the stream sits on the host in a group-readable directory a SIEM agent can already reach.

## What you get

- One JSON object per finished interactive command, not a copy of the terminal.
- The command twice: as typed, and alias-resolved with environment variables expanded, because the two are frequently different and only one of them says what actually ran.
- Start and end times, working directory, container identity, exit code.
- The environment variables the command actually referenced, with values masked when the profile says so.
- A join key to any artifacts a rule collected for that command.
- A unique event id, so re-reading the file after an agent restart cannot duplicate events in the destination.

The [Log schema reference](/sentinel/siem/log-schema) defines every field and is the contract a parser is written against.

## Where it lands

The default host path is `~/.exegol/sentinel/`, overridable with `volumes.sentinel_path` in `~/.exegol/config.yml`. One subdirectory per container instance:

```text :scroll
~/.exegol/sentinel/
└── exegol-{container_tag}_{timestamp}/
    ├── logs.json      # structured stream (NDJSON)
    └── artifacts/     # evidence, if a profile rule collected any
        └── {artifact_id}/
```

With no profile, Sentinel records command events and collects nothing else. The `artifacts/` branch fills only when a profile with matching rules is active. Evidence collection is something a profile asks for, not a default.

The tree is group-readable, not world-readable. A log-shipping agent that is a member of the configured group reads the stream and the artifacts without running as the operator and without any privilege on the container. Which group that is comes from [Configuration](/sentinel/configuration).

## Availability

> [!INFO] <Badge type="enterprise"/><Badge type="add-on"/>
> Exegol Sentinel is a paid Enterprise add-on. For organizations that need an auditable record of every command run during an engagement, contact us for a quote. [Getting started](/sentinel/getting-started) walks through enabling it on a container.

Asking for Sentinel on a session that is not entitled to it does not fail the command. When the session has no Enterprise access, or has Enterprise access without the Sentinel feature, a warning is printed and the container is created without Sentinel rather than the creation being refused. The container works normally and simply produces no audit record. The symptom is an empty Sentinel path rather than an error.

### Profile authoring and ingest help <Badge type="enterprise"/><Badge type="add-on"/>

The pages in this section are enough to write a profile source and to paste a Filebeat or Splunk configuration. That work is also offered as a paid Enterprise service: we write the triggers, actions and profiles with you, and we help stand up ingest and analysis in the SIEM you already run. Contact us for a quote.

## Related pages

First use and operations:

- [Getting started](/sentinel/getting-started): enable Sentinel on a container, find its event stream on the host, and produce a first artifact.
- [Configuration](/sentinel/configuration): a working `~/.exegol/config.yml` block and the command-line options.
- [Security considerations](/sentinel/security): what a profile can execute in the container, what leaves it, and what the record does not cover.

Profiles decide what is collected beyond the command events themselves:

- [Concepts](/sentinel/profiles/concepts): triggers, actions and rules, how a name resolves to a definition, and the profile-level configuration block.
- [Triggers](/sentinel/profiles/triggers): every condition a rule can match on.
- [Actions](/sentinel/profiles/actions): every kind of evidence a rule can collect.
- [Sources and updates](/sentinel/profiles/sources): where profiles come from, how a source is declared and pinned, and how it is fetched.

The SIEM integration branch is the ingest contract:

- [Log schema reference](/sentinel/siem/log-schema): every field an event can carry.
- [Field mappings](/sentinel/siem/field-mappings): Sentinel fields to ECS and to the Splunk Common Information Model.
- [Ingest configuration](/sentinel/siem/ingest-configuration): Filebeat and Splunk Universal Forwarder configurations to paste.
- [Artifacts and limitations](/sentinel/siem/artifacts-limitations): on-disk layout of collected evidence, and what the arrangement does not do.
