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
- About page: `src/content/about/about.md`.
- Site configuration: `src/config.ts`.
- Styles: `src/styles/global.css`.
- Architecture: [`docs/architecture/`](docs/architecture/).

Markdown supports math through KaTeX and code highlighting through Shiki. Draft posts appear only in development.

Post pages omit description and Open Graph description metadata; no excerpts are generated. Other pages use the site description.

GitHub Actions builds and deploys updates to `main`, with manual deployment also available.

## License

[MIT](LICENSE).
