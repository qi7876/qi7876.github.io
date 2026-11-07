import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export interface ThemeConfig {
  site: {
    title: string;
    description: string;
    author: string;
    url: string;
    base: string;
    favicon: string;
  };
  seo?: {
    verification?: {
      google?: string;
    };
    googleAnalyticsID?: string;
  };
  footer: {
    startYear: number;
  };
  preload?: {
    imageHostURL?: string;
    customGoogleAnalyticsJS?: string;
  };
}
