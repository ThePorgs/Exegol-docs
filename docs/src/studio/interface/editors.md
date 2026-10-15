# Editors and tabs

Besides the chat, Studio opens engagement surfaces as ordinary editor tabs so you stay in one window.

- [Container shell](#container-shell): interactive shell in a container
- [Container desktop](#container-desktop): graphical session when the container was started with `--desktop`
- [Tools](#tools): embedded web UIs from the container (BloodHound CE, Caido)
- [Rooms](/studio/interface/rooms): parallel sessions in the same engagement
- full-width chat when in [Chat](/studio/interface/layouts#the-three-layouts) layout
- pseudo-terminal of agent commands when in [Monitor](/studio/interface/layouts#the-three-layouts) layout
- and everything else your standard IDE provides

## Container shell

Open an Exegol container shell from the launch menu in the Studio header, or from the **bottom panel** (VS Code Terminal).

When the [project](/studio/interface/projects) has more than one container, each shell, desktop, and tool tab carries a **corner colour swatch** on its icon. The colour matches that container in the launch menu and on [Show active window](/studio/interface/composer#show-active-window). With a single container, the icon stays plain.

## Monitor

See [Layouts](/studio/interface/layouts#the-three-layouts). One Monitor tab per session; it shows what the agent executed, not an interactive shell you type into.

## Container desktop

Requires a container started with the wrapper's desktop option:

```bash
exegol start CONTAINER IMAGE --desktop
```

See [wrapper desktop](/wrapper/#desktop). Studio embeds the session as a tab, bridges the clipboard, and signs in without putting credentials in a URL. Multi-container projects use the same corner colour swatch as shells and tools.

The agent does not drive the desktop. It is for you, in parallel with a run.

## Tools

BloodHound CE and Caido run **inside the container** and open as tabs. Studio reaches them over host loopback and strips frame-blocking headers so they can embed. Data stays in the container; deleting the container deletes the analysis unless you exported to `/workspace`. Multi-container projects use the same corner colour swatch as shells and desktops.

The agent does not click in these UIs. It can work from exports and from what you paste back into chat.