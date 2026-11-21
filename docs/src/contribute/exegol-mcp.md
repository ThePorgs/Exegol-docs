# Contributing to Exegol MCP

Exegol MCP is a Model Context Protocol (MCP) server that enables AI assistants and agents to interact with Exegol. This service allows AI clients (such as Cursor, Claude Desktop, etc.) to use Exegol and work on offensive security tasks such as Capture The Flag, penetration testing, etc.

For more information about using the tool, see the [Exegol MCP documentation](/mcp/).

> [!NOTE]
> Exegol MCP v2 is the current line. Contributions target it.

## Getting started

1. Fork the [Exegol-MCP](https://github.com/ThePorgs/Exegol-MCP) repository
2. Checkout the `dev` branch (if any, `main` branch else)
3. (optional) create a new branch in your fork, if you plan on working on different topics
4. Create your content using this guide
5. Make sure your changes work locally: the tests, lint and type checks below pass
6. Stage, Commit, and Push your changes
7. Submit a Pull Request (https://github.com/ThePorgs/Exegol-MCP/compare)

## Development setup

The project needs Python 3.10 or later and [PDM](https://pdm-project.org/).

```bash
pdm install
```

This installs Exegol MCP in editable mode with its `dev` dependency group, which includes the `testing` group (pytest and its plugins, ruff, mypy) and pre-commit.

```bash
pdm run pre-commit install
```

This installs the git hooks: the pre-commit hooks run on every commit, and mypy runs before every push.

## Running the tests

The whole suite runs with a single command:

```bash
pdm run pytest
```

It needs **no Docker daemon and no Exegol container**: the tests drive the server against an in-process fake of the Exegol layer, and the live suites described below skip themselves unless they are explicitly enabled. CI proves it by running the suite with `DOCKER_HOST` pointed at a socket that does not exist, so a test that reaches Docker fails there instead of passing on the runner's own daemon. The same check works locally:

```bash
DOCKER_HOST=unix:///nonexistent/docker.sock pdm run pytest
```

Each test has a 120-second timeout, so a hang fails with a traceback instead of stalling the run.

## Lint and type checks

```bash
pdm run pre-commit run --all-files
pdm run mypy --check-untyped-defs --pretty
```

The pre-commit hooks are the Exegol wrapper's set (whitespace, end-of-file, YAML and TOML checks, test file naming, shellcheck and others) plus `ruff check`. The ruff formatter is not enforced, so code is not reformatted wholesale. mypy reads its settings from `pyproject.toml` and checks the `exegol_mcp` package.

## Live tests (opt-in)

Some scenarios can only be checked against a real Docker daemon and real Exegol images. They live in `tests/test_live_exec.py` and `tests/test_live_lifecycle.py`, and each runs only when its environment variable is set. They start the real server over stdio with the current user's home directory, `config.yml` and Docker.

> [!WARNING]
> The live tests change real Docker state: they run commands in the container they are given, and create, stop, start and remove containers. The lifecycle suite never stops, removes or changes a container created by hand, but the live tests should still run on a development host, never on one holding engagement data.

- `EXEGOL_MCP_LIVE_CONTAINER`: the name of an existing Exegol container (its Exegol name, without the `exegol-` prefix). Enables the command execution and background job scenarios.

  ```bash
  EXEGOL_MCP_LIVE_CONTAINER=mcp-dev pdm run pytest tests/test_live_exec.py -q
  ```

- `EXEGOL_MCP_LIVE_IMAGE`: the name of an installed Exegol image. Enables the lifecycle scenario: it creates a container from the image, uses the file tools on it, stops and restarts it, then removes it without keeping its workspace or logs.

  ```bash
  EXEGOL_MCP_LIVE_IMAGE=full pdm run pytest tests/test_live_lifecycle.py -q
  ```

- `EXEGOL_MCP_LIVE_PROFILE` <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>: the name of an Exegol container profile listed under `profiles.allowed` in `config.yml`. Together with `EXEGOL_MCP_LIVE_IMAGE`, it also creates and removes a container from that profile. Profiles may need a Pro, Team or Enterprise licence on the host.

  ```bash
  EXEGOL_MCP_LIVE_IMAGE=full EXEGOL_MCP_LIVE_PROFILE=local.redteam pdm run pytest tests/test_live_lifecycle.py -q
  ```

## Continuous integration

Every pull request to a branch other than `main`, and every push to a branch other than `dev` and `main`, runs the reusable test workflow:

- the code checks: mypy and the pre-commit hooks, `ruff check` included;
- the unit tests on Python 3.10, 3.11, 3.12, 3.13 and 3.14, with `DOCKER_HOST` pointed at a dead socket and a step that fails if any `EXEGOL_MCP_LIVE_*` variable is set;
- a mypy compatibility matrix covering those five Python versions on Windows, Linux and macOS targets;
- a build check that builds the source and wheel distributions, installs each one in a fresh environment and runs `exegol-mcp --help`.

A pull request to `main` first checks that the package version is a release number, `X.Y.Z`, or a beta or release candidate, `X.Y.ZbN` or `X.Y.ZrcN`. It then runs the same workflow, unless it comes from this repository's own `dev` branch, whose pushes already ran it; a pull request from a fork is always tested, whatever its branch name. Publishing only runs after those jobs pass: a push to `dev` publishes a nightly build to Test PyPI, and a release tag (`X.Y.Z`, `X.Y.ZbN` or `X.Y.ZrcN`, which must equal the package version) publishes to Test PyPI and PyPI. The distributions are built in a job with no write token; the publishing jobs alone can request a publishing token, and they only upload what that build produced. Every workflow token is read-only by default, and every third-party action is pinned to a commit.

> [!NOTE]
> Pull requests that only change `.github/` files or Markdown files do not trigger these workflows.
