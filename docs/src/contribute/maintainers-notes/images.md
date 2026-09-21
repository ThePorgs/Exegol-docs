# Images Release steps

1. Prepare the `dev` branch:
   - Create a PR `dev` → `main` named `Release X.Y.Z` (or `Release X.Y.ZbI`)
   - The PR description must list all major changes
   - Ensure image docs stay aligned with image features, and that the documentation PR is ready
   - Ensure all pre-release workflows pass
   - Get maintainer approval

2. Ensure the Exegol-docs `dev-images` → `main` PR is ready and documents all major changes

3. Merge `dev` → `main` PR on GitHub as a **merge commit** (squash merges are for external PRs targeting `dev`)

4. Fast-forward `main` with `dev`:
```bash
git checkout main
git pull --all
git checkout dev
git pull --all
git merge --ff-only main
git push
```

5. Create and push the tag:

```bash
git tag "X.Y.Z"
git push origin --tags
```

6. Merge the Exegol-docs `dev` → `main` PR on GitHub, which includes the tools lists. 

7. Merge the Exegol-docs `dev-images` → `main` PR on GitHub (if any)

8. Create the GitHub release:
   - Point it at the created tag
   - Name it `Exegol images X.Y.Z`
   - Generate release notes
   - Set it as the latest release
