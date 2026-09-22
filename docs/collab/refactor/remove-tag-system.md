# Remove Tag System

## Intent

Remove the blog's tag data, navigation, presentation, query helpers, and generated routes. Legacy tag URLs should become normal 404 responses rather than redirecting.

## Progress

- Added build-backed acceptance tests for tag metadata, routes, and links.
- Removed tag metadata from existing posts and the new-post template.
- Removed tag-specific UI, routes, localization, and content utilities.
- Updated architecture and collaboration documentation.
- Updated deployment CI to run the acceptance tests before upload.

## Verification

- The build-backed tag removal tests pass.
- Astro type checking reports no diagnostics.
- All implementation, test, CI, and documentation files changed by this branch pass ESLint.
- Full-project lint remains blocked by pre-existing Markdown formatting errors outside this branch's scope.

## Next Step

Open a pull request and squash-merge after review and CI success.
