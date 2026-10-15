# Composer

The composer is where you write your prompts. The toolbar picks the model and the servers. **Quick settings** set how this conversation runs, as its own copy of your defaults. While a run is in progress, the next thing you type can steer that run or wait as the next message. Layout is a separate button in the Studio header.

![](/assets/studio/composer.png)


| Control | What it does |
| ------- | ------------ |
| [Model](#model) | Which model this session calls |
| [MCP](#mcp) | Toggle external servers for this run |
| [Context gauge](#context-gauge) | How full the window is |
| [Show active window](#show-active-window) | Bring forward the open GUI windows of the container this session runs in |
| [Attachments](#attachments) | Paperclip: pick files or images from the **host** |
| [Quick settings](#quick-settings) | Mode, container (until the first message), Bypass, persona, trace speed |
| Send | Blue by default. Orange while Bypass is on. The placeholder says which |

On a narrow composer, MCP, Show active window, and the paperclip drop out so the row can wrap. Model, the gauge, Quick settings, and Send stay.

The composer border stays neutral. Risk colour is on the send button only.

[Mentions](#mentions) (`@`) and [commands](#commands) (`/`) are typed in the box, not toolbar buttons.

## Show active window

The scan icon (with a colour mark in the middle when the project has more than one container) sits just before the paperclip. Hover label: **Show active window**. That mark matches the corner swatch on that container's shell, desktop, and tool tabs. See [Editors and tabs](/studio/interface/editors).

It targets the container this session **runs** in (the same one Quick settings can still change before the first message). Clicking it tells the host to bring that container's open Studio windows forward: shells, the desktop tab, and web tool tabs. One reveal per editor group; tabs already in that group stay where they are and come to the front together.

The button only appears when that container has at least one such window open. When the last one closes, the button disappears. On a narrow composer it drops out with MCP and the paperclip.

This is a reveal, not a picker. To open a new shell or desktop, or to pick one window from a list, use **Active windows** in the launch menu in the Studio header. See [Terminals](/studio/interface/containers#terminals).

## Attachments

The **paperclip** opens the OS file picker and attaches from your **host** (the machine running the editor), not from the container.

- Text files become context chips the model reads at send (large files may be truncated)
- Images go through the multimodal path when the selected model supports images
- You can also paste an image into the composer on models that accept images

Chips above the composer show what will go with the next message. Content is snapshotted when you **send**, not when you attach.

## Mentions

Type `@` in the composer for a mention menu. What appears:

| Mention | What it does |
| ------- | ------------ |
| `@path/to/file` or folder | Read file content or list a folder from the container (`@container:/path` when several containers are active) |
| `@<terminal>` | An open terminal’s live output |
| `@https://…` | Fetch the page as text at send |
| `@brief:…` | A [brief](/studio/knowledge/briefs) page (full document). Type `@brief` (or a collection name) to drill into ingested sources, then pick a page |
| `@<agent>` | Start of a turn that runs that [agent](/studio/knowledge/agents) instead of the main agent. Message must begin with `@name`, then the task |
| `@killchain` | Ask the agent to reconstruct / save the [kill chain](/studio/behavior/kill-chains) (optional `@killchain:/folder`) |

Skills are not `@` mentions. Use [Commands](#commands) (`/`) for those.

Also from the editor or a terminal:

- **Add Selection to Chat**
- **Add Terminal Selection to Chat**

You can keep typing while a run is in progress. What that message does is covered under [While the agent is working](#while-the-agent-is-working).

## Commands

Type `/` for a commands menu: builtins plus user-invocable [skills](/studio/knowledge/skills).

| Command | What it does |
| ------- | ------------ |
| `/clear` | Start a fresh session |
| `/compact` | Summarize and shrink the context |
| `/copy` | Copy the last response. `/copy N` copies an earlier one |
| `/help` | Short help |
| `/<skill>` | Run a user-invocable skill by name |

## Model

The model picker lists what your configured [providers](/studio/providers-models) can actually call. The pick is this session's. The model a new session starts on is the default under [Sessions](/studio/interface/sessions). Reasoning effort and Fast mode, when the model supports them, are per model. See [Providers and models](/studio/providers-models).

## MCP

The MCP button turns [MCPs](/studio/knowledge/mcp) on or off for the current run without editing Settings. A **red dot** on the button means one or more servers failed; an **amber** mark means a server is waiting (for example on a container) without failing. Open the menu for per-server status, then fix or retry under Settings → MCP.

## Context gauge

The ring shows how full the model window is. Hidden until a model is selected. Click to open or close the breakdown.

What fills the window (see [Context](/studio/providers-models#context) for the full story):

- **Exegol System**: Studio's built-in layer (not editable)
- Your side: conversation, [personas](/studio/behavior/personas), harness ([skills](/studio/knowledge/skills), [rules](/studio/knowledge/rules), [agents](/studio/knowledge/agents), [hooks](/studio/knowledge/hooks), [briefs](/studio/knowledge/briefs)), [MCPs](/studio/knowledge/mcp), attachments and mentions
- **Kept free for auto-compaction**: headroom held while auto-compaction is on; past it, older turns are summarized
- **Free space**: room left under that reserve

Compaction loses detail: keep findings in `/workspace` and the [kill chain](/studio/behavior/kill-chains), or run `/compact` from [Commands](#commands).

## Quick settings

**Quick settings** are the switches for the conversation you have open: mode, Bypass, persona, trace speed, and (until the first message) which container it runs in.

They start from a default, set once under [Sessions](/studio/interface/sessions) → **Default**. A new session copies that default. After that, the copy is the session's. What you pick here changes this conversation. A second session running beside it keeps its own copy, including a different model, mode, or Bypass.

Open the menu from the composer. The button shows the mode that is on. Shift+Tab in the prompt cycles Auto, Plan, and Answer, and the button names the one you landed on for a moment. The menu stays open while you pick, so several switches can be set in one visit. A cog beside a heading opens the Settings page for that switch.

| Setting | Effect |
| ------- | ------ |
| **Mode** | Auto, Plan, Answer, then any mode you built, in one list ([Modes](/studio/behavior/modes)) |
| **Bypass** | Approvals off for this session: exec, write, and edit run without cards ([Approvals](/studio/behavior/approvals)). Own band under Mode, so it does not read as a fourth mode |
| **Container** | Where this blank session will run. Only before the first message, and only when the project has more than one container. After the first message the row is gone |
| **Persona** | Working style for this session ([Personas](/studio/behavior/personas)). The pencil edits one you wrote |
| **Trace speed** | **Step**, **Human**, or **Machine**. How streamed text is painted. It does not slow the model or the container |

To change a session you are not looking at, use its row on Settings → **Sessions**. Changing **Default** applies to the next session you create.

Layout is a separate choice: the **Layout** button in the Studio header, beside Settings. See [Layouts](/studio/interface/layouts). It is the same for every session in the window.

## Concurrent messages {#while-the-agent-is-working}

You can type while a run is in progress. The new message can join the work already happening, or wait and become the next turn. A command that is already running is left to finish either way.

**Steer** hands the text to the agent after the step it is on. The agent reads it and carries on with the same task. Use it for a fact the run needs now: the right target, a password, "skip that host".

**Queue** holds the message until the agent finishes this task, then sends it as the next turn. Use it for a follow-up that should leave the current task alone: "when this scan is done, write the findings to `notes.md`".

Enter does the one you chose under Settings → **Interface** → **Concurrent messages**. **Steered** is the starting choice. The button beside Send, and Ctrl or Cmd+Enter, do the other. The placeholder names what Enter will do.

Anything you have sent that the agent has not read yet sits in a list above the composer. Each line says what it is waiting for, for example after the current command finishes, or when the agent finishes. Until the agent reads it you can switch that message between Steer and Queue, pull it back into the box to edit, or remove it.

A message with an attachment, or one that starts with `/`, waits until the run finishes. The line says why. **Stop and send** stops the agent and sends everything waiting as a new message.

## Surfaces that share this thread

The same conversation appears in the sidebar, the full-width chat tab, Room tiles, and Monitor. Closing a panel does not stop the run. For several sessions at once, see [Rooms](/studio/interface/rooms).
