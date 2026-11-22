# Security considerations

Exegol MCP matters to a security review for two reasons: it **drives Docker**, and access to the Docker daemon is equivalent to root on a Linux host, and it **hands an AI client a shell in Exegol containers**, together with the tools installed in them. Every risk below follows from one of those two facts. For the settings mentioned on this page, see [User config](/mcp/configuration); for installation and client setup, see [Getting started](/mcp/getting-started).

This page states each risk once.

## Who can reach the server

### stdio

With `--type stdio`, the AI client starts the server as a local child process and talks to it over a pipe. No network port is opened and no authentication applies: whoever can start the process already runs as the user it runs as.

### HTTP

With the default `--type http`, the server listens on `127.0.0.1` only, on port `2187` at `/mcp` by default. There is no setting to bind another interface. On top of the loopback bind:

- A request whose `Host` header is not `127.0.0.1`, `localhost` or `[::1]` (any port) is refused with `421`, and a request carrying a foreign `Origin` header is refused with `403`. This blocks DNS-rebinding attacks from web pages open in a local browser.
- Every request must carry `Authorization: Bearer YOURTOKEN`. A missing, malformed or wrong token gets `400` with one generic message, deliberately not `401` or `403`, so that clients do not start an OAuth discovery the server does not support. The token is compared in constant time.

> [!WARNING]
> Forwarding the port to another host, through an SSH tunnel, a reverse proxy or a container port mapping, extends shell access to every Exegol container, and control of Docker, to whoever can reach the forwarded port. The server is designed for local clients only.

## The bearer secret

The secret is generated on the first HTTP start with bearer authentication and reused afterwards.

