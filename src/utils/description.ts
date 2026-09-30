import type { CollectionEntry } from 'astro:content'
import MarkdownIt from 'markdown-it'

type ExcerptScene = 'meta' | 'feed'

const markdownParser = new MarkdownIt()
const excerptLengths: Record<ExcerptScene, { cjk: number, other: number }> = {
  meta: {
    cjk: 120,
    other: 240,
  },
  feed: {
    cjk: 70,
    other: 140,
  },
}

const htmlEntityMap: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': '\'',
  '&nbsp;': ' ',
}

// Creates a clean text excerpt with a shorter limit for CJK text.
function getExcerpt(text: string, scene: ExcerptScene): string {
  // Remove HTML tags
  let cleanText = text.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  Object.entries(htmlEntityMap).forEach(([entity, char]) => {
    cleanText = cleanText.replace(new RegExp(entity, 'g'), char)
  })

  // Normalize whitespace
  cleanText = cleanText.replace(/\s+/g, ' ')

  // Normalize CJK punctuation spacing
  cleanText = cleanText.replace(/([。？！："」』])\s+/g, '$1')

  const length = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(cleanText)
    ? excerptLengths[scene].cjk
    : excerptLengths[scene].other

  const excerpt = cleanText.slice(0, length).trim()

  // Remove trailing punctuation and add ellipsis
  if (cleanText.length > length) {
    return `${excerpt.replace(/\p{P}+$/u, '')}...`
  }

  return excerpt
}

// Generates post description from content only.
export function getPostDescription(
  post: CollectionEntry<'posts'>,
  scene: ExcerptScene,
): string {
  const rawContent = post.body || ''
  const cleanContent = rawContent
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/^\s*#{1,6}\s+\S.*$/gm, '') // Remove Markdown headings
    .replace(/\n{2,}/g, '\n\n') // Normalize newlines

  const renderedContent = markdownParser.render(cleanContent)
  return getExcerpt(renderedContent, scene)
}
