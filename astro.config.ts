import { unified } from "@astrojs/markdown-remark";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import Compress from "astro-compress";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import { base, themeConfig } from "./src/config";
import { rehypeCodeCopyButton } from "./src/plugins/rehype-code-copy-button.mjs";
import { rehypeExternalLinks } from "./src/plugins/rehype-external-links.mjs";
import { rehypeHeadingAnchor } from "./src/plugins/rehype-heading-anchor.mjs";
import { rehypeImageProcessor } from "./src/plugins/rehype-image-processor.mjs";
import { remarkDisableBareAutolinks } from "./src/plugins/remark-disable-bare-autolinks.mjs";

const { url: site } = themeConfig.site;
const { imageHostURL } = themeConfig.preload ?? {};
const imageConfig = imageHostURL
  ? { image: { domains: [imageHostURL], remotePatterns: [{ protocol: "https" }] } }
  : {};

export default defineConfig({
  site,
  base,
  trailingSlash: "always", // Not recommended to change
  compressHTML: true,
  ...imageConfig,
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push", "gtag"],
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
      remarkPlugins: [remarkMath, remarkDisableBareAutolinks],
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
      type: "shiki",
    },
    shikiConfig: {
      // Available themes: https://shiki.style/themes
      theme: "github-light",
    },
  },
  devToolbar: {
    enabled: false,
  },
});