- **Storage.** On macOS and Windows it is kept in the OS keyring (service `exegol-mcp`, user `bearer`) when the `keyring` package can use it. Otherwise, and always on Linux, it is a raw file named `bearer.secret` with mode `0600` in `~/.exegol-mcp` (see [User config](/mcp/configuration#file-location)). A secret file that is a symbolic link or not a regular file, or, when the server runs as root, one owned by another user or hard-linked, is not read: the server logs a warning and generates a new secret.
- **Display.** The secret is printed once, right after it is created. Later starts do not print it but point at `exegol-mcp --print-config`, which prints it again. That output is a credential: it does not belong in tickets, chat messages or shared terminal recordings.
- **Rotation.** Stopping the server, deleting the secret and starting the server again creates a new one. With the file backend, delete `~/.exegol-mcp/bearer.secret`. On Linux, if v1 ever ran with `sudo`, also delete `/root/.config/exegol-mcp/bearer.secret`: otherwise the next `sudo` start copies that old secret back. With the keyring backend, delete the `exegol-mcp` / `bearer` entry (Keychain Access on macOS, Credential Manager on Windows). Every client configuration must then be updated with the new value from `--print-config`.
- **Upgrade from v1.** A secret written by Exegol MCP v1 keeps working. On the first start, a v1 secret file is moved from the directory v1 used into `~/.exegol-mcp` and converted from the older format; on Linux, a v1 secret left in root's directory by an earlier `sudo` run is copied there too. Existing client configurations keep authenticating.

### Turning authentication off

> [!DANGER] Unauthenticated HTTP gives every local process a shell in every Exegol container
> Without authentication, any process on the host, and any other user on a shared host, that can open a connection to `127.0.0.1` can list, start, create and remove containers and run commands in them. On Linux that includes control of Docker, which is root-equivalent. The `Host` and `Origin` checks still stop browsers, but nothing stops a local program.

There is no command-line flag for it: `--auth none` is refused. Unauthenticated HTTP only starts when `config.yml` sets both `auth: none` and `security.allow_no_auth: true`. `--auth bearer` on the command line turns authentication back on whatever the file says. This is meant for a host that runs nothing else, such as a throwaway VM in an isolated pipeline. stdio needs neither key.

## What the server logs

The server writes diagnostics to the standard error stream only and writes **no log file**. It does not log tool arguments, commands, passwords or tool output, at any verbosity.

With `-v`, the MCP library logs one line for each tool call that fails and each resource read that fails. The line holds the tool name or the **full resource URI**, and the error text. For a workspace read, the URI includes the file path inside the container, for example `exegol://containers/lab-01/workspace/loot/hashes.txt`. Where a client or a service manager keeps the server's standard error, these lines are kept with it.

## Output is returned unredacted

Tool results and resource contents are returned exactly as they were produced: command output, file contents and the installed-tools catalog are never filtered. That includes credentials, hashes and tokens a tool prints, the password passed to `exec_remote_command` included. In an offensive-security engagement they are findings, and hiding them would hide results.

Output larger than `execution.output_cap_bytes` is cut from the front, keeping the end, and the result reports how many bytes were dropped. That is a size limit, not redaction.

## Where credentials persist outside the server

The server keeps no record of commands or their results, but other places do:

- **The AI client.** Its transcript, history and logs hold every tool argument the model wrote and every result it received.
- **The model provider.** With an online model, every prompt, tool argument and tool result is sent to the provider and processed there.
- **The container.** Tools keep their own state and logs (databases, caches, output files) in the container, and audit features enabled on it, such as shell logging or Sentinel, record activity as configured.
- **The process list.** While `exec_remote_command` runs, its remote-execution backend receives the credentials as command-line arguments, which `ps` inside the container can read.
- **The host.** Files under `/workspace` live in a directory on the host. By default, removing a container keeps its private workspace and its logs on the host (`lifecycle.keep_workspace` and `lifecycle.keep_logs`), and a host directory mounted as a workspace is never deleted.

Ways to limit it:

- Use **disposable containers**: one container per task or engagement through `create_container`, removed at the end with `remove_container`, or all at once with `cleanup_containers`. Passing `keep_workspace: false` and `keep_logs: false`, or setting those defaults in `config.yml`, removes the private workspace and the logs with the container.
- Where a tool accepts credentials from a file, place the file under `/workspace` outside the AI session and pass its path, so the value travels neither through the transcript nor on a command line.
- Set the AI client's transcript and history retention to match the sensitivity of the engagement, and prefer a local model where the data must not leave the host.
- Do not hand production secrets to an agent. Use credentials scoped to the test and revoke them afterwards.

## Tool groups reduce surface, not risk

`tool_groups.disabled` hides whole groups of tools and resources from the AI client. It is useful to keep an agent focused, but it is **not a security boundary**: as long as `exec_command` is available, a shell can do what most hidden tools do, for example read and write files when the `files` group is disabled. See [User config](/mcp/configuration) for the groups.

## Host workspaces

By default, every container gets a private Exegol workspace, and an agent cannot mount a host directory. A container that mounts a host directory can write into it, and through it swap paths that Docker, Exegol or Python later trust on the host. That is why only directories listed in `lifecycle.workspace_allowlist` can be mounted, each one exactly, and why the server refuses to start when an entry overlaps a directory Exegol mounts, reads its settings from or runs code from. The rules, and what they do not cover, are listed under [User config](/mcp/configuration#workspace-allowlist).

## Resources

The MCP resources (container information, the installed-tools catalog and workspace files) follow the same tool groups as the tools. Workspace files are read through the running container and only under `/workspace`: a path that leaves it, through `..` or otherwise, is refused, as is a NUL character, and a read is bounded by `files.max_bytes`. A resource read never starts a stopped container: container information stays readable, and catalog and workspace reads fail instead.

## OpSec

> [!DANGER] OpSec considerations
> AI clients mostly use online models. Whatever is shared, run or sent to the AI, tool output included, may be processed outside the operator's environment.
>
> **DO NOT** use Exegol MCP in production or with sensitive data without fully understanding the risks and putting strict security controls in place. Careless AI-driven automation can leak proprietary, confidential or secret information to cloud providers, or let an AI break or impact production systems.
>
> Exegol MCP is designed for research, testing, CTFs and lab environments. **It is NOT suited for real-world red teaming or penetration testing** engagements without significant additional security and access controls.
