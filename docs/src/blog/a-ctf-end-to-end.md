---
title: A CTF, end to end
date: 2026-09-28
author: Félix Billières
description: A concrete look at a single CTF session run entirely in Exegol Studio, from creating the container to exporting a kill chain. A snapshot of what the first version of Studio feels like in practice.
sidebar: false
tags:
  - studio
  - ctf
  - active-directory
  - workflow
  - ai
---

# A CTF, end to end

This walkthrough follows a CTF session in Exegol Studio, from creating the container to exporting a record of the work. Along the way, you will use the shell and file Explorer, share terminal output with the agent, look up documentation and adjust how the agent explains things.

The screenshots come from [VulnCicada](https://app.hackthebox.com/machines/VulnCicada), a Windows Active Directory machine on [Hack The Box](https://www.hackthebox.com/). You can follow the same workflow with another CTF target. The focus here is on using Studio throughout a session; the target's exploitation steps are left to [the writeup](https://felixbillieres.github.io/posts/htb-vulncicada-exegol-studio/).

## Before you start

Complete [Getting started](/studio/getting-started) so Studio has a working model provider and can connect to Exegol. Have your CTF instance and its VPN configuration ready, if the platform requires one. The addresses and filenames in the screenshots belong to this example session.

| Task | Feature |
| ---- | ------- |
| Keep the session and files together | [Projects](/studio/interface/projects) and [Containers](/studio/interface/containers) |
| Reuse a procedure | [Skills](/studio/knowledge/skills) |
| Follow commands and read their output | [Monitor layout](/studio/interface/layouts#the-three-layouts) |
| Work with files and a shell | [Editors and tabs](/studio/interface/editors) |
| Share an error or a file with the agent | [Composer mentions](/studio/interface/composer#mentions) |
| Look up documentation | [Atlas](/studio/knowledge/atlas) |
| Ask for more explanation | [Mentor persona](/studio/behavior/personas) |
| Save the path through the challenge | [Kill chains](/studio/behavior/kill-chains) |

## 1. Create the container

Open Settings → **Containers** and open the new-container form. You can also link a container you already started with the Exegol wrapper.

For a new container:

1. Give it a recognisable name. This session uses `HackTheBox`.
2. Select the Exegol image you want to use.
3. Choose the network configuration and attach the platform's `.ovpn` or `.conf` file under **[VPN config](/wrapper/cli/start#vpn)**, if needed.
4. Enable **[desktop (RDP/VNC)](/wrapper/cli/start#graphical-desktop)** if you expect to use graphical tools.
5. Create the container and follow the wrapper prompts in the terminal.

![The new-container form with the name, VPN configuration and desktop option highlighted.](/assets/blog/studio/handson_container_create.png)

The screenshot uses **Host** networking, which shares the host's network namespace. A separate container keeps the tools and working files together, but this network mode does not isolate its VPN traffic from the host.

The desktop option is optional for this walkthrough. If enabled, it gives you a graphical session you can open later in a Studio tab. See [Containers](/studio/interface/containers) for container management and [Container desktop](/studio/interface/editors#container-desktop) for the graphical session.

## 2. Create a project and link the container

Under Settings → **Projects**, select **New project** and give it a name. Open the project and link the running container. In this session, both are named `HackTheBox`, which makes them easy to recognise in the interface.

![The HackTheBox project with its linked container marked PRIMARY.](/assets/blog/studio/handson_project_primary.png)

With one container linked, it is the **primary** container. Studio uses it to run tools and store project data. The project also groups your conversations, kill chains and project-specific harness settings.

Check that the intended project is selected in the sidebar before starting a conversation. If you work with several containers, review which one is marked primary; you can change it without recreating the project.

The [project's workspace](/studio/interface/projects#host-paths-and-files) appears in the Explorer. You can also link host folders, so a project should not be treated as a guarantee that only container files are accessible. Mounted paths and enabled integrations affect what is available.

## 3. Add a skill to the harness

Open Settings → **Harness** → **Skills**. Expand **Available skills** to see the presets you can add. In the example, the user added **recon** at global scope.

![The available-skills list, with the recon preset and Add to Global button highlighted.](/assets/blog/studio/handson_skill_add.png)

Choose where the skill belongs:

- **Global** makes it available across projects, useful for a procedure you regularly reuse.
- **Project** keeps it with the current engagement, useful for a task specific to that lab.

After adding it, check that it appears in the enabled list. User-invocable skills also appear when you type `/` in the composer. The next screenshot shows the installed skill and its slash command in the example session.

![The recon skill enabled in the harness and referenced as a slash command in the composer.](/assets/blog/studio/handson_skill_command.png)

A [skill](/studio/knowledge/skills) supplies a procedure. It does not replace the instructions you give for the session or the project's approval policy. If a skill is missing from the `/` menu, check its **User-invocable** setting.

## 4. Follow the run in Monitor

Open **Configure** in the composer and choose **Monitor** under Layout. The menu also gives you access to mode, persona, approval and speed settings.

![The Configure menu with Monitor selected from the layout options.](/assets/blog/studio/handson_layout_menu.png)

These controls serve different purposes. The [layout](/studio/interface/layouts#the-three-layouts) determines where the conversation and output appear. The [mode](/studio/behavior/modes) and [approval policy](/studio/behavior/approvals) determine what can run and when the agent hands control back.

In Monitor, the editor area displays commands and their raw output, with the conversation beside it. You can inspect a result as it arrives instead of relying only on the agent's summary.

![Monitor showing the recon commands and their output beside the conversation.](/assets/blog/studio/handson_monitor.png)

Monitor is not an interactive shell. It displays the agent's execution; you will open a separate terminal when you want to type commands yourself.

> [!TIP] Make the output easier to follow
> Choose **Step** or **Human** under Configure → **Speed** if the text appears too quickly. Speed changes how received text is displayed. It does not slow down the model or the commands running in the container.

### Read the recap alongside the output

In this session, the user stopped after the initial enumeration and reviewed the results in chat. The recap collected the ports, host information and questions that remained open. Network scans and service probes are active enumeration, even when limited to discovery.

![The recon recap with the service table and notes about the host information.](/assets/blog/studio/handson_recap.png)

Ask the agent to distinguish observations from assumptions, especially when a service banner is ambiguous or a command times out. For example:

> Summarise the results already saved in the workspace. Separate confirmed observations from things we still need to check, and include the relevant filenames.

Keeping the filenames in the recap makes it easier to revisit the original output later. Use **Chat** layout when you want more room for a long explanation; the conversation stays the same when you switch layouts.

## 5. Open a shell and continue manually

Open the container tools menu near the top of the Studio sidebar and select **Terminal** under the primary container. The screenshot shows the `HackTheBox` shell opening in an editor tab.

![The container tools menu with Terminal highlighted and the resulting shell open beside it.](/assets/blog/studio/handson_shell.png)

This [container shell](/studio/interface/editors#container-shell) uses the same filesystem as the agent. Files saved under `/workspace` are available from both the shell and the project workspace. You can review saved output, organise files or take over a task manually without starting a separate environment.

The menu also includes the graphical desktop and supported tool tabs. The desktop requires the option selected during container creation; it is an interface for you to use, and the agent does not drive it. See [Editors and tabs](/studio/interface/editors) for the available surfaces.

Before changing files the agent is using, let its current operation finish or stop the run. When you return to chat after manual work, share the relevant output so the agent can account for what changed.

## 6. Give the agent the terminal context

During the example session, an NFS mount failed. The user typed `@` in the [composer](/studio/interface/composer#mentions), selected the terminal tab and asked for help. That supplied the terminal output as context for the next message.

![A terminal tab mentioned in chat so the agent can read the mount error.](/assets/blog/studio/handson_mention.png)

Include what you expected as well as the error:

> I expected this command to make the files available locally. Explain the error in this terminal. What does the output establish, and what information is missing? Don't run anything yet.

Here, the discussion turned to mount restrictions in the container. The error helped distinguish a local environment problem from a problem reaching the target, although it did not establish the exact cause by itself.

Terminal mentions are also useful after a manual command succeeds. They give the agent the result you are looking at, without requiring you to retype it. For a short excerpt, you can send just a selection, as shown below.

## 7. Browse the workspace and share a selection

Open the VS Code **Explorer** and expand the folder associated with the project's container. Browse the files saved during the session, then click one to open it in an editor tab.

In the screenshot, the user expands the `loot` folder and opens `marketing.png`. The image preview and directory tree are visible together, making it possible to inspect the downloaded file without leaving Studio.

![The Explorer showing the container workspace, with marketing.png opened from the loot folder.](/assets/blog/studio/handson_filesystem.png)

The same workflow applies to text output and notes. Keep the original results in the workspace and write down your interpretation separately, so you can return to the evidence if a later step contradicts it. **Editor** layout leaves the conversation beside these files.

### Send only the relevant lines

When a terminal contains more output than the question needs, select the relevant lines, right-click and choose **Add Terminal Selection to Chat**. A context chip appears above the composer. Add your question before sending.

![Selected terminal lines added to chat through the context menu, with a context chip visible in the composer.](/assets/blog/studio/handson_terminal_selection.png)

In the example, the selection contains a directory listing. A useful request for this kind of input is:

> Turn this listing into a short inventory for my notes. Keep the filenames as shown and don't infer what the files contain.

Use **Add Selection to Chat** for a text selection in an editor. To reference an entire file, type `@` and select its path. File and terminal mentions provide context for your message; opening a file in the Explorer alone does not ask the agent to read it.

## 8. Look up an unfamiliar term with Atlas

An unfamiliar share name led to a question about Active Directory Certificate Services during the example session. The agent consulted [Atlas](/studio/knowledge/atlas) while answering.

![The agent consulting Atlas while explaining an unfamiliar share name from the session.](/assets/blog/studio/handson_atlas_lookup.png)

Atlas holds documentation indexed for the agent to search and read. Bundled sources are available without setup. Ask for a lookup in plain language:

> Check the available Atlas documentation for this term. Explain what it means and show me the source you used.

There is no `@atlas` mention or `/atlas` command. The agent chooses when to query Atlas, and an explicit request can direct it to the available references.

Open Settings → **Atlas** → **Open the constellation** to inspect the indexed documentation yourself. The graph shows pages and their relationships, which helps when you want to see what else a reference connects to.

![The Atlas constellation showing related documentation pages.](/assets/blog/studio/handson_atlas.png)

Browsing the constellation does not attach its pages to the conversation. Page extracts enter the model's context when the agent reads them. Use [Briefs](/studio/knowledge/briefs) if you want to attach a reference document explicitly.

Paid plans also support importing your own references, such as a tool's documentation site. Check that the source matches the version you are using. Having documentation available makes the answer easier to verify, but does not guarantee that the agent interprets it correctly.

## 9. Switch to Mentor for a fuller explanation

If the answer assumes knowledge you do not yet have, open Configure → **Persona** and select **Mentor**. In this session, the user made the change while trying to understand certificate services.

![The persona menu with Mentor highlighted.](/assets/blog/studio/handson_persona_menu.png)

Then tell the agent where you need help:

> I'm unfamiliar with this concept. Explain the terms first, then relate them to the output we already have.

The next screenshot shows the explanation after changing persona. Asking about a specific gap makes the response more useful than requesting a general introduction to the whole subject.

![The Mentor response explaining certificate services and relating the concepts to the session.](/assets/blog/studio/handson_mentor.png)

The [persona](/studio/behavior/personas) changes working style and depth of explanation. It does not change tool permissions or bypass approvals. For a discussion with no tool use, select **Answer** mode. If the explanation needs a documentation lookup, use a mode that allows those tools; Answer cannot perform the lookup.

You can switch back to a shorter working style when you are ready to continue. There is no need to start a new conversation or recreate the project.

## 10. Review and export the session graph

Use `@killchain` in the composer to ask the agent to reconstruct or update the path from the evidence in the workspace. Include failed attempts and unresolved ideas as well as successful steps. You can do this during the session, then update the graph before finishing.

![The kill-chain request in chat and the graph opened in a Studio tab.](/assets/blog/studio/handson_killchain_build.png)

The mention asks the agent to work on the chain; it does not open the viewer directly. Open the result from its tool card in chat, or from Settings → **Kill chains**.

Review the [node statuses](/studio/behavior/kill-chains#status):

- **Confirmed** steps should have supporting evidence.
- **Hypothesis** marks an idea that has not been established.
- **Failed** records an attempt that did not work.

Click nodes to inspect their evidence and correct any gaps or mistaken connections. The graph is an agent-generated account of the session, so review it as you would a written recap. Failed branches are useful when you return to the challenge and need to remember what you already tried.

Arrange the view and use **Export PNG** to save it with your notes or a writeup. The following image is the exported result from this session.

![The exported PNG of the session's kill chain.](/assets/blog/studio/handson_killchain.png)

Export is available on every plan; Community exports may include a watermark. Check the visible credentials and flag values before sharing the image.

## Continue with your next CTF

By this point, you have a project containing the session history, the working files and a graph of the work. Keep findings in the workspace as you go so you can resume without relying on chat history alone.

Reuse the parts that helped: a [skill](/studio/knowledge/skills) for a recurring task, [Atlas](/studio/knowledge/atlas) for references, or a [brief](/studio/knowledge/briefs) for notes you want to attach explicitly. Keep [project rules](/studio/knowledge/rules) specific to the lab. On the next challenge, you can use the same combination of manual work, shared context and documentation with a fresh project.

> [!TIP] Want the full exploitation path?
> This article stays on the Studio workflow and leaves out the target's exploitation steps. If you would like the detailed writeup of this machine, solved with Exegol Studio, read it here: [Pwning VulnCicada with Exegol Studio](https://felixbillieres.github.io/posts/htb-vulncicada-exegol-studio/).
