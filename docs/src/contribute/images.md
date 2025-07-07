# Contributing to Docker Images

The Docker images are the heart of the Exegol project. They contain a carefully curated selection of tools, configurations, aliases, history commands, and various customizations prepared in multiple images adapted for different uses: web hacking, Active Directory, OSINT (Open Source INTelligence), etc.

## Getting started

1. Fork the [Exegol-images](https://github.com/ThePorgs/Exegol-images) repository
2. Follow the [Installation Guide](/contribute/install) to set up your development environment
3. Checkout the `dev` branch
4. (optional) create a new branch in your fork, if you plan on working on different topics
5. Create your content using this guide
6. Make sure your changes work locally
7. Stage, Commit, and Push your changes
8. Submit a Pull Request (https://github.com/ThePorgs/Exegol-images/compare)

## Tools

When adding a new tool to an image (or modifying a tool install function), follow these steps:

1. Identify which package your tool installation function should go into in the [packages](https://github.com/ThePorgs/Exegol-images/tree/main/sources/install) directory.

2. Create an installation function following this structure:

```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    # tool install commands [...]
    add-aliases yourtool
    add-history yourtool
    add-test-command "yourtool.py --help"
    add-to-list "yourtool,https://link.to/the/tool,description"
}
```

### Required Components

Your installation function should include:

- `colorecho "Installing yourtool"` - For progress logging
- `catch_and_retry <command>` - For commands that might fail due to network issues. Note: Most standard Internet-involved commands (git, wget, curl, go, etc.) are already transparently wrapped with `catch_and_retry`. You probably won't need that.
- `add-aliases yourtool` - If your tool needs aliases. You will need to create the aliases file in `/sources/assets/shells/aliases.d/` named after your tool. Example:
  ```bash
  alias tool.py='python3 /opt/tools/yourtool/tool.py'
  ```
- `add-history yourtool` - For command examples. Create a history file in `/sources/assets/shells/history.d/` named after your tool. Example:
  ```bash
  yourtool.py --user "$USER" --password "$PASSWORD" --target "$TARGET"
  yourtool.py --mode enum --user "$USER" --target "$TARGET"
  yourtool.py --mode unauthenticated
  ```
- `add-test-command "testcommand"` - For CI/CD unit tests. The command must return 0 if successful. If `--help` doesn't work, try using grep: `yourtool.py --help|& grep 'Usage:'`
- `add-to-list "yourtool,https://link.to/the/tool,description"` - For tools list export. Format is CSV with 3 columns: name, link, description. No comma allowed in description.

### Code Check Whitelisting

If your tool doesn't need aliases or history commands, add a whitelist comment at the beginning of the function:

```bash
# CODE-CHECK-WHITELIST=add-aliases
# CODE-CHECK-WHITELIST=add-aliases,add-history
```

### Installation Standards

Follow these standards when installing tools:

- Use virtual environments for Python tools with access to system site-packages with `--system-site-packages`
- Install tools in `/opt/tools/` or place binaries in `/opt/tools/bin/`
- Use `--depth 1` with git clone to save space
- Use `asdf` for managing tool versions (currently only for Go)

### Installation Methods

::: tabs

== Python (pipx)
```bash
# From GitHub
pipx install --system-site-packages git+https://github.com/AUTHOR/REPO

# From local sources
git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
pipx install --system-site-packages /opt/tools/yourtool/
```

== Python (venv)
```bash
git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
cd /opt/tools/yourtool || exit
python3 -m venv --system-site-packages ./venv/
source ./venv/bin/activate
pip3 install -r requirements.txt
deactivate
add-aliases yourtool
```

== APT
Add the package to the appropriate `install_*_apt_tools()` function in the package file.

== Go
```bash
go install -v github.com/AUTHOR/REPO@latest
asdf reshim golang
```

== Ruby
```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    rvm use 3.0.0@yourtool --create
    gem install yourtool
    rvm use 3.0.0@default
    add-aliases yourtool
    add-history yourtool
    add-test-command "yourtool --help"
    add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
}
```

== Compile Sources
```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
    cd /opt/tools/yourtool
    ./configure
    make
    ln -s "/opt/tools/yourtool/bin/yourtool" "/opt/tools/bin/yourtool"
    add-history yourtool
    add-test-command "yourtool --help"
    add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
}
```

== Download Binary
```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    local URL
    URL=$(curl --location --silent "https://api.github.com/repos/AUTHOR/REPO/releases/latest" | grep 'browser_download_url.*somestring.*tar.xz"' | grep -o 'https://[^"]*')
    curl --location -o /tmp/tool.tar.xz "$URL"
    tar -xf /tmp/yourtool.tar.xz --directory /tmp
    rm /tmp/yourtool.tar.xz
    mv /tmp/yourtool* /opt/tools/yourtool
    ln -s "/opt/tools/yourtool/bin/yourtool" "/opt/tools/bin/yourtool"
    add-history yourtool
    add-test-command "yourtool --help"
    add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
}
```

:::

### Temporary Fixes (tempfix)

Sometimes tools have issues that need temporary fixes. Here are two approaches:

::: tabs

== Git (checkout)
```bash
function install_TOOL() {
    [...]
    # git -C /opt/tools/ clone --depth 1 https://github.com/REPO/TOOL.git
    local temp_fix_limit="YYYY-MM-DD"
    if check_temp_fix_expiry "$temp_fix_limit"; then
      git -C /opt/tools/ clone https://github.com/REPO/TOOL.git
      git -C /opt/tools/TOOL checkout 774f1c33efaaccf633ede6e704800345eb313878
    fi
    [...]
}
```

== Git (merge PRs)
```bash
function install_TOOL() {
    [...]
    git -C /opt/tools/ clone --depth 1 https://github.com/REPO/TOOL.git
    local temp_fix_limit="YYYY-MM-DD"
    if check_temp_fix_expiry "$temp_fix_limit"; then
        git config --local user.email "local"
        git config --local user.name "local"
        local PRS=("111" "222" "333")
        for PR in "${PRS[@]}"; do git fetch origin "pull/$PR/head:pull/$PR" && git merge --strategy-option theirs --no-edit "pull/$PR"; done
    fi
    [...]
}
```

:::

### Multi-architecture Support

Exegol images are built for both AMD64 and ARM64 systems. When possible, ensure your tool installation works on both architectures:

```bash
if [[ $(uname -m) = 'x86_64' ]]
then
    # command for AMD64
elif [[ $(uname -m) = 'aarch64' ]]
then
    # command for ARM64
else
    criticalecho-noexit "This installation function doesn't support architecture $(uname -m)" && return
fi
```

### Testing Your Changes

Before submitting a pull request, test your installation locally:

```bash
# Build the local image
exegol install "testimage" "full" --build-log "/tmp/testimage.log"

# Create and start a container for the tests
exegol start "testcontainer" "testimage"

# Run the tests (from the container)
cat /.exegol/build_pipeline_tests/all_commands.txt | grep -vE "^\s*$" | sort -u > /.exegol/build_pipeline_tests/all_commands.sorted.txt
python3 /.exegol/build_pipeline_tests/run_tests.py
cat /.exegol/build_pipeline_tests/failed_commands.log
```

## My-resources

The my-resources feature allows users to customize their Exegol environment with personal configurations, tools, and scripts. When contributing to my-resources, follow these guidelines:

### Documentation

Any new feature or service added to my-resources must be documented in the following places:

1. Add a description in the [my-resources documentation](/images/my-resources)
2. Include examples and usage instructions
3. Document any dependencies or prerequisites
4. Add any relevant configuration options

### Code

The my-resources functionality is primarily managed through the `load_supported_setup.sh` script. When contributing code:

1. Follow the existing logging pattern:
   ```bash
   wrapper_verbose "Your message"  # For user-visible messages
   logger_verbose "Your message"   # For log file only
   ```

2. Use the appropriate logging levels:
   - `wrapper_info` / `logger_info` - General information
   - `wrapper_verbose` / `logger_verbose` - Detailed information
   - `wrapper_warning` / `logger_warning` - Warning messages
   - `wrapper_error` / `logger_error` - Error messages
   - `wrapper_success` / `logger_success` - Success messages

3. Structure your code following these patterns:
   ```bash
   function deploy_your_feature() {
       wrapper_verbose "Deploying your feature"
       
       # Check if feature directory exists
       if [[ -d "$MY_SETUP_PATH/your_feature" ]]; then
           # Handle existing setup
           logger_verbose "Processing existing setup"
           # Your code here
       else
           # Create new setup
           logger_verbose "Creating new setup"
           mkdir -p "$MY_SETUP_PATH/your_feature"
           # Your code here
       fi
   }
   ```

4. Use the standard paths:
   - `$MY_ROOT_PATH` - Root my-resources directory (`/opt/my-resources`)
   - `$MY_SETUP_PATH` - Setup directory for user customization (`/opt/my-resources/setup`)

5. Handle errors gracefully:
   ```bash
   if ! your_command; then
       wrapper_error "Failed to execute your_command"
       return 1
   fi
   ```

6. Add your new function to the main execution flow in `load_supported_setup.sh`

## Additional Resources

- [Credentials](/images/credentials) - For tools requiring credentials
- [Ports & Services](/images/services) - For tools that open ports or run services 