# Sessions

A session is one conversation on a [project](/studio/interface/projects). Several can run at the same time, in the sidebar, in tabs, or in a [Room](/studio/interface/rooms).

Each conversation carries its own quick settings: the model, the mode, the persona, whether commands ask first, and how fast the trace is painted. One session can sit in Plan and ask before every command. Another can run in Auto with Bypass on, on a different model. Opening the second shows its settings. The first keeps its own.

History is stored in the project's **first** container. The page names that box under the Sessions heading. Attaching a session's work to another container does not move the history.

## Defaults

You set the quick settings once, on the card marked **New sessions**. That card is not a session. Every new session starts as a copy of it.

From the moment the session exists, the copy belongs to it. Change it in [Quick settings](/studio/interface/composer#quick-settings) while that conversation is open, or on its row further down this page. Either place writes to that session only. The default applies to the next session you create. Sessions already running keep the copy they started with. Turning Bypass on in Default leaves a conversation that still asks for approval asking, until you turn Bypass on for that conversation.

| Field | What it sets |
| ----- | ------------ |
| **Model** | The model a new session calls |
| **Tool approval** | **Approve** (ask before exec, write, and edit) or **Bypass** |
| **Mode** | [Auto, Plan, or Answer](/studio/behavior/modes), or a mode you built |
| **Persona** | Working style |
| **Trace speed** | How fast the trace is painted |
| **Attached container** | Where a new session runs. Shown when the project has more than one container |

Bypass runs exec, write, and edit the moment the agent asks, in any mode. Deny rules and the [safety floor](/studio/behavior/approvals#safety-floor) still block. The info icon on Bypass in Quick settings opens this note.

**Attached container** is fixed when the session is created. A later change here does not move that session, and its history stays in the storage container.

| Place | What it changes |
| ----- | --------------- |
| Composer [Quick settings](/studio/interface/composer#quick-settings) | The conversation you have open |
| This page, on a session row | That conversation, including one running in the background |
| This page, **Default** | The next session you create |

## New session

**Create session** (the session menu, or the row under the header in Chat and Monitor) starts at once. It does not ask which container.

The blank session runs in the attached-container default: the project's first container, unless Default names another. Until the first message, Quick settings can still move that blank session to another container of the project. After the first message the container is fixed. **Show active window** on the composer reveals the open GUI windows of that box. See [Show active window](/studio/interface/composer#show-active-window).

## A session row

Rows are ordered by how much was said, busiest first. A pin marks the row on this page and does not move it. The same pin is what puts the session in the [default Room](/studio/interface/rooms).

Rename, pin, export, or delete from the row. Export builds a recording or a Markdown transcript of that session. Delete removes that session and its history from the container.

Untitled sessions take a short title from the first message you send (a few words, capitalised). You can rename afterwards.

The row shows the same fields as Default. A dimmed control is following the default. Changing it writes that field onto this session only. **Attached container** is shown locked: it was fixed when the session was created.

In the session menus (sidebar, Room, this page), a per-row **container tag** appears only when the project has more than one container and the listed sessions actually run in different ones. When every row shares the same container, the tag stays off.
