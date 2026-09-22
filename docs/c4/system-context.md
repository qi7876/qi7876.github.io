# System Context

```mermaid
flowchart LR
  reader[Reader]
  author[Author]
  blog[qi-areas static blog]
  github[GitHub repository and Actions]
  analytics[Google Analytics]

  reader -->|Reads published posts| blog
  author -->|Writes Markdown and configuration| github
  github -->|Builds and deploys| blog
  blog -->|Sends anonymous usage events| analytics
```

The blog publishes multilingual Markdown posts as static pages on GitHub Pages. Readers can browse posts, switch languages, read feeds, and visit the About page. The site has no tag navigation or tag-specific URLs.
