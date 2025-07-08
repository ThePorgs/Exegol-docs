---
icon: shield-check
---

# Maintainers Notes

This document provides technical details and processes for Exegol maintainers. It complements the [contributors](/contribute/intro) documentation.

## Build and Release Processes

### Wrapper Release Process

>[!SUCCESS]
> The wrapper documentation must be aligned with the wrapper features.
> The docs PR can be merged once the wrapper is released.

#### Preparation Steps

1. Update project and submodules:
   - Point exegol-images and exegol-resources submodules to latest master
   - Keep base reference up to date

```bash
# Update wrapper repo
git pull

# Update submodules
git -C exegol-docker-build checkout main
git -C exegol-docker-build pull
git -C exegol-resources checkout main
git -C exegol-resources pull
```

> [!NOTE] Important
> Don't forget to **reload and commit** any **submodule update** at this step!

2. Local Testing & Build:
   - Run mypy type checking
   - Execute tests and build distribution

```bash
# Type checking
mypy exegol.py --ignore-missing-imports --check-untyped-defs

# Test and build
python3 setup.py clean test && \
   (rm -rf Exegol.egg-info && python3 -m build --sdist) || \
   echo "Some tests failed, check your code and requirements before publishing!"
```

> [!WARNING]
> **Requires** [build](https://packaging.python.org/en/latest/tutorials/packaging-projects/#generating-distribution-archives) package installed!

>[!SUCCESS]
> Exegol can only be published through a **source** build distribution because of the source code files for building local images.

3. Configuration Review:
   - Review exegol.config.ConstantConfig variables
     - Change version number (remove alpha/beta tag)
   - Review exegol.utils.imgsync.spawn.sh version
     - Must contain: `# Spawn Version:2` (without alpha/beta letter)
   - Review documentation on Exegol-docs/dev-wrapper
   - Review README.md
   - Create PR (or put it out of draft mode)

> [!NOTE] Important
> The Pull-Request must be **already** created and **NOT** be in draft state before pushing the latest stable version.

#### Release Process

1. After PR review and merge to master:
   - Create and push a signed tag
   - Example for version 4.3.5:
   ```bash
   git checkout master
   git pull
   git tag -s 4.3.5 -m '4.3.5'
   git push --tags
   ```

2. Post-release:
   - Create new GitHub release with version tag
   - Update dev branch:
   ```bash
   git checkout dev
   git merge master --ff-only
   git push
   ```
   - Update version to next beta (x.y.zb1)
   - Update tests.test_exegol.py version number to next version build
   - Commit updates

### Images Release Process

>[!SUCCESS]
> The images documentation must be aligned with the images features.
> Ensure documentation PR is ready before release.

#### Release Steps

1. Prepare dev branch:
   - Create PR `dev -> main` named `Release X.Y.Z` (or `Release X.Y.ZbI`)
   - PR comment must indicate all major changes
   - Ensure all pre-release workflows pass
   - Get maintainer approval

2. Merge process:
   ```bash
   git checkout main
   git pull --all
   git checkout dev
   git pull --all
   git merge --ff-only main
   git push
   ```

3. Create and push tag:
   ```bash
   git tag "X.Y.Z"
   git push origin --tags
   ```

4. Create GitHub release:
   - Point to created tag
   - Name as "Exegol images X.Y.Z"
   - Generate release notes
   - Set as latest release

## CI/CD Pipeline

The Exegol project uses a private CI/CD pipeline for continuous integration and deployment. The pipeline handles:

- Building and testing on multiple architectures
- Automated testing of installed tools
- Documentation updates
- Image building and publishing
- Resource management

### Pipeline Components

1. **Wrapper Pipeline**
   - Handles Python package builds
   - Runs tests on commits and PRs
   - Publishes to PyPI
   - Manages version control and releases

2. **Images Pipeline**
   - Builds AMD64 and ARM64 images
   - Runs tool installation tests
   - Exports tools list to documentation
   - Manages Docker image publishing
   - Handles multi-architecture builds

3. **Documentation Pipeline**
   - Builds documentation on commits and PRs
   - Manages branch synchronization
   - Handles ReadTheDocs integration
   - Automatically updates tool lists

4. **Resources Pipeline**
   - Automatically updates resources (monthly)
   - Exports resource lists to documentation
   - Manages offline resource distribution

### Pipeline Management

The CI/CD pipeline is hosted in a private repository for enhanced security and control. This allows for:

- Better access control
- Customized runner configurations
- Optimized resource allocation
- Enhanced security measures

#### Runner Requirements

The pipeline requires runners with specific capabilities:

- Architecture support: AMD64 and ARM64
- Minimum disk space: ~100GB
- Docker support
- Sufficient CPU and RAM resources

#### Common Pipeline Issues

1. **Disk Space Issues**
   ```
   You are running out of disk space. The runner will stop working when the machine runs out of disk space. Free space left: 62 MB
   ```
   Solution: Clean up old images and build artifacts

2. **Authentication Issues**
   - Ensure proper token configuration
   - Check runner permissions
   - Verify secret management

## Pull Request Management

When handling pull requests, maintainers may need to synchronize contributor forks. This can be done using:

```bash
git clone "git@github.com:USER/FORK" "dest_dir"
cd dest_dir
git remote add upstream "git@github.com:ThePorgs/REPO"
git fetch upstream
git checkout "TARGET_FORK_BRANCH"
git merge --no-edit upstream/"ORIGIN_BRANCH"
# Resolve conflicts if any
git push
```

### PR Review Guidelines

1. **Code Quality**
   - Check for proper error handling
   - Verify type hints and documentation
   - Ensure backward compatibility
   - Review test coverage

2. **Documentation**
   - Verify documentation updates
   - Check for proper formatting
   - Ensure all new features are documented
   - Validate code examples

3. **Security**
   - Review for potential security issues
   - Check for proper input validation
   - Verify authentication mechanisms
   - Ensure no sensitive data is exposed

4. **Performance**
   - Check for resource usage
   - Verify build times
   - Review memory consumption
   - Test on different architectures
