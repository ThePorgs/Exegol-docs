# Wrapper

Release process for the Exegol Python wrapper.

## Preparation

1. Confirm git hooks are installed:

```bash
pre-commit install
```

2. Update the wrapper repository and its submodules. Point `exegol-images` and `exegol-resources` at the latest `main`.

```bash
git pull
git -C exegol-images checkout main
git -C exegol-images pull
git -C exegol-resources checkout main
git -C exegol-resources pull
```

> [!NOTE]
> Reload and **commit** any **submodule update** at this step.

3. Run the pre-commit tests:

```bash
pre-commit run -a --hook-stage pre-push
```

## Configuration review

- Review `exegol.config.ConstantConfig` variables
  - Change the version number (remove the alpha or beta tag at the end)
- Review `exegol.utils.imgsync.spawn.sh` version
  - Must contain a line with the current script version, in the form `# Spawn Version:2` (no alpha or beta letter)
- Review documentation on `Exegol-docs` (`dev-wrapper`). Wrapper docs must stay aligned with wrapper features. Keep the docs PR open; it is merged after the wrapper is released.
- Review `README.md`
- Commit and push the last changes
- Create the PR, or take it out of draft mode

> [!NOTE]
> The pull request must **already** exist and **not** be in draft before the latest stable version is pushed.

## Review and publish

The PR is then ready for peer review and merge on GitHub.

Once it is merged to `master`, a tag must be deployed to run the release pipeline. The GitHub Action pipeline builds and publishes automatically.

Example for a new version:

```bash
export WV=5.1.13

git fetch
git merge --ff-only origin/master
git tag -s "$WV" -m "$WV"
git push --tags
git push
```

## Post-release

- Create a new GitHub **release** with the **new** version tag
- Merge the documentation PR once the wrapper is released

After a stable wrapper release, the `dev` branch must stay on a beta version:

- Change the wrapper version on `dev` to `x.y.zb1`
- Update the version number in `tests.test_exegol.py` to the next version build
- Commit the updates
