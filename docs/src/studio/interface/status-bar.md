# Status bar

Studio adds five items to the editor status bar, on the left. They stay visible whichever [layout](/studio/interface/layouts) you are in, so you can read the engagement without opening the chat. Each one is a click: it opens the control it names.

| Item | What it shows | Click |
| ---- | ------------- | ----- |
| **Project** | The active [project](/studio/interface/projects). Hover for how many containers it holds. **No project** when none is active | Opens the project switcher. When the conversation is a tab, the click focuses the sidebar, where that switcher lives |
| **Model** | The model this [session](/studio/interface/sessions) calls, shortened. Hover for the full id. **No model** until one is picked | Opens the model picker on the conversation |
| **Context** | How full the model window is, as a percentage. Hover for the token counts. **n/a** until a window has been measured | Opens the context breakdown |
| **MCP** | How many [MCP](/studio/knowledge/mcp) servers are connected, out of how many you configured. **none** when you have not added any | Opens the MCP menu |
| **Version** | The Exegol Studio build. A development build adds **dev** | Opens Settings → **Support** |

## Context

The percentage matches the [context gauge](/studio/interface/composer#context-gauge) on the composer. Under 60% the item stays plain. From 60% it takes a warning colour. From 85% it takes an error colour. The number on the bar stops at 100%. The tooltip still shows the real token counts when the transcript is larger than the window.

## MCP

Each connected server counts toward the total. A server that failed is counted apart, and the item takes an error colour. Hover to see every server and its status.

## Version

Support is the page with the system check and the diagnostics report, which is what a support exchange asks for next.
