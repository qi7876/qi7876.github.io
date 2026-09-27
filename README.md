# qi-areas

qi-areas is a multilingual static blog built with Astro and published on GitHub Pages. Posts are written in Markdown; the site also provides RSS and Atom feeds.

## Development

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and check it with `pnpm test` and `pnpm lint`.

Run `pnpm format:posts` to format Markdown posts with Prettier, lint-md, and markdownlint-cli2. The existing `pnpm format-posts` command applies autocorrect to Markdown content.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions builds, tests, and deploys it. Future changes should keep the build green and add behavior tests for user-visible features. Architecture notes are in [`docs/c4/`](docs/c4/).
