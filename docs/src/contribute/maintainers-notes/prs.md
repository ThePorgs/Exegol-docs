# PRs management

When handling pull requests, maintainers may need to synchronize contributor forks:

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

External contributor PRs targeting `dev` are squash-merged. Release merges of `dev` → `main` (images) use a merge commit instead; see [Images](./images).

## Review guidelines

1. **Code quality**
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
