import type { CollectionEntry } from 'astro:content'
import type { Post } from '@/types'
import { getCollection, render } from 'astro:content'
import { memoize } from '@/utils/cache'

const metaCache = new Map<string, { minutes: number }>()

/**
 * Add metadata including reading time to a post
 *
 * @param post The post to enhance with metadata
 * @returns Enhanced post with reading time information
 */
async function addMetaToPost(post: CollectionEntry<'posts'>): Promise<Post> {
  const cacheKey = post.id
  const cachedMeta = metaCache.get(cacheKey)
  if (cachedMeta) {
    return {
      ...post,
      remarkPluginFrontmatter: cachedMeta,
    }
  }

  const { remarkPluginFrontmatter } = await render(post)
  const meta = remarkPluginFrontmatter as { minutes: number }
  metaCache.set(cacheKey, meta)

  return {
    ...post,
    remarkPluginFrontmatter: meta,
  }
}

/** Find duplicate post slugs across all posts. */
export async function checkPostSlugDuplication(posts: CollectionEntry<'posts'>[]): Promise<string[]> {
  const slugs = new Set<string>()
  const duplicates: string[] = []

  for (const post of posts) {
    const slug = post.data.abbrlink || post.id
    if (slugs.has(slug)) {
      duplicates.push(`Duplicate post slug "${slug}"`)
    }
    slugs.add(slug)
  }

  return duplicates
}

/**
 * Get all posts (including pinned ones, excluding drafts in production)
 *
 * @returns Posts enhanced with metadata, sorted by date
 */
async function _getPosts() {
  const filteredPosts = await getCollection(
    'posts',
    ({ data }: CollectionEntry<'posts'>) => {
      // Show drafts in dev mode only
      const shouldInclude = import.meta.env.DEV || !data.draft
      return shouldInclude
    },
  )

  const enhancedPosts = await Promise.all(filteredPosts.map(addMetaToPost))

  return enhancedPosts.sort((a, b) =>
    b.data.published.valueOf() - a.data.published.valueOf(),
  )
}

export const getPosts = memoize(_getPosts)

/**
 * Get all non-pinned posts
 *
 * @returns Regular posts (non-pinned)
 */
async function _getRegularPosts() {
  const posts = await getPosts()
  return posts.filter(post => !post.data.pin)
}

export const getRegularPosts = memoize(_getRegularPosts)

/**
 * Get pinned posts sorted by pin priority
 *
 * @returns Pinned posts sorted by pin value in descending order
 */
async function _getPinnedPosts() {
  const posts = await getPosts()
  return posts
    .filter(post => post.data.pin && post.data.pin > 0)
    .sort((a, b) => (b.data.pin ?? 0) - (a.data.pin ?? 0))
}

export const getPinnedPosts = memoize(_getPinnedPosts)

/**
 * Group posts by year and sort within each year
 *
 * @returns Map of posts grouped by year (descending), sorted by date within each year
 */
async function _getPostsByYear(): Promise<Map<number, Post[]>> {
  const posts = await getRegularPosts()
  const yearMap = new Map<number, Post[]>()

  posts.forEach((post: Post) => {
    const year = post.data.published.getFullYear()
    let yearPosts = yearMap.get(year)
    if (!yearPosts) {
      yearPosts = []
      yearMap.set(year, yearPosts)
    }
    yearPosts.push(post)
  })

  // Sort posts within each year by date
  yearMap.forEach((yearPosts) => {
    yearPosts.sort((a, b) => {
      const aDate = a.data.published
      const bDate = b.data.published
      return bDate.getMonth() - aDate.getMonth() || bDate.getDate() - aDate.getDate()
    })
  })

  return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]))
}

export const getPostsByYear = memoize(_getPostsByYear)
