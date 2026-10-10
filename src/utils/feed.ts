import type { ImageMetadata } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getImage } from 'astro:assets'
import { getCollection } from 'astro:content'
import { Feed } from 'feed'
import MarkdownIt from 'markdown-it'
import { parse } from 'node-html-parser'
import sanitizeHtml from 'sanitize-html'
import { base, themeConfig } from '@/config'
import { memoize } from '@/utils/cache'
import { getPostDescription } from '@/utils/description'

const markdownParser = new MarkdownIt()
const { title, description, url, author } = themeConfig.site
const { follow } = themeConfig.seo ?? {}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Feed HTML is rendered separately from article pages, so local images need
// Astro asset URLs that feed readers can resolve outside the site.
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/**/*.{jpeg,jpg,png,gif,webp,svg,avif}',
)

/**
 * Converts relative image paths to absolute URLs
 *
 * @param srcPath - Relative image path from markdown content
 * @param baseUrl - Site base URL
 * @returns Optimized absolute image URL
 */
async function _getAbsoluteImageUrl(srcPath: string, baseUrl: string) {
  const absolutePath = decodeURIComponent(new URL(srcPath, 'file:///src/content/posts/').pathname)
  const imageImporter = imagesGlob[absolutePath]

  if (!imageImporter) {
    throw new Error(`Feed image "${srcPath}" not found at "${absolutePath}"`)
  }

  // Import image module and extract its metadata
  const { default: imageMetadata } = await imageImporter()

  // Create optimized image from metadata
  const optimizedImage = await getImage({ src: imageMetadata })
  return new URL(optimizedImage.src, baseUrl).toString()
}

// Export memoized version
const getAbsoluteImageUrl = memoize(_getAbsoluteImageUrl)

/**
 * Fix relative image paths in HTML content
 *
 * @param htmlContent HTML content string
 * @param baseUrl Base URL of the site
 * @returns Processed HTML string with all image paths converted to absolute URLs
 */
async function fixRelativeImagePaths(htmlContent: string, baseUrl: string): Promise<string> {
  const htmlDoc = parse(htmlContent)
  const images = htmlDoc.getElementsByTagName('img')
  await Promise.all(images.map(async (img) => {
    const src = img.getAttribute('src')
    if (!src) {
      return
    }

    if (/^[a-z][a-z\d+.-]*:/i.test(src)) {
      return
    }

    const absoluteImageUrl = src.startsWith('/')
      ? new URL(src, baseUrl).href
      : await getAbsoluteImageUrl(src, baseUrl)
    img.setAttribute('src', absoluteImageUrl)
  }))

  return htmlDoc.toString()
}

/**
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Generate a feed object supporting both RSS and Atom formats
 *
 * @returns A Feed instance ready for RSS or Atom output
 */
export async function generateFeed() {
  const siteURL = `${url}${base}/`

  // Create Feed instance
  const feed = new Feed({
    title,
    description,
    id: siteURL,
    link: siteURL,
    language: 'en',
    copyright: `Copyright © ${new Date().getFullYear()} ${author}`,
    updated: new Date(),
    generator: 'Astro-Theme-Retypeset with Feed for Node.js',

    feedLinks: {
      rss: new URL(`${base}/rss.xml`, url).toString(),
      atom: new URL(`${base}/atom.xml`, url).toString(),
    },

    author: {
      name: author,
      link: `${url}${base}/`,
    },
  })

  // Exclude drafts from the feed
  const posts = await getCollection(
    'posts',
    ({ data }: { data: CollectionEntry<'posts'>['data'] }) => {
      return !data.draft
    },
  )

  // Sort posts by published date in descending order and limit to the latest 25
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime())
    .slice(0, 25)

  // Add posts to feed
  for (const post of recentPosts) {
    const slug = post.data.abbrlink || post.id
    const link = new URL(`posts/${slug}/`, siteURL).toString()

    // Optimize content processing
    const postContent = post.body
      ? sanitizeHtml(
          await fixRelativeImagePaths(
            // Remove HTML comments before rendering markdown
            markdownParser.render(post.body.replace(/<!--[\s\S]*?-->/g, '')),
            `${url}${base}/`,
          ),
          {
            // Allow <img> tags in feed content
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          },
        )
      : ''

    // publishDate -> Atom:<published>, RSS:<pubDate>
    const publishDate = new Date(post.data.published)
    // updateDate -> Atom:<updated>, RSS has no update tag
    const updateDate = post.data.updated ? new Date(post.data.updated) : publishDate

    feed.addItem({
      title: post.data.title,
      id: link,
      link,
      description: getPostDescription(post, 'feed'),
      content: postContent,
      author: [{
        name: author,
        link: `${url}${base}/`,
      }],
      published: publishDate,
      date: updateDate,
    })
  }

  // Add follow verification if available
  if (follow?.feedID && follow?.userID) {
    feed.addExtension({
      name: 'follow_challenge',
      objects: {
        feedId: follow.feedID,
        userId: follow.userID,
      },
    })
  }

  return feed
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Generate RSS 2.0 format feed
export async function generateRSS() {
  const feed = await generateFeed()

  // Add XSLT stylesheet to RSS feed
  let rssXml = feed.rss2()
  rssXml = rssXml.replace(
    '<?xml version="1.0" encoding="utf-8"?>',
    `<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet href="${base}/feeds/rss-style.xsl" type="text/xsl"?>`,
  )

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

// Generate Atom 1.0 format feed
export async function generateAtom() {
  const feed = await generateFeed()

  // Add XSLT stylesheet to Atom feed
  let atomXml = feed.atom1()
  atomXml = atomXml.replace(
    '<?xml version="1.0" encoding="utf-8"?>',
    `<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet href="${base}/feeds/atom-style.xsl" type="text/xsl"?>`,
  )

  return new Response(atomXml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  })
}
