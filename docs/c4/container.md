# Container Diagram

```mermaid
flowchart LR
  subgraph repository[Git repository]
    content[Markdown content]
    source[Astro and TypeScript source]
    tests[Node test suite]
  end

  action[GitHub Actions build]
  artifact[Static HTML, CSS, JS and feeds]
  pages[GitHub Pages]
  browser[Reader browser]
  analytics[Google Analytics]

  content --> action
  source --> action
  tests --> action
  action --> artifact
  artifact --> pages
  pages --> browser
  browser --> analytics
```

- Astro validates the content schema and generates localized post, About, RSS, Atom, sitemap, and 404 outputs.
- GitHub Actions runs the build-backed test suite before uploading the static artifact.
- GitHub Pages serves the artifact; missing legacy tag URLs use the static 404 page.
