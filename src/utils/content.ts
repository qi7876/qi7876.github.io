import type { CollectionEntry } from "astro:content";
import type { Post } from "@/types";
import { getCollection } from "astro:content";

/** Find duplicate post slugs across all posts. */
export function checkPostSlugDuplication(posts: CollectionEntry<"posts">[]): string[] {
  const slugs = new Set<string>();
  const duplicates: string[] = [];

  for (const post of posts) {
    const slug = post.data.abbrlink || post.id;
    if (slugs.has(slug)) {
      duplicates.push(`Duplicate post slug "${slug}"`);
    }
    slugs.add(slug);
  }

  return duplicates;
}

export async function getPostLists() {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());

  const pinnedPosts: Post[] = [];
  const postsByYear = new Map<number, Post[]>();
  for (const post of posts) {
    if (post.data.pin > 0) {
      pinnedPosts.push(post);
      continue;
    }

    const year = post.data.published.getFullYear();
    const yearPosts = postsByYear.get(year);
    if (yearPosts) {
      yearPosts.push(post);
    } else {
      postsByYear.set(year, [post]);
    }
  }

  // Stable sorting retains publication order for posts with the same pin priority.
  pinnedPosts.sort((a, b) => b.data.pin - a.data.pin);
  return { pinnedPosts, postsByYear };
}
