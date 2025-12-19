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

## Making changes

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

Tools directories need to be installed in `/opt/tools`. Binaries can be installed in `/opt/tools/bin` directly.

### Required components

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

### Installation methods

::: tabs

== Python (pipx)
```bash
# From GitHub
pipx install --system-site-packages git+https://github.com/AUTHOR/REPO

# From local sources
git -C /opt/tools/ clone --depth 1 https://github.com/AUTHOR/REPO
pipx install --system-site-packages /opt/tools/yourtool/

# if a requirement needs to be added in the tool's venv
pipx inject yourtool therequirement
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

In order for the venv to be transparent for the user, the following alias can then be set (cf. the `add-aliases` line in the install function)
```bash
alias yourtool.py="/opt/tools/yourtool/venv/bin/python3 /opt/tools/yourtool/yourtool.py"
# or a direct call to the binary if any (and it has the right executable permissions)
alias yourtool.py="/opt/tools/yourtool/venv/bin/yourtool.py"
```

== APT
Add the package to the appropriate `install_*_apt_tools()` function in the package file.

== Go
```bash
go install -v github.com/AUTHOR/REPO@latest
asdf reshim golang
```

The `go install` command will work with the default version of golang (managed via `asdf`), currently being 1.22.2, set in `package_base`, in the `install_go()` function, with `asdf set --home golang 1.22.2`.

If another version is needed, when a tool requires go >= 1.22.2, the following template can be used:

```bash
mkdir /opt/tools/TOOL_NAME
cd /opt/tools/TOOL_NAME
asdf set golang 1.24.4
mkdir -p .go/bin
GOBIN=/opt/tools/TOOL_NAME/.go/bin go install -v github.com/REPO_NAME/TOOL_NAME@latest
asdf reshim golang
add-aliases TOOL_NAME
```

And then the alias being like:

```bash
alias TOOL_NAME="/opt/tools/TOOL_NAME/.go/bin/TOOL_NAME"
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

== Compile
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

> [!TIP]
> It's usually preferred to compile the binary and then remove sources to cut some weight. in this case, standalone binary should be installed in `/opt/tools/bin` directly instead of having a subdir in `/opt/tools/` with a single executable file in it. 

```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    git -C /tmp/ clone --depth 1 https://github.com/AUTHOR/REPO
    cd /tmp/yourtool
    ./configure
    make
    mv ./bin/yourtool /opt/tools/bin/yourtool
    cd /
    rm -rf /tmp/yourtool
    add-history yourtool
    add-test-command "yourtool --help"
    add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
}
```

== Download release
```bash
function install_yourtool() {
    colorecho "Installing yourtool"
    local URL
    URL=$(curl --location --silent "https://api.github.com/repos/AUTHOR/REPO/releases/latest" | grep 'browser_download_url.*somestring.*tar.xz"' | grep -o 'https://[^"]*')
    curl --location -o /tmp/yourtool.tar.xz "$URL"
    tar -xf /tmp/yourtool.tar.xz --directory /tmp
    rm /tmp/yourtool.tar.xz
    mv /tmp/yourtool/yourtool /opt/tools/bin/yourtool
    add-history yourtool
    add-test-command "yourtool --help"
    add-to-list "yourtool,https://github.com/AUTHOR/REPO,description"
}
```

> [!NOTE]
> Install tools in `/opt/tools/` or place binaries in `/opt/tools/bin/`.

:::

### Temporary fixes (tempfix)

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

### Multi-architecture support

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

### Testing your changes

Before submitting a pull request, test your installation locally with a locally built exegol image (see [wrapper/cli/build](wrapper/cli/build)):

```bash
# Build the local image
exegol build "testimage" "full" --build-log "/tmp/exegol_testimage.log"

# Create and start a container for the tests
exegol start "testcontainer" "testimage"

# Run the tests (from the container)
cat /.exegol/build_pipeline_tests/all_commands.txt | grep -vE "^\s*$" | sort -u > /.exegol/build_pipeline_tests/all_commands.sorted.txt
python3 /.exegol/build_pipeline_tests/run_tests.py
cat /.exegol/build_pipeline_tests/failed_commands.log

# Test your additions manually
...
```
> [!TIP] Recover disk space after failed custom image builds
>  
> When building a custom Exegol image, failed builds can leave intermediate layers and artifacts on the system. These leftovers are not automatically removed and can consume a significant amount of disk space.
>  
> To safely free up space, use the following command:
>  
> ```bash
> docker image prune          # remove dangling images
> ```
> 

## Additional resources

- [Credentials](/images/credentials) - For tools requiring credentials
- [Ports & Services](/images/services) - For tools that open ports or run services 
