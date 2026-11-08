import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { siteConfig } from "./src/config";

export default defineConfig({
  site: siteConfig.url,
  trailingSlash: "always", // Not recommended to change
  compressHTML: true,
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
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
