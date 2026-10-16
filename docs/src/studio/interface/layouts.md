# Layouts

Layouts decide **where** the conversation and the execution live in the editor. They do not change what the agent runs or what it costs. It's only a visual preference.

Pick **Editor**, **Chat**, or **Monitor** from the **Layout** button in the Studio header (beside Settings), or under Settings → **Interface** → **Layouts**. Layout follows the tabs open in this window. It is not saved as a setting, and it is not part of [Quick settings](/studio/interface/composer#quick-settings). Quick settings belong to the session. Layout belongs to the workspace.

## How the editor is structured

Studio uses the regions VS Code (and compatible forks) already have:

| Region | Typical Studio use |
| ------ | ------------------ |
| **Activity bar** | Exegol Studio icon opens the cockpit |
| **Primary side bar** | Chat thread and composer in Editor layout; session list and launch actions in Chat or Monitor |
| **Editor area** | Your files, terminals, web-tools, rooms, settings; Chat thread in Chat layout; pseudo-shell in Monitor |
| **Panel** (bottom) | Integrated terminal; you can open an Exegol container shell here too |
| **Status bar** | Project, model, context, MCP, and the Studio version. See [Status bar](/studio/interface/status-bar) |

## The three layouts

::: tabs

=== Editor (default)

![](/assets/studio/layout_editor.png)

Default. Conversation in the primary side bar beside your code. Best when you are editing notes or scripts while the agent runs.

=== Chat

![](/assets/studio/layout_chat.png)

This layout is best for long reading, plan review.

Conversation moves into an editor tab. The side bar keeps sessions, launch actions, and Settings. Nothing goes fullscreen; nothing closes. Best for long reading and plan review.

Toggle between sidebar chat and a full-width agent tab for the same session from the Layout button, or from Settings → **Interface**.

=== Monitor

![](/assets/studio/layout_monitor.png)

Splits the run:

- Side bar keeps **conversation** (your messages, agent answers)
- An editor tab shows a **pseudo-terminal**: Exegol prompt, command as typed, raw output

Use Monitor when raw output matters more than the summary, when debugging what ran, or when showing someone what the agent actually executes.

Trace detail (compact vs balanced cards) is a separate preference under Settings → **Interface** → **Trace detail**. Monitor is a place, not a detail level. The pace of the paint is [trace speed](/studio/interface/composer#quick-settings), per session.

:::
