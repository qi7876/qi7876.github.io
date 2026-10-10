# qi-blog

qi-blog is a static blog built with Astro and published on GitHub Pages. Special thanks go to [Retypeset](https://github.com/radishzzz/astro-theme-retypeset) made by radishzzz.

## Development

Use Node.js 24 and pnpm 12.6.0 (the version pinned in `package.json`).

Install dependencies with `pnpm install`, run the site with `pnpm dev`, and check it with `pnpm test` and `pnpm lint`.

`pnpm build` generates the site in `dist/`. `pnpm test` runs that full build before testing the generated pages, so deployment does not require a prior local build.

Article tables of contents are always enabled for level 2–4 headings. They use a monospace `TREE` layout with `└` markers and two-character indentation per heading level. A block-character reading progress bar and percentage sit below the list, measuring from the article body to the point where its end is visible. On desktop, the heading list appears beneath Qi in the right sidebar. On mobile, the bottom-right ToC button opens a floating panel above it and switches to a close icon. The article remains scrollable; the panel closes on the same button, an outside click, Escape, or heading selection. Articles without eligible headings have no ToC.

Branding, navigation, dates, and ToCs use the system monospace stack. Article text uses the system sans-serif stack by default; set `global.fontStyle` to `mono` in `src/config.ts` to use monospace for body text too.

Content uses Markdown (`.md`). Theme changes are immediate, with simple color transitions; page navigation has no decorative animations.

Mermaid diagram rendering, media embed directives, admonitions, fold directives, and galleries are not supported.

Lightning CSS has draft scroll navigation controls enabled to recognize the ToC's native `:target-current` selector.

RSS and Atom feeds include absolute URLs for local images anywhere under `src/content/posts/`, including per-post folders in `assets/` and the legacy `attachments/` directory. Missing local feed images fail the build.

Link previews use the static `public/images/social.png`. Edit `public/images/social.svg` and regenerate the PNG with `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/social.svg').png().toFile('public/images/social.png')"` to update it.

Run `pnpm format:posts` to format Markdown posts and About pages with Prettier, lint-md, and markdownlint-cli2.

## Status and next steps

The site is live and maintained on `main`. GitHub Actions builds, tests, and deploys it. Future changes should keep the build green and add behavior tests for user-visible features. Architecture notes are in [`docs/architecture/`](docs/architecture/).
