import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { base, themeConfig } from "./src/config";

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
