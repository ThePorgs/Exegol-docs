# Installation for contributors

While we recommend regular users to install Exegol using `pipx` for simplicity and isolation (see [First install](/first-install)), contributors and developers should install from sources. Here's why and how.

## Requirements

Before starting, ensure you have all the requirements from the [First install](/first-install) guide (git, python3, docker).

## Why install from sources?

When contributing to Exegol, installing from sources provides several advantages:

1. **Direct code access**: you can modify the code directly and test your changes immediately
2. **Branch switching**: easily switch between release and development branches
3. **Auto-update feature**: the wrapper knows how to self-update when installed from sources
4. **Development tools**: access to development dependencies and testing frameworks
5. **Version control**: direct integration with Git for contributing changes

## Installation steps

### 1. Fork Exegol

1. Go to [github.com/ThePorgs/Exegol](https://github.com/ThePorgs/Exegol)
2. Click the "Fork" button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for the fork to complete

This creates your own copy of the repository where you can make changes without affecting the original project.

### 2. Clone your fork

Clone your fork of the Exegol repository:

```bash
# Replace YOUR_USERNAME with your GitHub username
git clone "https://github.com/YOUR_USERNAME/Exegol" && cd Exegol

# Add the upstream repository to easily keep your fork in sync
git remote add upstream "https://github.com/ThePorgs/Exegol"
```

### 3. Virtual environment

For development, we recommend using a [virtual environment](https://docs.python.org/3/library/venv.html) to isolate dependencies:

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate
```

Then, install both the runtime and development dependencies:

```bash
# Install runtime dependencies
pip3 install -r requirements.txt
```

Deactivate the virtual environment when done:

```bash
deactivate
```

### 4. Finalize setup

You can now run Exegol with the following command:

```bash
# On Linux
sudo /path/to/Exegol/venv/bin/python3 /path/to/Exegol/exegol.py

# On macOS, Windows
/path/to/Exegol/venv/bin/python3 /path/to/Exegol/exegol.py
```

To make this version of Exegol accessible system-wide, you can create an alias or symbolic link, and name it `exegol-dev` so that it can coexist with the production/official version:

```bash
# Create a symbolic link, from the Exegol directory
sudo ln -s "$(pwd)/exegol.py" "/usr/local/bin/exegol-dev"
```

For security reasons on Linux, we recommend running Exegol with `sudo` rather than adding your user to the docker group. You can create an alias for convenience:

```bash
# For bash
echo "alias exegol-dev='sudo -E $(which exegol-dev)'" >> ~/.bash_aliases
source ~/.bashrc
```

Once this is done, you can have both the pipx installation (for regular use) and the source installation (for development) at the same time. Here's how to manage them:

```bash
# Regular install
exegol version

# Source install
exegol-dev version
```

## Development workflow

### Branch management

Create a new branch for each feature or fix. This branch will be used for your local development and will be pushed to your fork when you stage, commit, and push your changes:

```bash
git checkout -b type/description
```

Branch naming conventions (preferred, not mandatory):
- `feat/` - new features (e.g., `feat/add-toolxyz`)
- `fix/` - bug fixes (e.g., `fix/toolxyz-install`)
- `docs/` - documentation updates (e.g., `docs/update-install-guide`)
- `refactor/` - code refactoring (e.g., `refactor/install-scripts`)
- `perf/` - performance improvements (e.g., `perf/clean-up-artefactxyz`)

### Keeping your fork updated

To keep your development branch in sync with upstream changes:

```bash
# Fetch latest changes from upstream
git fetch upstream

# Make sure you're on your development branch
git checkout feat/your-feature-name

# Merge upstream dev branch into your development branch
git merge upstream/dev

# If there are conflicts, resolve them and then
git add .
git commit -m "Merge upstream dev"
```

### Commit signing

We strongly recommend signing your commits when contributing to Exegol. While it's a strict requirement for internal contributors, we prefer signed commits from external contributors as well. See our [Signing Commits](/contribute/signing-commits) guide for detailed instructions.

### Submitting changes

1. Push your changes to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. Create a Pull Request from your fork's branch to the upstream repository's `dev` branch
3. Wait for review and address any feedback
4. Once approved, your changes will be merged into the development branch