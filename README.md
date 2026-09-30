# qi-blog

qi-blog is a static blog built with Astro and published on GitHub Pages. Special thanks go to [Retypeset](https://github.com/radishzzz/astro-theme-retypeset) made by radishzzz.

## Development

Use Node.js 24 and pnpm 12.6.0 (the version pinned in `package.json`).

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and check it with `pnpm test` and `pnpm lint`.

`pnpm build` generates the site in `dist/`. `pnpm test` runs that full build before testing the generated pages, so deployment does not require a prior local build.

Content uses Markdown (`.md`). Theme changes are immediate, with simple color transitions; page navigation has no decorative animations.

Mermaid code blocks render in the browser and follow the current theme. Media embed directives, admonitions, fold directives, and galleries are not supported.

Link previews use the static `public/images/social.png`. Edit `public/images/social.svg` and regenerate the PNG with `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/social.svg').png().toFile('public/images/social.png')"` to update it.

Run `pnpm format:posts` to format Markdown posts and About pages with Prettier, lint-md, and markdownlint-cli2.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions builds, tests, and deploys it. Future changes should keep the build green and add behavior tests for user-visible features. Architecture notes are in [`docs/architecture/`](docs/architecture/).
