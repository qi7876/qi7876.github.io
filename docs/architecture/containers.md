# Container Diagram

```mermaid
flowchart LR
  subgraph repository[Git repository]
    content[Markdown content]
    source[Astro and TypeScript source]
  end

  action[GitHub Actions build]
  artifact[Static HTML, CSS and JS]
  pages[GitHub Pages]
  browser[Reader browser]
  analytics[Google Analytics]

  content --> action
  source --> action
  action --> artifact
  artifact --> pages
  pages --> browser
  browser --> analytics
```

- Astro validates the content schema and generates post, About, sitemap, and 404 outputs.
- GitHub Actions runs type, lint, and formatting checks, then builds and uploads the static artifact.
- GitHub Pages serves the artifact; missing legacy tag URLs use the static 404 page.
- Readers navigate through native browser page loads without a client router or proactive page prefetching. Native CSS provides a shared single-column layout across viewport sizes.
