# Studio screenshots to capture

Not linked in the sidebar. Regenerate the checklist with:

```bash
grep -rn "Screenshot to add" docs/src/studio/
```

Each id needs `_dark.png` and `_light.png` under `docs/src/assets/studio/`. Lab data only, one consistent window size, crop to the region under discussion. Until files exist, pages keep `> [!WARNING] Screenshot to add:` placeholders (do not add real `![]()` tags that break the VitePress build).

| Priority | Id | Page | What to capture |
| -------- | -- | ---- | --------------- |
| P0 | `overview_hero` | Overview | Clean mid-run sidebar |
| P0 | `getting-started_approval` | Getting started | Allow / Deny card + tool output |
| P0 | `getting-started_system-check` | Getting started | System check (Fix setup banner opens the same page) |
| P0 | `composer_full` | Composer | Attachments, model, MCP, gauge, quick settings open |
| P0 | `modes_menu` | Modes | Answer / Plan / Auto (+ custom if shown) |
| P0 | `approvals_bypass` | Approvals | Approval card and Bypass in quick settings |
| P1 | `layouts_editor` | Layouts | Editor layout with VS Code regions visible |
| P1 | `layouts_chat` | Layouts | Chat layout |
| P1 | `layouts_monitor` | Layouts | Monitor layout / pseudo-terminal |
| P1 | `projects_host-paths` | Projects | Host paths + drag and drop into chat |
| P1 | `containers_page` | Containers | Containers list |
| P1 | `providers_page` | Providers | One provider expanded |
| P1 | `mcp_where-it-runs` | MCP | Container vs host vs remote |
| P1 | `atlas_panel` | Atlas | Graph with a node selected |
| P1 | `personas_menu` | Personas | Quick settings personas |
| P1 | `rooms_default` | Rooms | Default Room (+ optional custom Pro shot) |
| P1 | `killchain_canvas` | Kill chains (Behavior) | Lab kill chain |
| P1 | `getting-started_plan` | Getting started | Plan card: Approve & run / Request changes / Deny |
| P1 | `getting-started_killchain` | Getting started | Finished box kill chain |
| P2 | `editors_desktop` | Editors | Desktop tab |
| P2 | `editors_webtool` | Editors | BloodHound or Caido tab |
| P2 | `harness_skills` | Skills | Skills list in Settings |
| P2 | `harness_rules` | Rules | Rules list in Settings |
| P2 | `hooks_settings` | Hooks | One configured hook |
| P2 | `knowledge_briefs` | Briefs | Briefs list with one source |
| optional | video | Getting started | 60-90s install to first approved command |
