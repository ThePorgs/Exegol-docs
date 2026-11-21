# Getting started with Exegol MCP

The Exegol MCP is a server that lets AI assistants and agents use Exegol. AI clients (such as Claude Code, Cursor, VS Code, Claude Desktop, etc.) can then work on offensive security tasks such as Capture The Flag, penetration testing, etc.

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is a standard protocol through which servers expose "tools" that AI clients discover and invoke.

> [!TIP] Would you grant AIs auto-run on your OS?
> MCP lets AI agents run commands, manipulate files and interact widely with a system. Exegol reduces that risk by providing a controlled and isolated environment, so that AI-driven automation stays safe, segmented and secure.

Exegol MCP exposes MCP tools and MCP resources over a local stdio pipe or over HTTP. The HTTP service only listens on localhost and requires authentication. It provides two main categories of capabilities:

- **Orchestration tools**: list, create, start, stop and remove Exegol containers, and manage Exegol images
- **In-container tools**: use offensive security tools, run commands (in the foreground or as background jobs) and read or write files within Exegol containers

![Example1](/assets/mcp/example1.png)

## 1. Server install

Exegol MCP requires an [Exegol workstation](/workstation/install) with the Exegol wrapper 6.x or later.

```bash
pipx install exegol-mcp
```

To interact with Docker, the server needs proper permissions. It must either run with `sudo` (preferred), or be run by a member of the `docker` group (which dangerously allows that user to basically have root permissions all the time).

::: tabs
=== Linux (bash)
```bash
echo "alias exegol-mcp='sudo $(echo ~/.local/bin/exegol-mcp)'" >> ~/.bash_aliases && source ~/.bash_aliases
```
=== Linux (zsh)
```zsh
echo "alias exegol-mcp='sudo $(echo ~/.local/bin/exegol-mcp)'" >> ~/.zshrc && source ~/.zshrc
```
=== macOS & Windows
When using Docker Desktop, `sudo` is **not** needed. This step can be skipped.
:::

## 2. Start the server

::: tabs

=== HTTP (default)

```bash
exegol-mcp
```

