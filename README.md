# qi-areas

qi-areas is a static blog built with Astro and published on GitHub Pages. The interface uses English labels, while Markdown posts and the About page can mix languages. The site also provides RSS and Atom feeds.

## Development

Use Node.js 24 and pnpm 12.6.0 (the version pinned in `package.json`).

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and check it with `pnpm test` and `pnpm lint`.

`pnpm build` generates the site in `dist/`. `pnpm test` runs that full build before testing the generated pages, so deployment does not require a prior local build.

Run `pnpm format:posts` to format Markdown posts and About pages with Prettier, lint-md, and markdownlint-cli2.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions builds, tests, and deploys it. Future changes should keep the build green and add behavior tests for user-visible features. Architecture notes are in [`docs/architecture/`](docs/architecture/).
