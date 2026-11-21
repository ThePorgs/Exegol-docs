# Exegol MCP overview

Exegol MCP is a server that lets an AI client (Claude Code, Cursor, VS Code, Claude Desktop, and others) or a headless agent talk to Exegol over the [Model Context Protocol](https://modelcontextprotocol.io/).

- **What it is:** MCP tools and resources for orchestration (containers, their lifecycle, images) and in-container work (commands, background jobs, files, the installed tool catalog), over stdio or HTTP.
- **Why that is better:** the agent is boxed in Exegol, not granted the host OS. It can create a disposable container, use it and remove it with no human step.
- **What it gives:** natural-language control of Exegol and of the tools already in the container, without memorising tool names.

The images the assistant can download follow the [same tiers](/about#tiers) as the wrapper: Community can pull `free`; Pro, Team and Enterprise can pull the other official images.

Installation and client configuration are described in [Getting started](/mcp/getting-started).

## Example prompts

Here are some simple examples of prompts that make use of Exegol MCP:

**Orchestration examples:**
- `List all my Exegol containers`
- `Start the container named 'pentest'`
- `Create a disposable container from the free image for this lab`
- `Remove every container you created during this session`
- `What Exegol images do I have installed?`
- `Download the latest free image`
- <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>`Download the 'web' image in the '3.1.10' version`

**In-container execution examples:**
- `Run nmap to scan 192.168.1.0/24 in my Exegol container`
- `Run a full TCP port scan of 10.10.10.5 in the background, and tell me what it found when it is done`
- `Read the nmap report saved in the workspace of the 'pentest' container`
- `What tools are available in my container for web application testing?`
- `Help me enumerate this AD domain and find vulnerabilities`
- `Execute whoami on the remote Windows server over WinRM`

The AI assistant selects the appropriate tools from the request, so natural language works without knowing the exact tool names.

## MCP tools

The AI assistant chooses which Exegol MCP tool to use from the request. The tools are organised in four groups.

> [!NOTE] Using tools
> Some AI clients allow a prompt to name the tool to use (i.e., `use /tool_name to ...`). That is never required, and natural language is perfectly fine. The tool lists below are informative only.

**Always available:** `server_info` reports the Exegol MCP version, the Exegol library and wrapper versions, the Docker status and whether an update is available.

An operator can hide whole groups from the AI client with `tool_groups.disabled`; see [User config](/mcp/configuration). Hiding a group reduces what an agent is offered, but it is not a security boundary.

### Containers

| Tool | Description |
|------|-------------|
| `list_containers` | List every Exegol container on the host with its status and configuration, and whether Exegol MCP created it |
| `start_container` | Start an Exegol container that is not running |
| `stop_container` | Stop a running Exegol container |
| `create_container` | Create and start a new container from an installed image or an operator-approved container profile, with no prompt |
| `remove_container` | Stop and remove a container that Exegol MCP created, and report whether its workspace and logs are kept |
| `cleanup_containers` | Remove the containers Exegol MCP created, during the current server run or during any run |
| `list_installed_tools` | List the tools installed in a container, one page at a time, with their version, category and description |
| `list_offline_resources` | List the offline [Exegol resources](/resources/) available in a container for a target OS, one page at a time |

### Images

| Tool | Description |
|------|-------------|
| `list_images` | List the installed Exegol images, or every available image, with their version and update status |
| `download_image` | Download and install an Exegol image, or update an outdated one, with progress reporting |

### Execution

| Tool | Description |
|------|-------------|
| `exec_command` | Run a shell command inside an Exegol container, in the foreground (bounded by a timeout) or as a background job |
| `get_job` | Poll a background job and read its new output since the last read |
| `stop_job` | Stop a background job and its whole process group |
| `list_jobs` | List the background jobs the server is tracking |
| `get_tool_help` | Get the help text of a tool installed in a container |
| `exec_remote_command` | Run a command on a remote host over SSH, WinRM, SMB, MSSQL, WMI or RDP, from inside an Exegol container |

`exec_remote_command` runs one command on a remote host without a persistent session, using the remote-execution tooling installed in the container. [NetExec](https://github.com/Pennyw0rth/NetExec) (formerly [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec)) is the current backend. Like `exec_command`, a long remote command can run as a background job. Credentials passed to it persist outside the server, in the client transcript and inside the container; see [Security considerations](/mcp/security).

### Files

| Tool | Description |
|------|-------------|
| `read_file` | Read a whole file from a container, as UTF-8 text or base64 |
| `write_file` | Write a file into a container from UTF-8 text or base64, replacing it by default |
| `list_directory` | List a directory in a container with each entry's type, size, mode, modification time and symlink target |

## MCP resources

Besides tools, Exegol MCP exposes read-only MCP resources that a client reads by URI. `{name}` is the exact container name.

| URI template | Returns | Hidden with the group |
|--------------|---------|-----------------------|
| `exegol://containers/{name}/info` | The container's information as JSON: the same fields `list_containers` returns for it | `containers` |
| `exegol://containers/{name}/tools` | The whole catalog of tools installed in the container as JSON, in a single read | `containers` |
| `exegol://containers/{name}/workspace/{+path}` | One file under the container's `/workspace`, as text when it is valid UTF-8 and as binary otherwise | `files` |

The server lists an info resource and a tools resource for every container, while workspace files are reached by URI and never listed one by one (`list_directory` finds their names). Reading a resource never starts, stops or changes a container: the tools and workspace resources need a running container.

> [!TIP] Feedback and suggestions
> We're continuously improving Exegol MCP based on user feedback. If you have suggestions for new features, improvements, or encounter limitations that impact your workflow, please share your feedback through our [Discord community](https://discord.exegol.com).
