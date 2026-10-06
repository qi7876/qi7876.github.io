import { unified } from '@astrojs/markdown-remark'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'
import Compress from 'astro-compress'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import UnoCSS from 'unocss/astro'
import { base, themeConfig } from './src/config'
import { rehypeCodeCopyButton } from './src/plugins/rehype-code-copy-button.mjs'
import { rehypeExternalLinks } from './src/plugins/rehype-external-links.mjs'
import { rehypeHeadingAnchor } from './src/plugins/rehype-heading-anchor.mjs'
import { rehypeImageProcessor } from './src/plugins/rehype-image-processor.mjs'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'

const { url: site } = themeConfig.site
const { imageHostURL } = themeConfig.preload ?? {}
const imageConfig = imageHostURL
  ? { image: { domains: [imageHostURL], remotePatterns: [{ protocol: 'https' }] } }
  : {}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always', // Not recommended to change
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport', // hover, tap, viewport, load
  },
  ...imageConfig,
  vite: {
    css: {
      lightningcss: {
        // Enable parsing of the native ToC :target-current selector.
        drafts: { scrollNavigationControls: true },
      },
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
    sitemap(),
    Compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: false,
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMath,
        remarkReadingTime,
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        rehypeHeadingAnchor,
        rehypeImageProcessor,
        rehypeExternalLinks,
        rehypeCodeCopyButton,
      ],
    }),
    syntaxHighlight: {
      type: 'shiki',
    },
    shikiConfig: {
      // Available themes: https://shiki.style/themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
})
