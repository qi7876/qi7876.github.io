import {
  defineConfig,
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [presetWind3(), presetAttributify()],
  theme: {
    fontFamily: {
      title: "serif",
      navbar: "serif",
      time: "serif",
    },
  },
  rules: [
    [
      "scrollbar-hidden",
      {
        "scrollbar-width": "none",
        "-ms-overflow-style": "none",
      },
    ],
  ],
  shortcuts: {
    "uno-desktop-column": "fixed right-[max(5rem,calc(50vw-35rem))] w-14rem",
    "uno-decorative-line": "mb-4.5 h-0.25 w-10 bg-black/25 lg:(mb-6 w-11)",
    "uno-round-border": "border border-black/5 rounded border-solid",
  },
  variants: [
    (matcher) => {
      if (!matcher.startsWith("cjk:")) {
        return matcher;
      }
      return {
        matcher: matcher.slice(4),
        selector: (s) => `${s}:is(:lang(zh), :lang(ja), :lang(ko))`,
      };
    },
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
