# qi-areas Collaboration Notes

## Project

qi-areas is a static blog built with Astro and deployed to GitHub Pages. Posts are authored in Markdown and exposed through HTML pages plus RSS and Atom feeds. The interface uses English labels; content can mix languages.

## Current State

- The long-lived branch is `main`; feature work uses short-lived branches.
- The site provides post lists, post pages, an About page, feeds, sitemap generation, and optional analytics.
- Tags are intentionally not part of the content model or public navigation.
- GitHub Actions builds, tests, and deploys the static site.

## Next Steps

- Keep `main` buildable and review changes through small, focused pull requests.
- Add behavior tests alongside future user-visible features.
- Update the C4 and collaboration notes when system boundaries or deployment behavior change.
