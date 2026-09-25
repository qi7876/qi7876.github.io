# fix/deploy-pages-node24

## Intent

Update the GitHub Pages deployment action to a release that declares Node 24, following GitHub's retirement of Node 20 on Actions runners.

## Progress

- Confirmed `actions/deploy-pages@v4` declares `node20` and `@v5` declares `node24`.
- Updated the deployment workflow to `actions/deploy-pages@v5`.
- Validated the workflow YAML and passed `pnpm test` (3 tests).

## Next steps

- Verify the workflow on GitHub Actions after the branch is pushed.
- Remove this branch note after squash merge.
