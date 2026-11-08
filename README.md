# qi-blog

A personal blog built with [Astro](https://astro.build/) and deployed to [GitHub Pages](https://qi7876.github.io/), based on [Retypeset](https://github.com/radishzzz/astro-theme-retypeset).

## Development

Use Node.js 24 and pnpm 12.6.0.

```sh
pnpm install
pnpm dev
```

| Command        | Purpose                                                 |
| -------------- | ------------------------------------------------------- |
| `pnpm check`   | Run type, lint, formatting, and Markdown spacing checks |
| `pnpm format`  | Apply formatting and Markdown spacing fixes             |
| `pnpm build`   | Generate the static site in `dist/`                     |
| `pnpm preview` | Preview the production build locally                    |

## Content and configuration

- Posts: `src/content/posts/` (Markdown with frontmatter defined in `src/content.config.ts`).
- About page: `src/content/about.md`.
- Site metadata, copyright start year, and Google verification: `src/config.ts`.
- Styles: `src/styles/global.css`.
- Architecture: [`docs/architecture.md`](docs/architecture.md).

Post filenames determine their URLs. Frontmatter requires `title` and `published`, with optional `updated` and `draft` fields.

Markdown supports math through KaTeX and code highlighting through Shiki. Draft posts appear only in development.

Post pages omit description and Open Graph description metadata; no excerpts are generated. Other pages use the site description.

The site is deployed at the domain root; deployment under a subpath is not supported. Article images are stored locally in the repository; no remote image processing is configured.

The site includes a sitemap, robots.txt, canonical URLs, and Google Search Console verification for search discovery. It does not load analytics or visitor tracking scripts.

GitHub Actions checks and builds pull requests and updates to `main`. Only `main` deploys to GitHub Pages; manual deployment from `main` is also available.

## License

[MIT](LICENSE).
