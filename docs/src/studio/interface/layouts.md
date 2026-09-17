# Layouts

Layouts decide **where** the conversation and the execution live in the editor. They do not change what the agent runs or what it costs. It's only a visual preference.

Pick **Editor**, **Chat**, or **Monitor** from composer [quick settings](/studio/interface/composer#quick-settings).

## How the editor is structured

Studio uses the regions VS Code (and compatible forks) already have:

| Region | Typical Studio use |
| ------ | ------------------ |
| **Activity bar** | Exegol Studio icon opens the cockpit |
| **Primary side bar** | Chat thread and composer in Editor layout; session list and launch actions in Chat or Monitor |
| **Editor area** | Your files, terminals, web-tools, rooms, settings; Chat thread in Chat layout; pseudo-shell in Monitor |
| **Panel** (bottom) | Integrated terminal; you can open an Exegol container shell here too |

## The three layouts

::: tabs

=== Editor (default)

Default. Conversation in the primary side bar beside your code. Best when you are editing notes or scripts while the agent runs.

> [!WARNING] Screenshot to add: `layouts_editor`
> Editor layout: conversation in the primary side bar, code in the editor area.

=== Chat

This layout is best for long reading, plan review.

Conversation moves into an editor tab. The side bar keeps sessions, launch actions, and Settings. Nothing goes fullscreen; nothing closes. Best for long reading and plan review.

Toggle between sidebar chat and a full-width agent tab for the same session from Layout in composer quick settings, or the Studio chat controls.

> [!WARNING] Screenshot to add: `layouts_chat`
> Chat layout: conversation as an editor tab, sessions and launch actions still in the side bar.

=== Monitor

Splits the run:

- Side bar keeps **conversation** (your messages, agent answers)
- An editor tab shows a **pseudo-terminal**: Exegol prompt, command as typed, raw output

Use Monitor when raw output matters more than the summary, when debugging what ran, or when showing someone what the agent actually executes.

Detail level (compact vs balanced cards) is a separate preference under Settings → **Layout**. Monitor is a place, not a detail level.

> [!WARNING] Screenshot to add: `layouts_monitor`
> Monitor layout: conversation in the side bar, pseudo-terminal tab with raw command output in the editor.

:::