The server listens on `http://127.0.0.1:2187/mcp`. Its first start prints the client entry, bearer token included, used in [3. Client configuration](#_3-client-configuration).

=== stdio

Skip this step and go to [3. Client configuration](#_3-client-configuration): the AI client starts the server itself, which requires Docker to be reachable without `sudo` (as with Docker Desktop).

:::

The command-line options and the optional `config.yml` file are described in [User config](/mcp/configuration).

## 3. Client configuration

::: tabs

=== HTTP

The first start of the server prints the client entry:

```json
"exegol-mcp": {
    "type": "http",
    "url": "http://127.0.0.1:2187/mcp",
    "headers": {
        "Authorization": "Bearer YOURTOKEN"
    }
}
```

`YOURTOKEN` stands for the bearer token, which the real output contains in clear. `exegol-mcp --print-config` prints the entry again.

=== stdio

`exegol-mcp --type stdio --print-config` prints the client entry:

```json
"exegol-mcp": {
    "type": "stdio",
    "command": "/path/to/exegol-mcp",
    "args": ["--type", "stdio"]
}
```

The `command` is the path of the installation's own `exegol-mcp` script. It can change after an upgrade: running the command again gives the current one.

:::

The entry is then added to the AI client's MCP configuration:

- **Claude Code:** `claude mcp add-json exegol-mcp '<entry>'`, with the object that follows `"exegol-mcp":`. `--scope user` makes it available in every project. A project's `.mcp.json` is shared through version control, so it must not hold the HTTP entry and its token. ([documentation](https://code.claude.com/docs/en/mcp))
- **Cursor:** under `mcpServers` in `~/.cursor/mcp.json`, or in `.cursor/mcp.json` for a single project. ([documentation](https://cursor.com/docs/context/mcp))
- **VS Code (GitHub Copilot):** **MCP: Add Server** from the Command Palette, then **Global** > **Copilot Global**, which writes under `mcpServers` in `~/.copilot/mcp-config.json`. Tokens are best referenced through environment variables (`${NAME}`) rather than stored in the file. ([documentation](https://code.visualstudio.com/docs/agents/reference/mcp-configuration))
- **Claude Desktop:** **Settings** > **Developer** > **Edit Config** opens `claude_desktop_config.json`; the stdio entry goes under `mcpServers`, then the application is restarted. ([documentation](https://modelcontextprotocol.io/docs/develop/connect-local-servers))

Other clients accept the same entry in their own MCP configuration format.

## 4. Authentication

**HTTP** always uses the bearer token of the client entry. It is shown once, at the first start, and redacted afterwards; `exegol-mcp --print-config` reveals it again. The token is a credential: it does not belong in tickets, chat messages or shared configuration files. Its storage, its rotation and the setting that turns authentication off (not recommended) are covered in [Security considerations](/mcp/security).

**stdio** needs no token: the AI client starts the server process itself.

## 5. Client timeouts

AI clients put their own time limits on a tool call. The server keeps its calls within those limits:

- **Foreground commands are bounded.** An `exec_command` or `exec_remote_command` call without `timeout` is bounded at 50 seconds (`execution.timeout_default_s`), below the 60-second default request timeout of the official MCP TypeScript SDK ([source](https://github.com/modelcontextprotocol/typescript-sdk)). A call can ask for more with `timeout`, up to `execution.timeout_max_s` (600 seconds by default).
- **An overrunning command is not lost.** With `on_timeout: background` (the default), it becomes a background job: the call returns the partial output with `timed_out: true`, `exit_code: null` and a `job_id`, and the command keeps running. `on_timeout: kill` stops it instead.
- **Long work runs in the background from the start.** A call with `background: true` returns a `job_id` at once. `get_job` polls the job and reads its new output, `stop_job` stops it and `list_jobs` lists every job. This is the recommended pattern for anything longer than a minute or two, such as a full port scan or a brute force.
- **A client that gives up first loses the output.** When a client cancels a foreground call, the server stops the command, so a larger `timeout` only helps when the client's own limit is longer.

The execution settings are described in [User config](/mcp/configuration).

### Claude Code

Claude Code documents the following limits ([source](https://code.claude.com/docs/en/mcp), sections "Time limits on MCP tool calls" and "MCP output limits and warnings"):

- **Wall-clock limit per call:** `MCP_TOOL_TIMEOUT`, about 28 hours when unset, or a per-server `timeout` field in milliseconds in the server's entry, which overrides it. Progress notifications do not extend it.
- **First-byte timer (HTTP):** each request must start receiving its response within the greatest of 60 seconds, the server's tool timeout and `MCP_TIMEOUT`.
- **Idle timeout:** a call that receives no response and no progress notification for 5 minutes over HTTP, or 30 minutes over stdio, is aborted. `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` changes the window (milliseconds, `0` disables the check), and a per-server `timeout` of at least 1000 ms acts as a floor: that server's calls are never aborted for idleness sooner. Only `download_image` sends progress notifications, so over HTTP a foreground command whose `timeout` goes past 5 minutes is aborted by Claude Code first; a background job avoids this.
- **Automatic backgrounding:** a main-conversation call that runs past two minutes moves to a Claude Code background task; the limits above still apply.
- **Server startup:** `MCP_TIMEOUT` also sets how long Claude Code waits for an MCP server to start.
- **Output size:** Claude Code warns above 10,000 tokens of tool output and limits it to 25,000 tokens by default, changed with `MAX_MCP_OUTPUT_TOKENS`. A text result longer than 50,000 characters is saved to a file. Reading a long job output in steps with `get_job` keeps each result small.
- **HTTP response size:** a response from an HTTP server larger than 16 MiB makes the request fail, which bounds the useful value of `files.max_bytes` over HTTP (see [User config](/mcp/configuration)).

### Other clients

The MCP documentation of Cursor, VS Code and Claude Desktop (linked in [3. Client configuration](#_3-client-configuration)) gives no time limit for tool calls and no setting to change one. The advice above applies: keep foreground calls short, and run long work as background jobs polled with `get_job`.

## 6. Hack the planet!

AI assistants and agents can now use Exegol. The [MCP overview](/mcp/) page describes what Exegol MCP can do and gives example prompts.

![Example2](/assets/mcp/example2.png)

> [!DANGER] OpSec considerations
> AI clients mostly use online models: whatever is shared with, run by or sent to the AI may be processed outside the environment. Read [Security considerations](/mcp/security) before using Exegol MCP anywhere near production systems or sensitive data.
