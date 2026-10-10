# Images Release steps

1. Prepare the `dev` branch:
   - Create a PR `dev` → `main` named `Release X.Y.Z` (or `Release X.Y.ZbI`)
   - The PR description must list all major changes
   - Ensure image docs stay aligned with image features, and that the documentation PR is ready
   - Ensure all pre-release workflows pass
   - Get maintainer approval

2. Ensure the Exegol-docs `dev-images` → `main` PR is ready and documents all major changes

3. Merge `dev` → `main` PR on [Exegol-images](https://github.com/ThePorgs/Exegol-images/pulls)'s GitHub as a **merge commit** (squash merges are for external PRs targeting `dev`). The **Fast-forward dev to main** workflow then fast-forwards `dev` to that merge.

4. Merge the [Exegol-docs](https://github.com/ThePorgs/Exegol-docs/pulls)'s pull requests on GitHub:
   - `dev` → `main`, which includes the tools lists
   - `dev-images` → `main` (if any)

5. Create and push the tag from `main`. The message is `Release X.Y.Z[bI]`:

```bash
git checkout main
git pull
git tag "X.Y.Z" -m "Release X.Y.Z"
git push origin --tags
```

6. Create the GitHub release:
   - Point it at the created tag
   - Name it `Exegol images X.Y.Z`
   - Generate release notes
   - Set it as the latest release
