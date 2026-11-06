# qi-blog

qi-blog is a static blog built with Astro and published on GitHub Pages. Special thanks go to [Retypeset](https://github.com/radishzzz/astro-theme-retypeset) made by radishzzz.

## Development

Use Node.js 24 and pnpm 12.6.0 (the version pinned in `package.json`).

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and check it with `pnpm check` and `pnpm test`.

`pnpm build` generates the site in `dist/`. `pnpm test` runs that full build before testing the generated pages, so deployment does not require a prior local build.

Content uses Markdown (`.md`). Bare URLs and email addresses remain plain text. Use explicit Markdown links such as `[label](url)`, reference links, or `<https://example.com>` for clickable links. The site uses a white background, black text, and gray accents, with GitHub Light code highlighting. All site images have a 1px solid black border with square corners. The post list shows the same publication date, optional update date, and reading time as article pages. Posts/About navigation sits directly above the footer, with an underline marking the active section. Text selection uses browser defaults. Footer links use browser-default colors and underlines. Page navigation has no decorative animations.

Mermaid diagram rendering, media embed directives, admonitions, fold directives, and galleries are not supported.

RSS/Atom subscriptions and comments are not supported.

Link previews use the static `public/images/social.png`. Edit `public/images/social.svg` and regenerate the PNG with `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/social.svg').png().toFile('public/images/social.png')"` to update it.

Run `pnpm format` to format the repository with Oxfmt defaults, including Astro files, then fix CJK/English and CJK/number spacing in Markdown with lint-md. lint-md only enforces those two spacing rules. `pnpm format:posts` limits formatting to posts and About pages.

`pnpm format:check` checks formatting without writing files. `pnpm lint` runs Oxlint, and `pnpm lint:fix` applies its safe fixes. `pnpm check` runs lint and formatting checks; deployment runs it before `pnpm test`. The pre-commit hook applies the same formatting and safe lint fixes to staged files.

Oxlint replaces ESLint using its default correctness rules. Astro template linting and UnoCSS-specific lint rules are no longer checked; `astro check`, the build, and the generated-page tests remain in place.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions builds, tests, and deploys it. Future changes should keep the build green and add behavior tests for user-visible features. Architecture notes are in [`docs/architecture/`](docs/architecture/).
