# qi-blog

qi-blog is a static blog built with Astro and published on GitHub Pages. Thanks to [Astro](https://astro.build/) and [Retypeset](https://github.com/radishzzz/astro-theme-retypeset), made by radishzzz, for the framework and original theme.

## Development

Use Node.js 24 and pnpm 12.6.0 (the version pinned in `package.json`).

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and validate it with `pnpm check`.

`pnpm build` generates the site in `dist/`; `pnpm preview` serves that output locally. GitHub Actions runs `pnpm check && pnpm build` before deployment. There is no automated test suite.

Site titles, navigation, and footer text use Georgia with a generic serif fallback, without a font-style setting. Body text uses the system UI font; dates (including update labels) and code use system monospace fonts.

Dates always use `YYYY-MM-DD` and KaTeX is always enabled, with its stylesheet loaded directly. Page background and text use browser light-mode defaults; gray accents and image borders remain styled. There are no global or color settings. SEO verification and analytics configuration support Google only.

Pinned posts appear first, ordered by pin priority and then publication date. Other posts form one list in reverse publication order, without year grouping. Article images link to the displayed image URL, which may be optimized by Astro. These links are added with JavaScript; existing image links and captions are preserved. With JavaScript disabled, images still display. Typography uses shared rules without CJK-specific CSS overrides.

Content uses Markdown (`.md`). Bare URLs and email addresses remain plain text. Use explicit Markdown links such as `[label](url)`, reference links, or `<https://example.com>` for clickable links. The site uses a white background, black text, and gray accents, with GitHub Light code highlighting. All site images have a 1px solid black border with square corners. The site uses a centered single column with the same typography and layout on desktop and mobile. Qi and Posts/About navigation sit at the top at the same font size, with an underline marking the active section. Posts, About, and article pages share a 2rem page-title size. Post lists show the publication date and title on one row at the same font size; long titles wrap beside the date. Optional update dates appear only on article pages. The footer contains only the copyright notice. Styles are maintained in one native CSS stylesheet. Text selection uses browser defaults. Page links use native browser navigation without page transitions or proactive page prefetching.

Mermaid diagram rendering, media embed directives, admonitions, fold directives, and galleries are not supported.

RSS/Atom subscriptions and comments are not supported.

Link previews use the static `public/images/social.png`. Edit `public/images/social.svg` and regenerate the PNG with `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/social.svg').png().toFile('public/images/social.png')"` to update it.

Run `pnpm format` to format the repository with Oxfmt defaults, including Astro files, then fix CJK/English and CJK/number spacing in Markdown with lint-md. lint-md only enforces those two spacing rules.

`pnpm check` runs Astro type checking, Oxlint, Oxfmt formatting checks, and Markdown spacing checks. `pnpm format` applies formatting and Markdown spacing fixes. The pre-commit hook formats staged files and applies safe lint fixes to staged JavaScript and TypeScript.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions checks, builds, and deploys it. Future changes should keep validation and builds passing. Architecture notes are in [`docs/architecture/`](docs/architecture/).
