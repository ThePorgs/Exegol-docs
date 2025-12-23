# What Exegol MCP can do

Exegol MCP provides AI assistants with powerful capabilities to interact with Exegol containers and perform offensive security tasks.

## Example prompts

Here are some simple examples of prompts you can use with your AI assistant to leverage Exegol MCP:

**Orchestration examples:**
- `List all my Exegol containers`
- `Start the container named 'pentest'`
- `What Exegol images do I have installed?`
- `Download the latest free image`
- <Badge type="pro"/><Badge type="enterprise"/>`Download the 'web' image in the '3.1.10' version`

**In-container execution examples:**
- `Run nmap to scan 192.168.1.0/24 in my Exegol container`
- `Help me enumerate this AD domain and find vulnerabilities`
- `What tools are available in my container for web application testing?`
- `Execute whoami on the remote Windows server via netexec's SSH module`

Your AI assistant will automatically select the appropriate tools based on your request, so you can use natural language without needing to know the exact tool names.

## MCP tools 

Depending on your request the AI assistant will use choose what Exegol MCP server's tool to use. Those tools can be split into two main categories: **orchestration** and **in-container execution**.

> [!NOTE] Using tools
> Some AI clients allow users to specify in their prompt exactly what tool to use (i.e., `use /tool_name to ...`). That being said, you don't need to do that and natural language is perfectly fine. The tools list below is informative only and you don't need to mention them to have your AI assistant use them.

### Orchestration tools

Orchestration tools empower AI assistants to control Exegol containers and images, providing broad management over the Exegol environment. These tools let assistants check which containers are running and their statuses, start or stop containers, install or update Exegol images, and manage the environment efficiently without manual intervention.

| Tool                           | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `list_exegol_containers`       | List all available Exegol containers with their current status (running, stopped, etc.) |
| `start_container`              | Start an existing Exegol container or create a new one from an image |
| `stop_container`               | Stop a running Exegol container without removing it       |
| `list_installed_images`        | List all Exegol images currently installed on your system |
| `list_all_images`              | List all available Exegol images (installed and available for download) with update status |
| `download_image`               | Download and install Exegol images from the registry      |

### In-container execution tools

In-container tools allow AI assistants to execute commands and use security tools within Exegol containers.

| Tool                                 | Description                                               |
| ------------------------------------ | --------------------------------------------------------- |
| `execute_command_in_container`       | Execute commands inside Exegol containers, running pentesting tools, scripts, and any available command |
| `execute_remote_command`             | Execute commands on remote systems via SSH, WinRM, SMB, MSSQL, WMI, or RDP protocols |
| `list_installed_tools`               | List all security tools installed in Exegol containers, organized by category |
| `list_installed_exegol_resources`    | List all available [Exegol resources](/resources/list) for a specific target OS |

Exegol MCP supports "pseudo sessions" for remote command execution with the `execute_remote_command`. Currently, this feature enables inline execution of tools like [NetExec](https://github.com/Pennyw0rth/NetExec) (formerly [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec)) directly within the MCP workflow, allowing AI assistants to interact with remote systems without requiring explicit session management.

## Current limitations

Exegol MCP is being developed, and some features are not yet available. The following capabilities are planned but not yet implemented:

- **Container creation**: create new containers with default or custom configurations
- **Container/image removal**: remove containers and/or images
- **OAuth authentication**: OAuth-based authentication is the most MCP-compliant authentication method, but it isn't support yet

> [!TIP] Feedback and suggestions
> We're continuously improving Exegol MCP based on user feedback. If you have suggestions for new features, improvements, or encounter limitations that impact your workflow, please share your feedback through our [Discord community](https://discord.exegol.com).
