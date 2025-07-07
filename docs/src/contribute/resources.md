# Contributing to Resources

The Exegol resources repository contains additional resources and tools that security experts need to use on target machines (e.g. enumeration scripts, webshells, etc.). 
These resources are managed by the Wrapper, and shared with every Exegol container on your machine.
On the repository, they are automatically downloaded and updated using a script called `update-resources.sh`.

## How it works

The `update-resources.sh` script is responsible for downloading and maintaining various security tools and resources 
Here's how it works:

1. The script creates a structured directory hierarchy for different types of resources:
   - Windows tools
   - Linux tools
   - macOS tools
   - Webshells (PHP, ASPX, JSP)
   - ...

2. For each tool, the script should:
   - Download the latest version from the official source
   - Place it in the appropriate directory
   - Add an entry to `resources_list.csv` with the tool's name, link, and description using the `add-to-list` instruction

3. The script maintains a list of tools including:
   - System utilities (Sysinternals, PEASS suite)
   - Enumeration tools (LinEnum, Linux Smart Enumeration)
   - Exploitation tools (Mimikatz, JuicyPotato)
   - Network tools (Chisel, Rustscan)
   - ...

## Automated updates

The resources are automatically updated through a GitHub Actions workflow that:
1. Runs monthly to check for new versions of tools
2. Executes the `update-resources.sh` script
3. Creates a new branch with the updated resources
4. Opens a Pull Request for maintainers to review

This ensures that Exegol users always have access to the latest versions of security tools.

## Getting started

1. Fork the [Exegol-resources](https://github.com/ThePorgs/Exegol-resources) repository
2. Checkout the `dev` branch
3. (optional) create a new branch in your fork, if you plan on working on different topics
4. Create your content using this guide
5. Make sure your changes work locally
6. Stage, Commit, and Push your changes (including `update-resources.sh` and the new resources)
7. Submit a Pull Request (https://github.com/ThePorgs/Exegol-resources/compare)

## Adding new tools

To add a new tool to the resources:

1. Create a new function in `update-resources.sh` following the existing pattern
2. Add the tool's download logic and directory structure
3. Use the `add-to-list` function so that the tool is added automatically to the documentation later on
4. Add your new function to the `add_resources` function
5. Test your changes locally by running the script

Example of adding a new tool:
```bash
function add_new_tool() {
  info "Downloading New Tool"
  chkfs "./category/new_tool/"
  wget -O ./category/new_tool/tool.exe "https://example.com/tool.exe"
  add-to-list "New Tool,https://example.com/tool,Description of the tool"
}
```
